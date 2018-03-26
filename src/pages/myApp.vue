<template>
  <div>
    <my-header v-bind:name="name" v-bind:auth="auth"></my-header>
    <router-view/>
  </div>
</template>

<script>
import myHeader from '../components/header.vue'
export default {
  components: {
    myHeader
  },
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
        // console.log('myApp.vue - userValidate fail')
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
