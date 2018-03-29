<template>
  <el-container>
    <!-- <my-header>
    </my-header> -->
    <el-header>
      <big>欢迎来到 宠物医院学习系统</big>
      <small>后台管理</small>
    </el-header>

    <el-main>
      <el-row :gutter="20">
      <!-- <el-row :gutter="20" class="bg-purple-dark">       -->
        <el-col :span="8"><div class="grid-content"></div></el-col>
        <!-- <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>      -->
        <el-col :span="8">
          <el-form :model="loginForm" label-width="80px" size="small" :rules="loginRule" ref="loginForm" label-position="top">
            <el-form-item label="用户名" prop="name">
              <el-input v-model="loginForm.name" clearable></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pwd">
              <el-input v-model="loginForm.pwd" clearable></el-input>
            </el-form-item>
            <el-form-item size="medium" class="row-col-center">
              <el-button type="primary" @click="submit">登录</el-button>
              <el-button v-on:click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <!-- <el-col :span="6"><div class="grid-content"></div></el-col> -->
      </el-row>
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
      loginForm: {
        name: '',
        pwd: ''
      },
      loginRule: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    setCookie (key, value) {
      var hours = 0.1
      var seconds = hours * 60 * 60
      document.cookie = key + '=' + escape(value) + ';max-age=' + seconds
    },
    submit () {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          this.$api.post(
            '/user/login',
            { // userName, pwd
              userName: this.loginForm.name,
              pwd: this.loginForm.pwd
            },
            response => { // status, id, userName, auth, pictureUrl
              if (response.status === 'success' && response.auth !== 1) {
                this.setCookie('name', response.userName)
                this.setCookie('auth', response.auth)
                this.setCookie('picUrl', response.pictureUrl)
                this.$router.push({
                  path: '/'
                })
              } else if (response.auth === 1) {
                this.$notify.error({
                  title: '错误',
                  message: '用户权限不够'
                })
              } else {
                this.$notify.error({
                  title: '错误',
                  message: '用户名或密码错误'
                })
              }
            }
          )
        }
      })
    },
    reset () {
      this.$refs['loginForm'].resetFields()
    }
  }
}
</script>

<style scoped>
.el-header {
  text-align: center;
  line-height: 60px;
  color: #606266;
}
.bg-purple {
  background: #d3dce6;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.row-col-center {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
