<template>
  <el-row :gutter="5">
    <el-col :span="6" class="row-col-center">
      <img src="static/img/pet-hospital-logo.png" alt="pet-hospital-logo">
      <span class="hidden-md-and-down">宠物医院学习系统<br>后台管理</span>
    </el-col>

    <el-col :span="15">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" style="border-bottom: none" active-text-color="#409EFF" :router="true">
        <el-menu-item index="/">
          <i class="fa fa-home fa-lg"/>
          <span class="hidden-md-and-down">&nbsp;首页</span>
        </el-menu-item>
        <el-menu-item index="/user">
          <i class="fa fa-users fa-lg"/>
          <span class="hidden-md-and-down">&nbsp;用户管理</span>
        </el-menu-item>
        <el-menu-item index="/question">
          <i class="fa fa-book fa-lg"/>
          <span class="hidden-md-and-down">&nbsp;试题管理</span>
        </el-menu-item>
        <el-menu-item index="/procedure">
          <i class="fa fa-list-ol fa-lg"/>
          <span class="hidden-md-and-down">&nbsp;流程管理</span>
        </el-menu-item>
        <el-menu-item index="/department">
          <i class="fa fa-hospital-o fa-lg"/>
          <span class="hidden-md-and-down">&nbsp;科室管理</span>
        </el-menu-item>
        <el-submenu index="/case"><!-- 这里的index没有用，只是不放index的话，控制台会报错 -->
          <template slot="title">
            <i class="fa fa-video-camera fa-lg"/>
            <span class="hidden-md-and-down">&nbsp;病例管理</span>
          </template>
          <el-menu-item index="/disease">病种管理</el-menu-item>
          <el-menu-item index="/case">病例管理</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-col>

    <el-col :span="3">
      <el-dropdown>
        <span>
          <!-- {{picUrl}} -->
          <img :src="picUrl" alt="userpic" height="60px" style="border-radius: 30px;">
          <!-- {{name}} -->
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item disabled>{{name}}</el-dropdown-item>
          <el-dropdown-item>
            <span @click="profile">
              <i class="fa fa-cog fa-lg"/>
              账户设置
            </span>
          </el-dropdown-item>
          <el-dropdown-item>
            <span @click="logout">
              <i class="fa fa-power-off fa-lg" style="color: grey"/>
              退出登录
            </span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: '/',
      pirUrl: '',
      name: '',
      loading: false
    }
  },
  created () {
    this.name = this.$cookie.get('name')
    this.picUrl = this.$cookie.get('picUrl')
    // this.$root.Bus.$on('updatedPic', value => {
    //   var temp = 'https://www.ecnupet.cn/pet/' + value
    //   console.log(temp)
    //   this.setPicUrl(temp)
    // })
    this.$root.Bus.$on('updatedName', value => {
      this.name = value
    })
    this.$root.Bus.$on('updateIndex', value => {
      this.activeIndex = value
    })
  },
  methods: {
    logout () {
      this.$api.post(
        '/user/logout',
        null,
        response => { // status
          if (response.status === 'success') {
            this.$cookie.delete('name')
            this.$cookie.delete('auth')
            this.$cookie.delete('picUrl')
            this.$router.push({
              path: '/login'
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: '登出失败'
            })
          }
        }
      )
    },
    profile () {
      this.$router.push({path: '/profile'})
    } // ,
    // setPicUrl (value) {
    //   this.pirUrl = value
    //   console.log(this.pirUrl)
    // }
  }
}
</script>

<style scoped>
.row-col-center {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 60px;
}
</style>
