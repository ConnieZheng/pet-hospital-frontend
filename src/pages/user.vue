<template>
  <div style="padding: 50px">
    <!-- 引入elementui -->
    <!-- <br> -->
    <el-row style="margin-top: 20px">
      <el-col :span="24">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>

    <el-row :gutter="20"  style="margin-top: 20px">
      <el-col :span="5">
        <el-button type="primary" v-on:click="addUserDialogVisible = !addUserDialogVisible" icon="el-icon-plus">增加用户</el-button>
      </el-col>

      <el-col :span="9">
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="nameKeyword" placeholder="用户名" clearable></el-input>
          </el-form-item>
          <!-- <el-select v-model="authFilter" placeholder="请选择">
            <el-option
              v-for="item in userAuthOptions.concat([{value: 0, label: 'All'}])"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> -->
          <!-- <el-form-item> -->
            <el-button type="primary" v-on:click="getUserList" icon="el-icon-search">搜索用户</el-button>
          <!-- </el-form-item> -->
        </el-form>
      </el-col>
      <el-col :span="10">
        <el-pagination background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10]"
        :page-size="pageSize"
        :total="filteredUserList.length">
        </el-pagination>
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
      <el-table-column label="操作" fixed="right" width="350">
        <template slot-scope="scope">
          <el-button-group>
          <el-button v-bind:disabled="isOperationDisabled('modifyUserPwd',scope.row.auth)" v-on:click="showModifyPwdDialog(scope.row.id, scope.row.userName)" type="primary" size="small" icon="el-icon-edit">重置密码</el-button>
          <el-button v-bind:disabled="isOperationDisabled('modifyUserAuth',scope.row.auth)" @click="showModifyAuthDialog(scope.row.id, scope.row.userName, scope.row.auth)" type="primary" size="small" icon="el-icon-edit-outline
">修改权限</el-button>
          <el-button v-bind:disabled="isOperationDisabled('removeUser',scope.row.auth)" @click="showRemoveUserDialog(scope.row.id, scope.row.userName)" type="primary" size="small" icon="el-icon-delete">删除用户</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- TODO -->
    <el-dialog
      title="重置密码"
      :visible.sync="modifyPwdDialogVisible"
      width="30%">
      <span>重置用户名为{{operatingUser.userName}}的用户密码为</span>
      <el-input v-model="operatingUser.newPwd" placeholder="新密码"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyPwdDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="modifyUserPwd">确定</el-button>
      </span>
    </el-dialog>

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
        <el-button @click="modifyAuthDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="modifyUserAuth">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="删除用户"
      :visible.sync="removeUserDialogVisible"
      width="30%">
      <span slot="footer" class="dialog-footer">
        <el-button @click="removeUserDialogVisible = false">取消</el-button>
        <el-button type="danger" @click="removeUser">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="重置密码"
      :visible.sync="modifyPwdDialogVisible"
      width="30%">
      <span>重置用户名为{{operatingUser.userName}}的用户密码为</span>
      <el-input v-model="operatingUser.newPwd" placeholder="新密码"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyPwdDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="modifyUserPwd">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="增加用户"
      :visible.sync="addUserDialogVisible"
      width="30%">
        <el-form :model="operatingUser" label-width="80px" size="small" :rules="addUserRule" ref="addUserForm" label-position="left">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="operatingUser.userName" clearable></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="pwd">
            <el-input v-model="operatingUser.pwd" clearable></el-input>
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
        <el-button @click="addUserDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addUser">确定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
