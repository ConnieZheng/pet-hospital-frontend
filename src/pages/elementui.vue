<template>
  <el-container>
    <el-header>Header</el-header>
    <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
// import ElementUI from '@/pages/elementui.1'
export default {
  // components: {
  //   ElementUI
  // },
  data () {
    return {
      name: 'xxx',
      auth: 0
    }
  },
  created () {
    this.name = this.getCookie('name')
    this.auth = this.getCookie('auth')
    this.userValidate()
  },
  methods: {
    userValidate () {
      if (this.auth !== '2' && this.auth !== '3') {
        console.log('myApp.vue - userValidate fail')
        this.$router.push({
          // name: 'Login'
          path: '/login'
        })
      }
    },
    getCookie (key) {
      var arr
      var reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)')

      if ((arr = document.cookie.match(reg))) return unescape(arr[2])
      else return null
    }
  }
}
</script>

<style>
.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
