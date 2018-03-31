<template>
  <el-row :gutter="5">
    <el-col :span="6" class="row-col-center">
      <img src="static/img/pet-hospital-logo.png" alt="pet-hospital-logo">
      <span class="hidden-md-and-down">宠物医院学习系统<br>后台管理</span>
    </el-col>

    <el-col :span="15">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" style="border-bottom: none">
        <el-menu-item index="">
          <i class="fa fa-home fa-lg"/>
          <span class="hidden-md-and-down">&nbsp;首页</span>
        </el-menu-item>
        <el-menu-item index="user">
          <i class="fa fa-users fa-lg"/>
          <span class="hidden-md-and-down">&nbsp;用户管理</span>
        </el-menu-item>
        <el-menu-item index="question">
          <i class="fa fa-book fa-lg"/>&nbsp;
          <span class="hidden-md-and-down">试题管理</span>
        </el-menu-item>
        <el-menu-item index="procedure">
          <i class="fa fa-list-ol fa-lg"/>
          <span class="hidden-md-and-down">&nbsp;流程管理</span>
        </el-menu-item>
        <el-menu-item index="department">
          <i class="fa fa-hospital-o fa-lg"/>
          <span class="hidden-md-and-down">&nbsp;科室管理</span>
        </el-menu-item>
        <el-menu-item index="case">
          <i class="fa fa-video-camera fa-lg"/>
          <span class="hidden-md-and-down">&nbsp;病例管理</span>
        </el-menu-item>
      </el-menu>
      <!-- <div class="line"></div> -->
    </el-col>

    <el-col :span="3">
      <el-dropdown>
        <span>
          <img src="static/img/userpic.jpg" alt="userpic" height="60px" style="border-radius: 30px;">
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item disabled>{{name}}</el-dropdown-item>
          <el-dropdown-item>
            <i class="fa fa-cog fa-lg"/>
            账户设置
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
  props: {
    name: String
  },
  data () {
    return {
      activeIndex: ''
    }
  },
  created () {
    this.activeIndex = this.$router.currentRoute.fullPath.split('/').pop()
  },
  methods: {
    handleSelect (key, keyPath) {
      // console.log(typeof key, keyPath)
      this.$router.push({
        path: '/' + key
      })
    },
    logout () {
      console.log('logout')
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
    }
  }
}
</script>

<style scoped>
/* .el-header {
  line-height: 60px;
  color: #606266;
}
.bg-purple {
  background: #d3dce6;
} */
.row-col-center {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 60px;
}
</style>
