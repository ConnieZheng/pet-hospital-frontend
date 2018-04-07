<template>
  <!-- <p>profile: 显示用户权限+修改昵称、头像和密码（输入双次）</p> -->
  <el-container direction="vertical">
    <div class="row-col-center">
      <h1>账号设置</h1>
    </div>

    <div class="row-col-center">
        <el-card>
          <div class="row-col-center" style="margin-bottom: 30px">
            <img v-bind:src="pictureUrl" alt="userpic" height="175px" width="175px" style="border-radius: 60%;" @click="modifyPicUrlDialogVisible = true">
          </div>

          <div class="row-col-center">
            <el-button type="text" @click="modifyPwdDialogVisible = true" icon="el-icon-edit">修改密码</el-button>
          </div>

          <div style="display: flex;">
            <span style="min-width: 60px; line-height: 40px">账号:</span>
            <el-input v-model="opeatingUser.newUsername"/>
            <el-button type="primary" @click="invokeApiUpdate(1, {userName: opeatingUser.newUsername}, '昵称')" style="margin-left: 10px">修改昵称</el-button>
          </div>
        </el-card>
    </div>

    <el-dialog
      title="修改密码"
      :visible.sync="modifyPwdDialogVisible"
      :before-close="handleClose"
      width="30%">
      <el-form :model="opeatingUser" status-icon :rules="rule" ref="pwdForm" label-width="100px">
        <el-form-item label="新密码" prop="pwd">
          <el-input type="password" v-model="opeatingUser.pwd" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="newPwd">
          <el-input type="password" v-model="opeatingUser.newPwd" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="modifyPwd">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改头像" :visible.sync="modifyPicUrlDialogVisible" width="238px"
    :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false" class="row-col-center">
      <!-- <form>
        <input type="file" @change="getFile($event)">
        <button @click="submitForm($event)">提交</button>
      </form> -->
      <el-upload
        class="avatar-uploader"
        :action="this.$fileApi.getUploadUrl()"
        :show-file-list="false"
        accept="image/*"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.opeatingUser.newPwd !== '') {
          this.$refs.pwdForm.validateField('newPwd')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.opeatingUser.pwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      userName: '',
      pictureUrl: '', // 用户的当前头像
      modifyNameDialogVisible: false,
      modifyPwdDialogVisible: false,
      modifyPicUrlDialogVisible: false,
      opeatingUser: {
        pwd: '',
        newPwd: '',
        newUsername: ''
      },
      rule: {
        pwd: [
          { validator: validatePass, trigger: 'blur' }
        ],
        newPwd: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        newUsername: [
          { required: true, message: '请输入用户名（支持中文）', trigger: 'change, blur' },
          { min: 6, max: 24, message: '长度在 6 到 24 个字符', trigger: 'change, blur' }
        ]
      },
      file: '',
      image: '',
      test2: false
    }
  },
  created () {
    this.auth = parseInt(this.$cookie.get('auth'))
    this.userName = this.$cookie.get('name')
    this.opeatingUser.newUsername = this.userName
    this.pictureUrl = this.$cookie.get('picUrl')
  },
  computed: {
    imageUrl () { // 头像完整URL
      if (this.image) return this.$fileApi.getWebBaseUrl() + this.image
      else return ''
    }
  },
  methods: {
    getMD5 (key) {
      var md5 = this.$crypto.createHash('md5')
      md5.update(key)
      var a = md5.digest('hex')
      return a
    },
    modifyPwd () {
      this.$refs['pwdForm'].validate((valid) => {
        if (valid) {
          this.invokeApiUpdate(2, {pwd: this.getMD5(this.opeatingUser.pwd)}, '密码，请使用新的密码登录')
        }
      })
    },
    invokeApiUpdate (methodNo, param, toast) {
      if (methodNo === 1 && (param.userName.length < 6 || param.userName.length > 24)) {
        this.$message.error('昵称的合法长度为6-24个字符（支持中文）')
        return
      }
      this.$api.post(
        '/user/update',
        param,
        response => { // status
          if (response.status === 'success') {
            this.$notify.success({
              title: '成功',
              message: '已成功修改用户的' + toast
            })
            if (methodNo === 1) {
              this.userName = this.opeatingUser.newUsername
              this.$cookie.set('name', this.userName, 0.25)
              this.$root.Bus.$emit('updatedName', this.userName)

              this.modifyNameDialogVisible = false
              this.$refs['nameForm'].resetFields()
            } else if (methodNo === 2) {
              this.modifyPwdDialogVisible = false
              this.$refs['pwdForm'].resetFields()
              this.$router.push({
                path: '/login'
              })
            } else {
              this.pictureUrl = this.imageUrl
              this.$cookie.set('picUrl', this.pictureUrl, 0.25)

              this.image = ''
              this.modifyPicUrlDialogVisible = false

              // this.$root.Bus.$emit('updatedPic', this.image)
              location.reload()
            }
          } else if (response.status === 'inputFail') {
            this.$notify.error({
              title: '错误',
              message: '新的' + toast + '不能为空'
            })
          } else if (response.status === 'invalidInputFail') {
            this.$notify.error({
              title: '错误',
              message: '禁止输入非法字符'
            })
          } else if (response.status === 'duplicateUsernameFail') {
            this.$notify.error({
              title: '错误',
              message: '新的昵称已存在，请使用另一昵称'
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: '修改失败，服务器出现问题，请稍后重试'
            })
          }
        }
      )
    },
    handleClose (done) {
      this.$refs['pwdForm'].resetFields() // 包括reset this.operationUser.pwd
      done()
    },
    handleClose2 (done) {
      this.$refs['nameForm'].resetFields()
      done()
    },
    handleAvatarSuccess (res, file) {
      this.image = res.webURL
      this.$message.success('新头像已成功上传至服务器~')
      // console.log(res.webURL)
      this.invokeApiUpdate(3, {pictureUrl: this.imageUrl}, '头像') // 头像已上传至服务器，本函数用于将头像的webURL写入数据库
    },
    beforeAvatarUpload (file) {
      const isLt4M = file.size / 1024 / 1024 < 4
      const isJPG = (file.type === 'image/jpeg') || (file.type === 'image/png') || (file.type === 'image/jpg') || (file.type === 'image/bmp') || (file.type === 'image/gif')
      if (!isJPG) {
        this.$message.error('请上传图片！')
      }
      if (!isLt4M) {
        this.$message.error('上传头像图片大小不能超过 4MB!')
      }
      return isJPG && isLt4M
    }
  }
}
</script>

<style scoped>
.row-col-center {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
