<template>
  <div>
    <!-- start: Content -->
    <input type="text" v-model="name" placeholder="username">
    <input type="password" v-model="pwd" placeholder="password">
    <button v-on:click="submit">提交</button>
    <p>{{msg}}</p>
    <!-- end:Content -->
  </div>
</template>

<script>
import axios from 'axios'
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
      axios
        // .post('/api/login', {name: this.name, pwd: this.pwd})
        .get('/api/login')
        .then(response => {
          if (response.data.success === true) {
            this.setCookie('name', response.data.name)
            this.setCookie('auth', response.data.auth)
            this.$router.push({
              name: 'User'
            })
          } else { // json-server返回的data中没有success参数，或者success参数不为true
            this.msg = '用户名或密码错误'
          }
        })
        .catch(error => {
          console.log(error.response.status) // 504（json-server关闭时）
        })
    }
  }
}
</script>

<style>

</style>
