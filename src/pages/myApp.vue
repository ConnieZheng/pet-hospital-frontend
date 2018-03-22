<template>
  <div>
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
    this.auth = parseInt(this.getCookie('auth'))
  },
  methods: {
    getCookie (key) {
      var arr
      var reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)')

      if ((arr = document.cookie.match(reg))) return unescape(arr[2])
      else return null
    }
  }
}
</script>
