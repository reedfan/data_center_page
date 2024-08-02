<template>
  <div style="width: 100%; height: 100vh; margin: 0 auto; overflow: hidden; background: #f5f5fc">
    <transition name="animate__animated animate__bounce" enter-active-class="animate__slideInDown" leave-active-class="animate__slideInUp">
      <div class="manageTop" v-show="mountedShow" style="">
        <div style="" @click="$router.push('/')" class="logoImg">
          <!-- <p style="width: auto; height: 34px; text-align: left; color: #ffffff; line-height: 34px; font-size: 30px; background-image: -webkit-linear-gradient(top, rgb(31, 46, 84), rgb(31, 66, 94)); font-weight: border; -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 3px">Hive数据质量系统</p> -->
        </div>
        <div class="topRight">
          <div class="screenfull_icon" @click="screenfull">
            <i :class="iconclass"></i>
            <p v-if="screenIsFull">关闭全屏</p>
            <p v-if="!screenIsFull">全屏</p>
          </div>
          <el-popover placement="bottom" trigger="hover">
            <div class="userInfoUnit">
              <i></i>
              <div>
                <p>{{ $store.state.userInfo.account }}({{ $store.state.userInfo.fullName }})</p>
                <p>{{ $store.state.userInfo.phone }}</p>
                <p>{{ $store.state.userInfo.email }}</p>
              </div>
            </div>
            <div slot="reference" class="userUnit">
              <i></i>
              <p>{{ $store.state.userInfo.account }}</p>
            </div>
          </el-popover>

          <div></div>
          <div @click="logOut()">
            <i></i>
            <p>退出登录</p>
          </div>
        </div>
      </div>
    </transition>
    <div style="width: 100%; height: calc(100% - 78px)">
      <div style="width: 100%; height: 100%; margin: 0 auto">
        <transition name="animate__animated animate__bounce" enter-active-class="animate__slideInLeft" leave-active-class="animate__slideOutLeft">
          <div v-show="mountedShow" style="height: 100%; float: left; background: #1f2e54" :style="isCollapse ? 'width: 96px' : 'width: 260px'">
            <div style="height: 60px; margin: 0 auto" :style="isCollapse ? 'width: 96px' : 'width: 260px'">
              <i class="iconHideMenu" @click="changeIsCollapse(true)" v-if="!isCollapse"></i>
              <i class="iconShowMenu" @click="changeIsCollapse(false)" v-if="isCollapse"></i>
            </div>
            <el-menu v-if="menuShow" @select="handleSelect" :default-active="menuActive" :unique-opened="true" class="leftSubmenu" :collapse="isCollapse">
              <template v-for="(item, index) in this.$store.state.pathList">
                <el-submenu class="haveChildren" v-bind:index="item.title" v-bind:key="index" v-if="item.children.length > 0">
                  <template slot="title">
                    <i v-bind:class="item.icon"></i>
                    <span>{{ item.title }}</span>
                  </template>
                  <el-menu-item-group>
                    <el-menu-item style="padding-left: 20px" v-for="(item1, index1) in item.children" v-if="item1.isShow == '1'" v-bind:index="item1.path" v-bind:key="index1">
                      <p>{{ item1.icon }}</p>
                      <p>{{ item1.title }}</p>
                    </el-menu-item>
                  </el-menu-item-group>
                </el-submenu>
                <el-menu-item class="haveNoChildren" v-else v-bind:index="item.path" v-bind:key="index">
                  <i v-bind:class="item.icon"></i><span slot="title">{{ item.title }}</span>
                </el-menu-item>
              </template>
            </el-menu>
          </div>
        </transition>
        <transition name="animate__animated animate__bounce" enter-active-class="animate__slideInRight" leave-active-class="animate__slideOutRight">
          <div style="height: calc(100% - 32px); margin-top: 16px; float: right; margin-right: 16px" v-show="mountedShow" v-if="mainShow" :style="isCollapse ? 'width: calc(100% - 128px);' : 'width: calc(100% - 292px);'">
            <!-- <el-breadcrumb separator-class="el-icon-arrow-right" class="breadCrumb">
              <el-breadcrumb-item v-if="this.$store.state.breadCrumb1 != ''">{{ this.$store.state.breadCrumb1 }}</el-breadcrumb-item>
              <el-breadcrumb-item v-if="this.$store.state.breadCrumb2 != ''">{{ this.$store.state.breadCrumb2 }}</el-breadcrumb-item>
            </el-breadcrumb> -->
            <div style="width: 100%; height: calc(100% - 1px)">
              <router-view></router-view>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import screenfull from 'screenfull'
