<template>
  <div>
    <!-- start: Content -->
    <input type="text" v-model="name" placeholder="username">
    <input type="password" v-model="pwd" placeholder="password" v-on:keyup.enter="submit">
    <button v-on:click="submit">登录</button>
    <p>{{msg}}</p>
    <!-- end:Content -->
  </div>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      pwd: '',
      msg: 'Welcome to pet hospital'
    }
  },
  methods: {
    setCookie (key, value) {
      var hours = 0.1
      var seconds = hours * 60 * 60
      document.cookie = key + '=' + escape(value) + ';max-age=' + seconds
    },
    submit () {
      // 检验输入信息
      if (this.name === '' || this.pwd === '') {
        this.msg = '请输入用户名和密码后再登录'
        return
      }

      this.$api.post(
        '/user/login',
        { // userName, pwd
          userName: this.name,
          pwd: this.pwd
        },
        response => { // status, id, userName, auth, pictureUrl
          if (response.status === 'success') {
            this.setCookie('name', response.userName)
            this.setCookie('auth', response.auth)
            this.setCookie('picUrl', response.pictureUrl)
            this.$router.push({
              name: 'User'
            })
          } else {
            this.msg = '用户名或密码错误'
          }
        }
      )
    }
  }
}
</script>

<style>

</style>
