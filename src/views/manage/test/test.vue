<template>
  <div class="container">
    <div class="topImg"></div>
    <div class="topImg">
      <van-icon name="arrow-left" style="margin-left: 20px" @click="onClickLeft" />
    </div>
    <div class="topImg2">请将人脸对准取景框</div>
    <!-- <div class="progress">
      <div class="progress-num">
        <div class="ring-pseudo">
          <div class="ring-face">
            <div class="ring-num">{{countDown}}</div>
          </div>
        </div>
      </div>
    </div> -->
    <div class="publish">
      <!-- 下载按钮 -->
      <a id="downLoadLink" style="display: none"></a>
      <video ref="video"></video>
      <!-- 视频录制或暂停 -->
      <div style="display: flex; justify-content: space-around">
        <button class="btn" @click="recordOrStop">录制</button>
        <button class="btn" @click="OpenCamera">打开</button>
        <button class="btn" @click="CloseCamera">关闭</button>
      </div>
    </div>
    <van-popup v-model="showLoading" :close-on-click-overlay="false">
      <van-loading type="spinner" color="#1989fa" style="background-color: rgba(0, 0, 0, 0.7); overflow: hidden" />
    </van-popup>
  </div>
</template>

<script>
// import { getFaceVerify } from '@/api/citizenLoans.js'

export default {
  name: 'faceCheck',
  data() {
    return {
      countDown: '5',
      mediaStreamTrack: {}, // 退出时关闭摄像头
      video_stream: '', // 视频stream
      recordedBlobs: [], // 视频音频 blobs
      isRecord: false, // 视频是否正在录制
      params: {
        name: null,
        idcard: null,
        fileName: null,
        fileContent: null
      },
      businessNo: '',
      showLoading: false
    }
  },
  computed: {},
  created() {
    this.OpenCamera()
    // this.showLoading=true
    // let str = JSON.parse(sessionStorage.getItem('form1Date'))
    // this.params.name = str.custName
    // this.params.idcard = str.certNo
    this.$emit('tabbar', false)
  },
  methods: {
    handleNext() {
      this.$router.push('/faceCode')
    },
    OpenCamera() {
      console.log('打开摄像头')
      this.getCamera()
    },
    // 关闭摄像头
    CloseCamera() {
      console.log('关闭摄像头')
      this.$refs.video.srcObject.getTracks()[0].stop()
    },
    // 调用打开摄像头功能
    getCamera() {
      // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
      if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {}
      }
      navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            width: 400,
            height: 300
          }
        })
        .then(stream => {
          console.log(stream)
          console.log(stream instanceof MediaStream)
          // 摄像头开启成功
          this.mediaStreamTrack = typeof stream.stop === 'function' ? stream : stream.getTracks()[0]
          this.video_stream = stream
          console.log(this.video_stream)
          this.$refs.video.srcObject = stream
          this.$refs.video.play()
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 录制或暂停
    recordOrStop() {
      if (this.isRecord) {
        this.stop()
      } else {
        this.record()
        let timer = setInterval(() => {
          // 倒计时减少1秒
          this.countDown--
          // 倒计时结束时清除定时器
          if (this.countDown <= 0) {
            clearInterval(timer)
            this.stop()
            console.log('倒计时结束')
          }
        }, 1000)
      }
    },
    // 视频录制
    record() {
      console.log('record')
      let that = this
      this.isRecord = !this.isRecord
      let mediaRecorder
      let options
      this.recordedBlobs = []
      console.log(this.video_stream, 'this.video_stream')
      if (typeof MediaRecorder.isTypeSupported === 'function') {
        // 根据浏览器来设置编码参数
        if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
          options = {
            MimeType: 'video/webm;codecs=h264'
          }
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
          options = {
            MimeType: 'video/webm;codecs=h264'
          }
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
          options = {
            MimeType: 'video/webm;codecs=vp8'
          }
        }
        mediaRecorder = new MediaRecorder(this.video_stream, options)
      } else {
        // console.log('isTypeSupported is not supported, using default codecs for browser');
        console.log('当前不支持isTypeSupported，使用浏览器的默认编解码器')
        mediaRecorder = new MediaRecorder(this.video_stream)
      }

      mediaRecorder.start()
      // 视频录制监听事件
      mediaRecorder.ondataavailable = e => {
        console.log(e)
        // 录制的视频数据有效
        if (e.data && e.data.size > 0) {
          this.recordedBlobs.push(e.data)
          console.log(this.recordedBlobs, 'this.recordedBlobs')
        }
      }
      // 停止录像后增加下载视频功能，将视频流转为mp4格式
      mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedBlobs, {
          type: 'video/mp4'
        })

        this.recordedBlobs = []
        // 将视频链接转换完可以用于在浏览器上预览的本地视频
        const videoUrl = window.URL.createObjectURL(blob)
        console.log(blob, 'blob')

        console.log(videoUrl, 'videoUrl')

        //blob格式转换为base64格式
        this.blobToDataURI(blob, function (result) {
          // 这里面写对应的方法
          // result是转换后的数据
          console.log(result, 'result')
          that.params.fileContent = result.replace(/^data:video\/\w+;base64,/, '')
        })

        // // 设置下载链接
        // document.getElementById('downLoadLink').href = videoUrl;
        // // 设置下载mp4格式视频
        // document.getElementById('downLoadLink').download = 'media.mp4';
        // document.getElementById('downLoadLink').innerHTML = 'DownLoad video file';
        // 生成随机数字
        const rand = Math.floor(Math.random() * 1000000)
        // 生成视频名
        const name = `video${rand}.mp4`
        this.params.fileName = name
        // // setAttribute() 方法添加指定的属性，并为其赋指定的值
        // document.getElementById('downLoadLink').setAttribute('download', name);
        // document.getElementById('downLoadLink').setAttribute('name', name);

        // // 0.5s后自动下载视频
        setTimeout(() => {
          // document.getElementById('downLoadLink').click();
          this.countDown = 5
          this.getFaceCode()
        }, 500)
      }
    },
    // blob 转 base64
    blobToDataURI(blob, callback) {
      var reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = function (e) {
        callback(e.target.result)
      }
    },

    // 停止录制
    stop() {
      this.isRecord = !this.isRecord
      if (!this.$refs.video.srcObject) return
      const stream = this.$refs.video.srcObject
      const tracks = stream.getTracks()
      // 关闭摄像头和音频
      tracks.forEach(track => {
        track.stop()
      })
    },
    getFaceCode() {
      console.log('人脸视频验证')
      // let postData = new FormData();
      let params = {
        name: this.params.name,
        idcard: this.params.idcard,
        fileName: this.params.fileName,
        fileContent: this.params.fileContent,
        sceneCode: '0204'
      }
      this.showLoading = true
      // postData.append('name', this.params.name);
      // postData.append('idcard', this.params.idcard);
      // postData.append('fileName', this.params.fileName);
      // postData.append('sceneCode', '0204');
      // postData.append('fileContent', this.params.fileContent);
      console.log(params, '+++++++++++++params')
      // getFaceVerify(params)
      //   .then(res => {
      //     console.log(res, '+++++res')
      //     if (res.code == '200') {
      //       this.showLoading = false
      //       this.businessNo = res.msg
      //       this.$router.push({
      //         path: '/faceCode',
      //         query: {
      //           businessNo: this.businessNo
      //         }
      //       })
      //     }
      //   })
      //   .catch(() => {
      //     this.submitLoading = false
      //   })
      //   .finally(() => {
      //     this.submitLoading = false
      //   })
    },
    onClickLeft() {
      this.$router.push({
        path: '/citizenLoans3',
        query: {
          lineType: '3'
        }
      })
    }
  }
}
</script>

