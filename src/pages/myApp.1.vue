<template>
  <div>
    <!-- 逻辑完善，未测试过api，未引入elementui -->
    <my-header v-bind:name="name" v-bind:auth="auth"></my-header>
    <my-sidebar></my-sidebar>
    <router-view/>
  </div>
</template>

<script>
import myHeader from '../components/header.vue'
import mySidebar from '../components/sidebar.vue'
export default {
  components: {
    myHeader,
    mySidebar
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