import request from '@/api/request'
import { Notify, loginUrl, logoutUrl } from '@/api/common'
export default {
  name: 'manage',
  data() {
    return {
      isCollapse: false,
      menuShow: true,
      mountedShow: false,
      mainShow: true,
      menuActive: '',
      manageName: '管理员',
      userInfo: {},
      screenIsFull: false,
      iconclass: [],
      fullscreen: ['el-icon-full-screen'],
      exitFullscreen: ['el-icon-close']
    }
  },
  watch: {
    $route(to, from) {
      this.menuActive = to.path
    }
  },
  methods: {
    initFullScreen() {
      if (screenfull.isEnabled) {
        this.iconclass = this.fullscreen
        screenfull.on('change', this.fullScreenChange)
      }
    },

    fullScreenChange() {
      if (screenfull.isFullscreen) {
        this.iconclass = this.exitFullscreen
        this.screenIsFull = true
      } else {
        this.iconclass = this.fullscreen
        this.screenIsFull = false
      }
    },
    screenfull() {
      if (!screenfull.isEnabled) {
        this.$message({ message: '你的浏览器不支持全屏', type: 'warning' })
        return false
      }
      screenfull.toggle()
    },
    handleSelect(key, keyPath, text) {
      let urlText = keyPath[keyPath.length - 1].split(',')
      this.$router.push(urlText[0])
    },

    logOut() {
      sessionStorage.removeItem('vuex')
      sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    changeIsCollapse(flag) {
      this.isCollapse = flag
      // this.mainShow = false
      // setTimeout(() => {
      //   this.mainShow = true
      // }, 1)
    }
  },
  mounted() {
    this.initFullScreen()
    this.menuActive = this.$route.path
    this.$store.state.pathList.forEach((item, index) => {
      if (item.children.length == 0) {
        if (item.path == this.$route.path) {
          this.$store.state.breadCrumb1 = item.title
          this.$store.state.breadCrumb2 = ''
        }
      } else {
        item.children.forEach((item2, index2) => {
          if (item2.path == this.$route.path) {
            this.$store.state.breadCrumb1 = item.title
            this.$store.state.breadCrumb2 = item2.title
          }
        })
      }
    })
    ;(window.onresize = () => {
      return (() => {
        this.$store.state.globalHeight = document.documentElement.clientHeight
        // this.mainShow = false
        // setTimeout(() => {
        //   this.mainShow = true
        // }, 100)
      })()
    }),
      this.$nextTick(() => {
        this.$store.state.globalHeight = document.documentElement.clientHeight
        setTimeout(() => {
          this.mountedShow = true
        }, 100)
      })
  }
}
</script>

<style>
.leftSubmenu {
  width: 100% !important;
  text-align: left;
  background: none;
  border: none;
  height: calc(100% - 84px);
  margin-top: 14px;
  overflow: hidden auto;
}

.el-menu-index {
  margin-top: 40px;
}
.el-submenu.haveChildren {
  width: 260px;
  margin-bottom: 20px;
}
.el-menu--collapse .el-submenu.haveChildren {
  width: 91px;
}
.el-submenu.haveChildren .el-submenu__title {
  width: 220px;
  margin-left: 20px;
  font-size: 18px;
  color: #ffffff;
  height: 46px;
  line-height: 46px;
  padding: 0 16px !important;
}
.el-menu--collapse .el-submenu.haveChildren .el-submenu__title {
  width: 56px;
}
.el-submenu.haveChildren.is-active .el-submenu__title {
  color: #77bcff;
}
.el-menu--collapse .el-submenu.haveChildren.is-active .el-submenu__title,
.el-menu--collapse .el-submenu.haveChildren .el-submenu__title:hover {
  background: linear-gradient(90deg, #2442ff 0%, #3da7ff 100%) !important;
  border-radius: 6px;
}

.el-submenu.haveChildren .el-submenu__title:hover {
  color: #77bcff;
  background: none;
}
.el-submenu.haveChildren .el-submenu__title > i {
  display: block;
  float: left;
}
.el-submenu.haveChildren .el-submenu__title > i.SJCS {
  width: 26px;
  height: 21px;
  margin-right: 14px;
  margin-top: 13px;
  background: url('../../assets/manage/home/SJCS.png') center no-repeat;
  background-size: 100% 100%;
}
.el-menu--collapse .el-submenu.haveChildren.is-active .el-submenu__title > i.SJCS,
.el-menu--collapse .el-submenu.haveChildren .el-submenu__title:hover > i.SJCS {
  background: url('../../assets/manage/home/SJCS.png') center no-repeat;
  background-size: 100% 100%;
}
.el-submenu.haveChildren.is-active .el-submenu__title > i.SJCS,
.el-submenu.haveChildren .el-submenu__title:hover > i.SJCS {
  background: url('../../assets/manage/home/SJCSH.png') center no-repeat;
  background-size: 100% 100%;
}
.el-submenu.haveChildren .el-submenu__title > i.MXSJ {
  width: 24px;
  height: 24px;
  margin-right: 16px;
  margin-top: 10px;
  background: url('../../assets/manage/home/MXSJ.png') center no-repeat;
  background-size: 100% 100%;
}
.el-menu--collapse .el-submenu.haveChildren.is-active .el-submenu__title > i.MXSJ,
.el-menu--collapse .el-submenu.haveChildren .el-submenu__title:hover > i.MXSJ {
  background: url('../../assets/manage/home/MXSJ.png') center no-repeat;
  background-size: 100% 100%;
}
.el-submenu.haveChildren.is-active .el-submenu__title > i.MXSJ,
.el-submenu.haveChildren .el-submenu__title:hover > i.MXSJ {
  background: url('../../assets/manage/home/MXSJH.png') center no-repeat;
  background-size: 100% 100%;
}
.el-submenu.haveChildren .el-submenu__title > i.YWZX {
  width: 24px;
  height: 25px;
  margin-right: 16px;
  margin-top: 9px;
  background: url('../../assets/manage/home/YWZX.png') center no-repeat;
  background-size: 100% 100%;
}
.el-menu--collapse .el-submenu.haveChildren.is-active .el-submenu__title > i.YWZX,
.el-menu--collapse .el-submenu.haveChildren .el-submenu__title:hover > i.YWZX {
  background: url('../../assets/manage/home/YWZX.png') center no-repeat;
  background-size: 100% 100%;
}
.el-submenu.haveChildren.is-active .el-submenu__title > i.YWZX,
.el-submenu.haveChildren .el-submenu__title:hover > i.YWZX {
  background: url('../../assets/manage/home/YWZXH.png') center no-repeat;
  background-size: 100% 100%;
}
.el-submenu.haveChildren .el-submenu__title > i.APIGL {
  width: 24px;
  height: 24px;
  margin-right: 16px;
  margin-top: 10px;
  background: url('../../assets/manage/home/APIGL.png') center no-repeat;
  background-size: 100% 100%;
}
.el-menu--collapse .el-submenu.haveChildren.is-active .el-submenu__title > i.APIGL,
.el-menu--collapse .el-submenu.haveChildren .el-submenu__title:hover > i.APIGL {
  background: url('../../assets/manage/home/APIGL.png') center no-repeat;
  background-size: 100% 100%;
}
.el-submenu.haveChildren.is-active .el-submenu__title > i.APIGL,
.el-submenu.haveChildren .el-submenu__title:hover > i.APIGL {
  background: url('../../assets/manage/home/APIGLH.png') center no-repeat;
  background-size: 100% 100%;
}
.el-submenu.haveChildren .el-submenu__title > i.SJZLZX {
  width: 24px;
  height: 22px;
  margin-right: 16px;
  margin-top: 12px;
  background: url('../../assets/manage/home/SJZLZX.png') center no-repeat;
  background-size: 100% 100%;
}
.el-menu--collapse .el-submenu.haveChildren.is-active .el-submenu__title > i.SJZLZX,
.el-menu--collapse .el-submenu.haveChildren .el-submenu__title:hover > i.SJZLZX {
  background: url('../../assets/manage/home/SJZLZX.png') center no-repeat;
  background-size: 100% 100%;
}
.el-submenu.haveChildren.is-active .el-submenu__title > i.SJZLZX,
.el-submenu.haveChildren .el-submenu__title:hover > i.SJZLZX {
  background: url('../../assets/manage/home/SJZLZXH.png') center no-repeat;
  background-size: 100% 100%;
}
.el-submenu.haveChildren .el-submenu__title > i.ZBXT {
  width: 24px;
  height: 24px;
  margin-right: 16px;
  margin-top: 10px;
  background: url('../../assets/manage/home/ZBXT.png') center no-repeat;
  background-size: 100% 100%;
}
.el-menu--collapse .el-submenu.haveChildren.is-active .el-submenu__title > i.ZBXT,
.el-menu--collapse .el-submenu.haveChildren .el-submenu__title:hover > i.ZBXT {
  background: url('../../assets/manage/home/ZBXT.png') center no-repeat;
  background-size: 100% 100%;
}
.el-submenu.haveChildren.is-active .el-submenu__title > i.ZBXT,
.el-submenu.haveChildren .el-submenu__title:hover > i.ZBXT {
  background: url('../../assets/manage/home/ZBXTH.png') center no-repeat;
  background-size: 100% 100%;
}
.el-submenu.haveChildren.is-active .submenu_title_i {
  color: #2585e7;
}
.el-menu {
  background: none;
}
.el-menu-item {
  height: 46px;
  line-height: 46px;
}
.el-menu-item:hover {
  background-color: #eef0f1;
}
.el-menu-item.is-active {
  color: #4b91ff;
}
.el-menu-item-group__title {
  padding: 0;
}

.haveChildren .el-menu-item {
  width: 220px;
  color: #b0c1eb;
  overflow: hidden;
  padding: 0 !important;
  background: none !important;
  border-radius: 6px;
  margin-left: 20px;
  margin-top: 12px;
}
.haveChildren .el-menu-item p:nth-child(1) {
  width: 26px;
  height: 26px;
  line-height: 26px;
  float: left;
  margin-left: 16px;
  margin-top: 10px;
  background: #1f2e54;
  border-radius: 13px;
  color: #b0c1eb;
  font-size: 16px;
  text-align: center;
}
.haveChildren .el-menu-item p:nth-child(2) {
  width: auto;
  float: left;
  margin-left: 14px;
  font-size: 16px !important;
  height: 46px !important;
  line-height: 46px !important;
}
.el-menu-item-group > ul {
  padding: 10px 0;
  background: #182445;
}
.haveChildren .el-menu-item-group__title {
  padding: 0 !important;
}
.haveChildren .el-menu-item.is-active {
  background: linear-gradient(90deg, #2442ff 0%, #3da7ff 100%) !important;
}
.haveChildren .el-menu-item.is-active p:nth-child(1) {
  background: #ffffff;
  color: #333333;
}
.haveChildren .el-menu-item.is-active p:nth-child(2) {
  color: #ffffff;
}

.haveChildren .el-menu-item:hover,
.haveChildren.el-menu-item:focus {
  background: linear-gradient(90deg, #2442ff 0%, #3da7ff 100%) !important;
  color: #ffffff;
}
.el-submenu__icon-arrow {
  font-size: 18px;
  margin-top: -7px;
  color: #ffffff !important;
  right: 10px !important;
}
.el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
  color: #77bcff !important;
}

.haveNoChildren.el-menu-item {
  width: 220px;
  margin-left: 20px;
  font-size: 18px;
  color: #ffffff;
  height: 46px;
  line-height: 46px;
  padding: 0 16px !important;
  margin-bottom: 20px;
}
.el-menu--collapse .haveNoChildren.el-menu-item {
  width: 56px;
}

.haveNoChildren.el-menu-item i {
  display: block;
  float: left;
}
.el-menu--collapse .el-menu-item.haveNoChildren .el-tooltip {
  padding: 0 !important;
  width: 56px;
  height: 46px;
  display: block;
}
.el-menu--collapse .el-menu-item.haveNoChildren .el-tooltip > i {
  float: none;
  margin: 10px auto;
}
.haveNoChildren.el-menu-item i.Home {
  width: 24px;
  height: 24px;
  margin-right: 16px;
  margin-top: 10px;
  background: url('../../assets/manage/home/Home.png') center no-repeat;
  background-size: 100% 100%;
}
.haveNoChildren.el-menu-item i.MXSJ {
  width: 24px;
  height: 24px;
  margin-right: 16px;
  margin-top: 10px;
  background: url('../../assets/manage/home/MXSJ.png') center no-repeat;
  background-size: 100% 100%;
}
.haveNoChildren.el-menu-item:hover,
.haveNoChildren.el-menu-item:focus {
  background: linear-gradient(90deg, #2442ff 0%, #3da7ff 100%);
  border-radius: 6px;
}
.haveNoChildren.el-menu-item.is-active {
  color: #ffffff;
  background: linear-gradient(90deg, #2442ff 0%, #3da7ff 100%);
  border-radius: 6px;
}
.haveNoChildren.el-menu-item.is-active > i {
  color: #4b91ff;
}
.el-menu--vertical {
  width: 160px !important;
}
.el-menu--popup {
  z-index: 100;
  min-width: 160px;
  border: none;
  padding: 5px 0;
  border-radius: 2px;
  -webkit-box-shadow: none;
  box-shadow: none;
}
.el-menu--popup .el-menu-item-group > ul {
  width: 160px;
  background: #ffffff;
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.16);
  border-radius: 6px;
}
.el-menu--popup .el-menu-item-group .el-menu-item {
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  color: #333333;
}
.el-menu--popup .el-menu-item-group .el-menu-item p:nth-child(1) {
  display: none;
}
.el-menu--popup .el-menu-item-group .el-menu-item.is-active {
  background: #ecf2ff;
}

.manageTop {
  width: 100%;
  height: 78px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0px 4px 8px 0px rgba(140, 140, 216, 0.1);
}
.manageTop .logoImg {
  width: 388px;
  height: 34px;
  margin-top: 24px;
  margin-left: 36px;
  float: left;
  cursor: pointer;
  background: url('../../assets/manage/home/logo.png') center no-repeat;
  background-size: 100% 100%;
}

.manageTop .topRight {
  width: auto;
  height: 78px;
  float: right;
  overflow: hidden;
}
.manageTop .topRight .screenfull_icon {
  cursor: pointer;
  width: auto;
  overflow: hidden;
  height: 60px;
  margin-top: 9px;
  float: left;
  margin-right: 30px;
}
.manageTop .topRight .screenfull_icon > i {
  float: left;
  font-size: 28px;
  cursor: pointer;
  margin: 16px auto 0 auto;
}
.manageTop .topRight .screenfull_icon:hover {
  opacity: 0.5;
}
.manageTop .topRight .screenfull_icon > p {
  width: auto;
  height: 60px;
  line-height: 60px;
  float: right;
  font-size: 18px;
  color: #333333;
  margin: 0 0 0 8px;
}
.manageTop .topRight .userUnit {
  width: auto;
  height: 48px;
  margin-top: 15px;
  float: left;
  overflow: hidden;
  cursor: pointer;
}
.manageTop .topRight .userUnit > i {
  width: 40px;
  height: 40px;
  float: left;
  margin-top: 4px;
  display: block;
  background: url('../../assets/manage/home/userIcon.png') center no-repeat;
  background-size: 100% 100%;
}
.manageTop .topRight .userUnit > p {
  width: auto;
  height: 48px;
  line-height: 48px;
  float: right;
  font-size: 18px;
  color: #333333;
  margin: 0 0 0 12px;
}
.userInfoUnit {
  width: 250px;
  height: 70px;
}
.userInfoUnit > i:nth-child(1) {
  width: 60px;
  height: 60px;
  float: left;
  margin-top: 5px;
  display: block;
  background: url('../../assets/manage/home/userIcon.png') center no-repeat;
  background-size: 100% 100%;
}
.userInfoUnit > div:nth-child(2) {
  width: 180px;
  float: right;
  height: 70px;
}
.userInfoUnit > div:nth-child(2) > p {
  width: 180px;
  height: 20px;
  line-height: 20px;
  margin: 0 auto;
  text-align: left;
  font-size: 14px;
  color: #333333;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.userInfoUnit > div:nth-child(3) > p:nth-child(1) {
  margin-top: 5px;
}

.manageTop .topRight > div:nth-child(3) {
  float: left;
  width: 1px;
  height: 40px;
  margin-left: 40px;
  margin-right: 40px;
  margin-top: 19px;
  background: #eef1f6;
}
.manageTop .topRight > div:nth-child(4) {
  width: auto;
  height: 78px;
  float: right;
  overflow: hidden;
  margin-right: 50px;
  cursor: pointer;
}
.manageTop .topRight > div:nth-child(4) > i {
  width: 40px;
  height: 40px;
  float: left;
  margin-top: 19px;
  display: block;
  background: url('../../assets/manage/home/logOut.png') center no-repeat;
  background-size: 100% 100%;
}
.manageTop .topRight > div:nth-child(4):hover {
  opacity: 0.5;
}
.manageTop .topRight > div:nth-child(4) > p {
  width: auto;
  height: 78px;
  line-height: 78px;
  float: right;
  font-size: 18px;
  color: #333333;
  margin: 0 0 0 12px;
}

.breadCrumb {
  width: 100%;
  height: 14px;
  margin-bottom: 20px;
}
.iconShowMenu {
  cursor: pointer;
  float: right;
  margin-top: 30px;
  margin-right: 30px;
  width: 20px;
  height: 14px;
  background: url('../../assets/manage/home/iconShowMenu.png') center no-repeat;
  background-size: 100% 100%;
}
.iconHideMenu {
  cursor: pointer;
  float: right;
  margin-top: 30px;
  margin-right: 30px;
  width: 20px;
  height: 14px;
  background: url('../../assets/manage/home/iconHideMenu.png') center no-repeat;
  background-size: 100% 100%;
}
</style>
