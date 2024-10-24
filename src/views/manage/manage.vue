<template>
  <div style="width: 100%; height: 100vh; margin: 0 auto; overflow: hidden; background: #f7f8fa; flex-direction: column; box-sizing: border-box; display: flex">
    <div class="manageTop">
      <div class="logoImg">
        <!-- <p style="width: auto; height: 18px; text-align: left; color: #ffffff; line-height: 18px; font-size: 14px; letter-spacing: 3px">指标系统</p> -->
      </div>
      <div class="routeUnit">
        <el-tabs v-model="$store.state.activeTopRoute" @tab-click="topRouteClick">
          <el-tab-pane v-for="(item, index) in this.$store.state.sortPathList" :key="index" :label="item.title" :name="item.title" :routeData="item"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="topRight">
        <el-dropdown trigger="click" class="userDropdown">
          <span class="el-dropdown-link"> {{ $store.state.userInfo.account }}<i class="el-icon-arrow-down el-icon--right"></i> </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><el-button type="text" @click="logOut()">退出登录</el-button></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div style="display: flex; height: calc(100% - 40px); box-sizing: border-box; flex: 1; flex-basis: auto; flex-direction: row">
      <div style="height: 100%; background: #ffffff; border-right: 1px solid #e4e6eb" :style="isCollapse ? 'width: 56px' : 'width: 180px'" v-if="$store.state.pathListLeft.children.length != 0">
        <!-- <div style="height: 60px; margin: 0 auto" :style="isCollapse ? 'width: 96px' : 'width: 180px'">
          <i class="iconHideMenu" @click="changeIsCollapse(true)" v-if="!isCollapse"></i>
          <i class="iconShowMenu" @click="changeIsCollapse(false)" v-if="isCollapse"></i>
        </div> -->
        <div style="height: 50px; margin: 0 auto; border-bottom: 1px solid #e4e6eb" :style="isCollapse ? 'width: 56px' : 'width: 180px'">
          <i style="width: 16px; height: 16px; float: left; margin-top: 17px; margin-left: 20px" :class="$store.state.pathListLeft.icon"></i>
          <p v-if="!isCollapse" style="width: auto; float: left; margin-left: 11px; height: 20px; line-height: 20px; font-size: 14px; margin-top: 15px; color: #1d2129; text-align: left">{{ $store.state.pathListLeft.title }}</p>
        </div>
        <el-menu v-if="menuShow" @select="handleSelect" :default-active="menuActive" :unique-opened="true" class="leftMenu" :collapse="isCollapse">
          <template v-for="(item, index) in $store.state.pathListLeft.children">
            <el-menu-item v-bind:index="item.path" v-bind:key="index">
              <i v-bind:class="item.icon"></i><span slot="title">{{ item.title }}</span>
            </el-menu-item>
          </template>
        </el-menu>
        <div style="height: 40px; margin: 0 auto; border-top: 1px solid #e4e6eb" :style="isCollapse ? 'width: 56px' : 'width: 180px'">
          <i style="color: #1c1e25; font-size: 16px; margin-top: 12px; margin-left: 20px; display: block; cursor: pointer" class="el-icon-s-unfold" @click="changeIsCollapse(false)" v-if="isCollapse"></i>
          <i style="color: #1c1e25; font-size: 16px; margin-top: 12px; margin-left: 20px; display: block; cursor: pointer" class="el-icon-s-fold" @click="changeIsCollapse(true)" v-if="!isCollapse"></i>
        </div>
      </div>
      <div style="height: 100%" :style="$store.state.pathListLeft.children.length == 0 ? 'width:100%;' : isCollapse ? 'width: calc(100% - 56px);' : 'width: calc(100% - 180px);'">
        <!-- <el-breadcrumb separator-class="el-icon-arrow-right" class="breadCrumb">
          <el-breadcrumb-item v-if="this.$store.state.breadCrumb1 != ''">{{ this.$store.state.breadCrumb1 }}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="this.$store.state.breadCrumb2 != ''">{{ this.$store.state.breadCrumb2 }}</el-breadcrumb-item>
        </el-breadcrumb> -->

        <router-view></router-view>
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
      menuActive: '',
      manageName: '',
      screenIsFull: false,
      iconclass: [],
      fullscreen: ['el-icon-full-screen'],
      exitFullscreen: ['el-icon-close']
    }
  },
  watch: {
    $route(to, from) {
      setTimeout(() => {
        this.menuActive = to.path
      }, 100)
    }
  },
  methods: {
    topRouteClick(tab) {
      console.log(tab.$attrs.routeData)
      this.$store.state.pathListLeft = tab.$attrs.routeData
      if (this.$store.state.pathListLeft.children.length == 0) {
        this.$router.push(this.$store.state.pathListLeft.path)
      } else {
        this.$router.push(this.$store.state.pathListLeft.children[0].path)
        this.menuShow = false
        setTimeout(() => {
          this.menuShow = true
        }, 100)
      }
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
    }
  },
  mounted() {
    console.log(this.$store.state.userInfo)
    this.menuActive = this.$route.path
    // this.$store.state.pathList.forEach((item, index) => {
    //   if (item.children.length == 0) {
    //     if (item.path == this.$route.path) {
    //       this.$store.state.breadCrumb1 = item.title
    //       this.$store.state.breadCrumb2 = ''
    //     }
    //   } else {
    //     item.children.forEach((item2, index2) => {
    //       if (item2.path == this.$route.path) {
    //         this.$store.state.breadCrumb1 = item.title
    //         this.$store.state.breadCrumb2 = item2.title
    //       }
    //     })
    //   }
    // })
    ;(window.onresize = () => {
      return (() => {
        this.$store.state.globalHeight = document.documentElement.clientHeight
      })()
    }),
      this.$nextTick(() => {
        this.$store.state.globalHeight = document.documentElement.clientHeight
      })
  }
}
</script>

