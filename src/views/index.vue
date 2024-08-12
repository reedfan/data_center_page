<template>
  <div style="margin: 0; width: 100%; height: auto; overflow: hidden; min-height: 100vh" id="main">
    <router-view></router-view>
  </div>
</template>

<script>
import { resetForm, Notify, baseUrl, downLoad, dateFormat } from '@/api/common'
import * as monaco from 'monaco-editor/esm/vs/editor/edcore.main'
import { language } from 'monaco-editor/esm/vs/basic-languages/sql/sql'
import 'monaco-editor/esm/vs/basic-languages/sql/sql.contribution'
export default {
  name: 'index',
  data() {
    return {}
  },

  mounted() {
    let that = this
    that.$watermark.set(that.$store.state.userInfo.account + '  ' + dateFormat('YYYY-mm-dd HH:MM:SS', new Date()))
    that.isTimeOutInterval()
  },

  created() {
    window.addEventListener(
      'click',
      () => {
        // 为了方便，我们把点击事件的时间直接存到localStorage中去，这样方便获取比较
        localStorage.setItem('lastClickTime', new Date().getTime().toString())
      },
      true
    )
  },
  destroyed() {
    let that = this
    clearInterval(that.interval)
    window.removeEventListener('click', () => {}, true)
  },
  // watch: {
  //   $route(to, from) {
  //     this.$store.state.pathList.forEach((item, index) => {
  //       if (item.children.length == 0) {
  //         if (item.path == to.path) {
  //           this.$store.state.breadCrumb1 = item.title
  //           this.$store.state.breadCrumb2 = ''
  //         }
  //       } else {
  //         item.children.forEach((item2, index2) => {
  //           if (item2.path == to.path) {
  //             this.$store.state.breadCrumb1 = item.title
  //             this.$store.state.breadCrumb2 = item2.title
  //           }
  //         })
  //       }
  //     })
  //   }
  // },
  methods: {
    isTimeOut() {
      let that = this
      let lastClickTime = localStorage.getItem('lastClickTime') * 1
      let nowTime = new Date().getTime() // 获取当前时间
      if (nowTime - lastClickTime > 1000 * 60 * 30) {
        clearInterval(that.interval)
        that
          .$alert('由于长时间未操作，您的登录认证已失效，请重新登录', '认证失效', {
            confirmButtonText: '重新登录',
            showClose: false,
            type: 'error'
          })
          .then(() => {
            sessionStorage.removeItem('vuex')
            sessionStorage.removeItem('token')
            that.$router.push('/login')
          })
      }
    },
    isTimeOutInterval() {
      let that = this
      clearInterval(that.interval)
      that.interval = setInterval(function () {
        that.isTimeOut()
      }, 60000)
    }
  }
}
</script>
<style>
</style>
