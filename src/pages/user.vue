<template>
  <el-container direction="vertical" style="padding: 20px 50px">
    <!-- 引入elementui -->
    <my-breadcrumb v-bind:index=1></my-breadcrumb>

    <el-row>
      <el-col :span="12">
        <el-button type="primary" v-on:click="addUserDialogVisible = true" icon="el-icon-plus">增加用户</el-button>
      </el-col>

      <el-col :span="12" style="text-align: right">
        <el-form :inline="true" @submit.native.prevent>
          <el-form-item>
            <el-input v-model="nameKeyword" placeholder="用户名" style="width: 120px" clearable @keyup.enter.native="getUserList" @change="getUserList">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>
          <!-- <el-select v-model="authFilter" placeholder="请选择">
            <el-option
              v-for="item in userAuthOptions.concat([{value: 0, label: 'All'}])"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> -->
          <!-- <el-form-item>
            <el-button type="primary" v-on:click="getUserList" icon="el-icon-search">
              <span class="hidden-md-and-down">
                搜索用户
              </span>
            </el-button>
          </el-form-item> -->
        </el-form>
      </el-col>

   </el-row>

    <el-table stripe :data="filteredUserList.slice((currentPage-1)*pageSize,currentPage*pageSize)" @filter-change="authFilterChange">
      <el-table-column prop="id" label="ID">
      </el-table-column>
      <el-table-column prop="userName" label="用户名">
      </el-table-column>
      <el-table-column prop="auth" label="权限" :formatter="authFormatter" :filters="[{text: 'User', value: 1}, {text: 'Admin', value: 2}, {text: 'Superadmin', value: 3}]" :filter-multiple="false" filter-placement="bottom-start" :filter-method="authFilterHandler" column-key="auth">
        <template slot-scope="scope">
          <el-tag :type="scope.row.auth === 1 ? 'primary' : (scope.row.auth === 2 ? 'success' : 'warning')" close-transition>{{showAuth(scope.row.auth)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="350px">
        <template slot-scope="scope">
          <el-button-group>
            <el-button v-bind:disabled="isOperationDisabled('modifyUserPwd',scope.row.auth)" v-on:click="showModifyPwdDialog(scope.row.id, scope.row.userName)" type="primary" size="medium" icon="el-icon-edit">重置密码</el-button>
            <el-button v-bind:disabled="isOperationDisabled('modifyUserAuth',scope.row.auth)" @click="showModifyAuthDialog(scope.row.id, scope.row.userName, scope.row.auth)" type="primary" size="medium" icon="el-icon-edit-outline">修改权限</el-button>
            <el-button v-bind:disabled="isOperationDisabled('removeUser',scope.row.auth)" @click="showRemoveUserDialog(scope.row.id, scope.row.userName)" type="primary" size="medium" icon="el-icon-delete"></el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination background
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="[5, 10]"
    :page-size="pageSize"
    layout="total, prev, pager, next, sizes"
    :total="filteredUserList.length"
    class="row-col-center"
    style="margin: 20px">
    </el-pagination>

    <el-dialog
      title="修改权限"
      :visible.sync="modifyAuthDialogVisible"
      width="30%">
      <span>修改用户名为{{operatingUser.userName}}的用户权限由{{showAuth(operatingUser.auth)}}为</span>
      <el-select v-model="operatingUser.newAuth">
        <el-option
          v-for="item in userAuthOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modifyUserAuth">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="删除用户"
      :visible.sync="removeUserDialogVisible"
      width="30%">
      <span>确认删除名为{{operatingUser.userName}}的用户吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="removeUser">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="重置密码"
      :visible.sync="modifyPwdDialogVisible"
      :before-close="handleClose2"
      width="30%">
      <el-form :model="operatingUser" label-width="80px" size="small" :rules="modifyUserPwdRule" ref="modifyUserPwdForm" label-position="left">
        <span>重置用户名为{{operatingUser.userName}}的用户密码为</span>
        <el-form-item label="新密码" prop="newPwd">
          <el-input v-model="operatingUser.newPwd" clearable @keyup.native="operatingUser.newPwd=operatingUser.newPwd.replace(/[^\w\.\/]/ig,'')"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="modifyUserPwd">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="增加用户"
      :visible.sync="addUserDialogVisible"
      :before-close="handleClose"
      width="30%">
        <el-form :model="operatingUser" label-width="80px" size="small" :rules="addUserRule" ref="addUserForm" label-position="left">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="operatingUser.userName" clearable></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pwd">
            <el-input type="password" v-model="operatingUser.pwd" clearable></el-input>
          </el-form-item>
          <el-form-item label="权限" prop="auth">
            <el-select v-model="operatingUser.auth">
              <el-option
                v-for="item in userAuthOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
     <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addUser">确定</el-button>
      </span>
    </el-dialog>
  </el-container>

</template>

<script>
import myBreadcrumb from '../components/breadcrumb'
export default {
  components: {
    myBreadcrumb
  },
  data () {
    return {
      // name: '', // this.$route.params.name,
      auth: 0,
      authFilter: 0,
      nameKeyword: '',
      userList: [],
      userAuthOptions: [], // addUser, modifyAuth
      operatingUser: {
        id: 0,
        userName: '',
        pwd: '',
        auth: 1,
        newPwd: '',
        newAuth: 1
      },
      addUserDialogVisible: false,
      modifyPwdDialogVisible: false,
      modifyAuthDialogVisible: false,
      removeUserDialogVisible: false,
      currentPage: 1,
      pageSize: 5,
      addUserRule: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 6, max: 24, message: '长度在 6 到 24 个字符', trigger: 'change, blur' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        auth: [
          { required: true, message: '请输入权限', trigger: 'change' }
        ]
      },
      modifyUserPwdRule: {
        newPwd: [
          { required: true, message: '请输入密码', trigger: 'change' }
        ]
      }
    }
  },
  created () { // no need to validate user auth, since myApp.vue already did that for us
    this.getAuth()
    this.getUserList()
    this.userAuthOptions = this.getUserAuthOptions()
  },
  computed: {
    filteredUserList: function () {
      // console.log('use.vue-filteredUsers:' + typeof this.authFilter)
      // console.log('this.authFilter' + this.authFilter)
      if (this.authFilter === 0) {
        return this.userList
      }
      return this.userList.filter(function (user) {
        // console.log(typeof user.auth)
        // console.log('user.auth' + user.auth)
        // return user.auth.indexOf(this.authFilter) !== -1
        return user.auth === this.authFilter
      }.bind(this))
    }
  },
  methods: {
    getAuth () {
      this.auth = parseInt(this.$cookie.get('auth'))
    },
    getUserList () {
      // console.log('nameKeyword = \'' + this.nameKeyword + '\'')
      // this.userList = [
      //   {id: 1, userName: 'test', auth: 1},
      //   {id: 2, userName: '2', auth: 2},
      //   {id: 3, userName: '2', auth: 2},
      //   {id: 4, userName: '2', auth: 2},
      //   {id: 5, userName: '2', auth: 2},
      //   {id: 6, userName: '2', auth: 2},
      //   {id: 7, userName: '2', auth: 2},
      //   {id: 8, userName: '2', auth: 2},
      //   {id: 9, userName: '2', auth: 2},
      //   {id: 10, userName: '2', auth: 2},
      //   {id: 11, userName: '3', auth: 3}
      // ]
      this.$api.post( // '/user/filter', userName: nameKeyword
        '/user/filter',
        {userName: this.nameKeyword},
        response => { // status, userList[id, userName, auth]
          if (response.status === 'success') {
            this.userList = response.userList
          } else {
            this.$notify.error({
              title: '错误',
              message: '用户列表获取失败，请等待后重试'
            })
            // window.location.reload() // 刷新本页面，https://www.zhihu.com/question/49863095
          }
        }
      )
    },
    isOperationDisabled (operationName, operationUserAuth) {
      // 当disabled = false, 也就是button可点击
      // console.log('auth=' + this.auth + ' ua=' + userAuth + 'operationName=' + operationName)
      if (this.auth === 2) { // normal admin
        if (operationUserAuth !== 1) return true
        else if (operationName === 'modifyUserAuth') return true
      } else { // super admin
        return false
      }
    },
    getUserAuthOptions () {
      // console.log('getUserAuthOptions')
      if (this.auth === 3) { // super admin
        return [
          {value: 1, label: 'User'},
          {value: 2, label: 'Admin'},
          {value: 3, label: 'Superadmin'}
        ]
      } else { // normal admin
        return [{value: 1, label: 'User'}]
      }
    },
    resetOperationUser () {
      // console.log('resetOperationUser')
      this.operatingUser.id = 0
      this.operatingUser.userName = ''
      this.operatingUser.auth = 1
      this.operatingUser.pwd = ''
      this.operatingUser.newAuth = 1
      this.operatingUser.newPwd = ''
    },
    addUser () {
      // console.log('addUser')
      this.$refs['addUserForm'].validate((valid) => {
        if (valid) {
          var pwd = this.getMD5(this.operatingUser.pwd)
          this.$api.post(
            '/user/add',
            // userName, pwd, auth
            {
              userName: this.operatingUser.userName,
              pwd: pwd,
              auth: this.operatingUser.auth
            },
            response => { // status, id, userName, auth, pictureUrl
              if (response.status === 'success') {
                this.userList.push({
                  id: response.id,
                  userName: response.userName,
                  auth: response.auth
                })
                this.$notify.success({
                  title: '成功',
                  message: '新用户ID为' + response.id
                })
                this.$refs['addUserForm'].resetFields()
                this.resetOperationUser()
                this.addUserDialogVisible = false
              } else if (response.status === 'authFail') {
                this.$notify.error({
                  title: '错误',
                  message: '权限不够'
                })
              } else if (response.status === 'duplicateUsernameFail') {
                this.$notify.error({
                  title: '错误',
                  message: '用户名已存在'
                })
              } else if (response.status === 'invalidInputFail') {
                this.$notify.error({
                  title: '错误',
                  message: '禁止输入非法字符'
                })
              } else {
                this.$notify.error({
                  title: '错误',
                  message: '新增用户失败，请等待后重试'
                })
              }
            }
          )
        }
      })
    },
    removeUser () {
      this.$api.post(
        '/user/delete',
        { // id
          id: this.operatingUser.id
        },
        response => { // status
          if (response.status === 'success') {
            this.getUserList()
            this.$notify.success({
              title: '成功',
              message: '原用户ID为' + this.operatingUser.id + '已被删除'
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: '删除用户失败，请等待后重试'
            })
          }
        }
      )
      this.resetOperationUser()
      this.removeUserDialogVisible = false
    },
    getMD5 (key) {
      var md5 = this.$crypto.createHash('md5')
      md5.update(key)
      var a = md5.digest('hex')
      // console.log('md5 ' + a)
      // 'foo' = 47bce5c74f589f4867dbd57e9ca9f808
      return a
    },
    modifyUserPwd () {
      this.$refs['modifyUserPwdForm'].validate((valid) => {
        if (valid) {
          var pwd = this.getMD5(this.operatingUser.newPwd)

          this.$api.post(
            '/user/pwd',
            { // id, pwd
              id: this.operatingUser.id,
              pwd: pwd
            },
            response => { // status
              if (response.status === 'success') {
                this.$notify.success({
                  title: '成功',
                  message: '已重置用户' + this.operatingUser.id + '的密码'
                })
                this.resetOperationUser()
                this.modifyPwdDialogVisible = false
              } else {
                this.$notify.error({
                  title: '错误',
                  message: '重置用户密码失败，请等待后重试'
                })
              }
            }
          )
        }
      })
    },
    showModifyAuthDialog (id, userName, auth) {
      this.modifyAuthDialogVisible = true
      this.operatingUser.id = id
      this.operatingUser.userName = userName
      this.operatingUser.auth = auth
    },
    showModifyPwdDialog (id, userName) {
      this.modifyPwdDialogVisible = true
      this.operatingUser.id = id
      this.operatingUser.userName = userName
    },
    modifyUserAuth () {
      this.$api.post(
        '/user/auth',
        { // id, auth
          id: this.operatingUser.id,
          auth: this.operatingUser.newAuth
        },
        response => { // status
          if (response.status === 'success') {
            this.getUserList()
            this.$notify.success({
              title: '成功',
              message: '已修改用户' + this.operatingUser.id + '的权限'
            })
            this.resetOperationUser()
            this.modifyAuthDialogVisible = false
          } else if (response.status === 'authFail') {
            this.$notify.error({
              title: '错误',
              message: '超级管理员不能修改自己的权限'
            })
          } else {
            this.$notify.error({
              title: '错误',
              message: '修改权限密码失败，请等待后重试'
            })
          }
        }
      )
    },
    showAuth (auth) {
      if (auth === 1) return 'User'
      else if (auth === 2) return 'Admin'
      else return 'Superadmin'
    },
    handleSizeChange: function (size) {
      this.pageSize = size
      // console.log('每页' + size + '条')
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      // console.log('当前为' + currentPage)
    },
    authFormatter (row) {
      return this.showAuth(row.auth)
    },
    authFilterHandler (value, row, column) {
      const property = column['property'] // property就是prop属性
      return row[property] === value
    },
    showRemoveUserDialog (id, userName) {
      this.removeUserDialogVisible = true
      this.operatingUser.id = id
      this.operatingUser.userName = userName
    },
    authFilterChange (columnKey) {
      if (columnKey.auth.length === 0) this.authFilter = 0
      else this.authFilter = columnKey.auth[0]
      // console.log(this.authFilter)
    },
    handleClose (done) {
      this.$refs['addUserForm'].resetFields()
      done()
    },
    handleClose2 (done) {
      this.$refs['modifyUserPwdForm'].resetFields()
      done()
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

</style>