<style>
.leftMenu {
  width: 100% !important;
  text-align: left;
  background: none;
  border: none;
  height: calc(100% - 92px);
  overflow: hidden auto;
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

.el-menu-item {
  width: 180px;
  font-size: 12px;
  color: #1d2129;
  height: 40px;
  line-height: 40px;
}
.el-menu-item:hover,
.el-menu-item:focus {
  background: #f5f8ff;
}
.el-menu-item.is-active {
  color: #1e69ff;
  background: #f5f8ff;
}
.el-menu-item.is-active > i {
  color: #4b91ff;
}
.el-menu--collapse .el-menu-item {
  width: 56px;
}

.el-menu-item i {
  display: block;
  width: 16px;
  height: 16px;
  margin-top: 12px;
  margin-left: 0;
  margin-right: 11px;

  float: left;
}
.el-menu-item.is-active i {
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

.manageTop {
  height: 40px;
  overflow: hidden;
  background: #1c1e25;
  background: #1c1e25;
  box-shadow: 0 4px 8px 0 #8c8cd81a;
}
.manageTop .logoImg {
  width: 82px;
  height: 18px;
  margin-top: 10px;
  margin-left: 26px;
  float: left;
  background: url('../../assets/manage/home/logo.png') center no-repeat;
  background-size: 100% 100%;
}
.manageTop .routeUnit {
  width: calc(100% - 550px);
  float: left;
  height: 40px;
  margin-left: 20px;
}
.manageTop .routeUnit .el-tabs__item {
  height: 40px;
  line-height: 40px;
  color: #bbbcbe !important;
  font-size: 14px !important;
  font-weight: 400;
}
.manageTop .routeUnit .el-tabs__item.is-active {
  color: #ffffff !important;
}
.manageTop .routeUnit .el-tabs__nav-wrap::after {
  display: none;
}
.manageTop .routeUnit .el-tabs__active-bar {
  background-color: transparent !important;
}
.manageTop .topRight {
  width: 300px;
  height: 40px;
  float: right;
  overflow: hidden;
  text-align: right;
}
.manageTop .topRight .userDropdown {
  margin-right: 30px;
  cursor: pointer;
  height: 40px;
  line-height: 40px;
  color: #bbbcbe;
  font-size: 14px;
}
.breadCrumb {
  width: 100%;
  height: 14px;
  margin-bottom: 20px;
}
</style>
