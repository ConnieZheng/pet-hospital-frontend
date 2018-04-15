<template>
  <el-container>
    <el-header style="height: auto">
      <!-- <my-header v-bind:name="name"/> -->
      <my-header/>
    </el-header>
    <el-main>
      <router-view/>
    </el-main>
  </el-container>
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
    this.name = this.$cookie.get('name')
    this.auth = this.$cookie.get('auth')
    this.userValidate()
  },
  methods: {
    userValidate () {
      if (this.auth !== '2' && this.auth !== '3') {
        this.$router.push({
          path: '/login'
        })
      }
    }
  }
}
</script>