export default {
  data () {
    return {
      // name: '', // this.$route.params.name,
      auth: 0,
      authFilter: 0,
      nameKeyword: '',
      userList: [],
      userAuthOptions: [], // addUser, modifyAuth
      operatingUser: {
        id: '',
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
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        auth: [
          { required: true, message: '请输入权限', trigger: 'change' }
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
      var arr
      var reg = new RegExp('(^| )' + 'auth' + '=([^;]*)(;|$)')

      if ((arr = document.cookie.match(reg))) this.auth = parseInt(unescape(arr[2]))
    },
    getUserList () {
      console.log('nameKeyword = \'' + this.nameKeyword + '\'')
      this.userList = [
        {id: 1, userName: 'test', auth: 1},
        {id: 2, userName: '2', auth: 2},
        {id: 3, userName: '2', auth: 2},
        {id: 4, userName: '2', auth: 2},
        {id: 5, userName: '2', auth: 2},
        {id: 6, userName: '2', auth: 2},
        {id: 7, userName: '2', auth: 2},
        {id: 8, userName: '2', auth: 2},
        {id: 9, userName: '2', auth: 2},
        {id: 10, userName: '2', auth: 2},
        {id: 11, userName: '3', auth: 3}
      ]
      // this.$api.post(//'/user/filter', userName: nameKeyword
      //   '/user/all',
      //   null,
      //   response => { // status, userList[id, userName, auth]
      //     if (response.status === 'success') {
      //       this.userList = response.userList
      //     } else {
      //       window.alert('用户列表获取失败，刷新中...')
      //       window.location.reload() // 刷新本页面，https://www.zhihu.com/question/49863095
      //     }
      //   }
      // )
    },
    isOperationDisabled (operationName, operationUserAuth) {
      // disabled = false, 也就是button可点击
      // console.log('auth=' + this.auth + ' ua=' + userAuth + 'operationName=' + operationName)
      // console.log('isOperationDisabled')
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
        console.log('addUser' + valid)
        if (valid) {
          alert('submit!')
          alert(this.operatingUser.userName + ' ' + this.operatingUser.pwd + ' ' + this.operatingUser.auth)
          this.$refs['addUserForm'].resetFields()
          this.resetOperationUser()
          this.addUserDialogVisible = false
          // this.userList.push({
          //   id: userList.length + 1,
          //   userName: this.operatingUser.userName,
          //   auth: this.operatingUser.auth
          // })
        } else {
          alert('error submit!!')
        }
      })

      // this.$api.post(
      //   '/user/add',
      //   { // userName, pwd, auth
      //     userName: this.newUser.name,
      //     pwd: this.newUser.pwd,
      //     auth: this.newUser.auth
      //   },
      //   response => { // status, id, userName, auth, pictureUrl
      //     if (response.status === 'success') {
      //       this.users.push({
      //         id: response.id,
      //         name: response.userName,
      //         auth: response.auth
      //       })
      //     } else {
      //       window.alert('增加用户失败')
      //     }
      //   }
      // )

      // this.getUserList()
    },
    removeUser () {
      console.log('removeUser' + this.operatingUser.id)
      this.resetOperationUser()
      this.removeUserDialogVisible = false
      // this.$api.post(
      //   '/user/delete',
      //   { // id
      //     id: id
      //   },
      //   response => { // status
      //     if (response.status === 'success') {
      //       this.getUserList() // TODO
      //     } else {
      //       window.alert('删除用户失败')
      //       console.log(response)
      //     }
      //   }
      // )
    },
    modifyUserPwd () {
      console.log('user.vue-modifyUserPwd' + this.operatingUser.id + ' ' + this.operatingUser.pwd + ' ' + this.operatingUser.newPwd) // TODO
      this.resetOperationUser()
      this.modifyPwdDialogVisible = false
    },
    showModifyAuthDialog (id, userName, auth) {
      // console.log('showModifyAuthDialog')
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
      console.log('user.vue-modifyUserAuth' + this.operatingUser.id + ' ' + this.operatingUser.newAuth)
      // this.$api.post(
      //   '/user/auth',
      //   { // id, auth
      //     id: this.operatingUser.id,
      //     auth: this.operatingUser.auth
      //   },
      //   response => { // status
      //     if (response.status === 'success') {
      //       this.getUserList() // TODO
      //     } else {
      //       window.alert('更新用户权限失败')
      //       console.log(response)
      //     }
      //   }
      // )

      this.resetOperationUser()
      this.modifyAuthDialogVisible = false
      this.getUserList()
    },
    showAuth (auth) {
      if (auth === 1) return 'User'
      else if (auth === 2) return 'Admin'
      else return 'Superadmin'
    },
    handleSizeChange: function (size) {
      this.pageSize = size
      console.log('每页' + size + '条')
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage
      console.log('当前为' + currentPage)
    },
    handleClick (row) {
      console.log(row)
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
      console.log(this.authFilter)
    }
  }
}
</script>

<style>
.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

</style>
