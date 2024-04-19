<template>
  <div id="app">
    <router-view v-if="routerViewShow" />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      routerViewShow: true
    }
  },
  created() {
    // 在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem('vuex')) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('vuex'))))
    }
    localStorage.setItem('lastClickTime', new Date().getTime().toString())
    // 在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('vuex', JSON.stringify(this.$store.state))
    })
  },
  mounted() {},
  watch: {
    $route(to, from) {
      this.routerViewShow = false
      this.routerViewShow = true
    }
  }
}
</script>

<style>
#app {
  width: 100%;
  height: auto;
  overflow: hidden;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  transform-origin: top;
  -webkit-text-size-adjust: none !important;
}
</style>
