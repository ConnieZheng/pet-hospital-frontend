<template>
  <el-container>
    <!-- <my-header>
    </my-header> -->
    <el-header style="height: auto">
      <h1>欢迎来到宠物医院学习系统</h1>
      <h4>后台管理</h4>
    </el-header>

    <el-main>
      <el-row>
        <el-col :span="16" class="hidden-xs-only">
          <img style="padding-left: 12.5%" width="75%" src="static/img/login.jpg">
        </el-col>
        <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
          <el-form :model="loginForm" label-width="80px" size="small" :rules="loginRule" ref="loginForm" label-position="top" style="padding-top: 10%">
            <el-form-item label="用户名" prop="name">
              <el-input v-model="loginForm.name" clearable></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pwd">
              <!-- <input type="password" v-model="loginForm.pwd"> -->
              <el-input type="password" v-model="loginForm.pwd" clearable v-on:keyup.enter.native="submit"></el-input>
            </el-form-item>
            <el-form-item size="medium" class="row-col-center">
              <!-- <button v-on:click="submit">登录</button> -->
              <el-button type="primary" @click="submit">登录</el-button>
              <el-button v-on:click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
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
    getMD5 (key) {
      var md5 = this.$crypto.createHash('md5')
      md5.update(key)
      var a = md5.digest('hex')
      return a
    },
    submit () {
      // this.$cookie.set('name', this.loginForm.name, 0.25)
      // this.$cookie.set('auth', 3, 0.25)
      // this.$cookie.set('picUrl', 'testUrl', 0.25)
      // this.$router.push({
      //   path: '/'
      // })

      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          var pwd = this.getMD5(this.loginForm.pwd)

          this.$api.post(
            '/user/login',
            { // userName, pwd
              userName: this.loginForm.name,
              pwd: pwd
            },
            response => { // status, id, userName, auth, pictureUrl
              if (response.status === 'success' && response.auth !== 1) {
                this.$cookie.set('name', this.loginForm.name, 0.25)
                this.$cookie.set('auth', response.auth, 0.25)
                this.$cookie.set('picUrl', response.pictureUrl, 0.25)
                this.$router.push({
                  path: '/'
                })
              } else if (response.auth === 1) {
                this.$notify.error({
                  title: '错误',
                  message: '用户权限不够'
                })
              } else if (response.status === 'inputFail') {
                this.$notify.error({
                  title: '错误',
                  message: '密码错误'
                })
              } else if (response.status === 'noUserFail') {
                this.$notify.error({
                  title: '错误',
                  message: '用户名不存在'
                })
              } else {
                this.$notify.error({
                  title: '错误',
                  message: '未知错误'
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

<style>
/* 全局设置：禁用IE10和edge设置“密码显示”的功能 */
input[type=password]::-ms-reveal { display: none; }
</style>

<style scoped>
.el-header {
  text-align: center;
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