<style  scoped>
/deep/ .van-popup {
  background-color: #000;
}
.container {
  width: 100vw;
  height: 100%;
  overflow: hidden;
  color: #212121;
  position: relative;
}
.topImg {
  z-index: 9;
  font-size: 16px;
  width: 100vw;
  height: 40px;
  line-height: 44px;
  background: #fff;
  margin: 0px auto;
  text-align: left;
}
.topImg2 {
  z-index: 9;
  font-size: 16px;
  width: 100vw;
  height: 44px;
  line-height: 44px;
  background: #fff;
  text-align: center;
}
.publish {
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.publish video {
  width: 350px;
  height: 350px;
  /* height: 50vh;*/
  /* border-radius: 50%;*/
  /* position: absolute;
	top: 167px;*/
}
.publish div {
  /* position: absolute;*/
  /* left: calc(50% - 80px);*/
  /* bottom: 180px;*/
  height: 40px;
  width: 100vw;
  color: #000;
  font-size: 14px;
  border-radius: 10px;
  line-height: 40px;
  background-color: #19b3b3;
  text-align: center;
}
.publish div .btn {
  width: 160px;
}
.progress {
  padding: 16px;
  width: 100vw;
  /* height: 800px;*/
  margin: 0 auto;
  border-radius: 5px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}
.progress .progress-num {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}
.progress .ring-pseudo {
  position: relative;
  width: 135px;
  border-radius: 50%;
  height: 135px;
}
.progress .ring-pseudo:before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 108px;
  /* 内环宽度*/
  height: 108px;
  /* 内环高度*/
  border: 17px solid #ffb694;
  /* 圆环颜色*/
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
.progress .ring-face {
  margin: 15px auto;
  width: 108px;
  /* 内环宽度*/
  height: 108px;
  background-color: #e0e0e0;
  opacity: 0.5;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
}
.progress .ring-num {
  text-align: center;
  position: absolute;
  z-index: 10000;
  width: 108px;
  height: 50px;
  line-height: 50px;
  font-size: 58px;
  color: #fff;
  margin: 0 auto;
}
</style>