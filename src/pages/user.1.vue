<template>
  <div>
    <h3>用户管理</h3>
    <!-- <p>authFilter = {{authFilter}}</p> -->
    <!-- 逻辑完善，未测试过api，未引入elementui -->
    <input v-model="nameKeyword" placeholder="用户名">
    <button v-on:click="getUserList">搜索用户</button>

    <table border="1">
      <thead>
        <tr>
          <!-- <th>id</th> -->
          <th>name</th>
          <th>auth
            <select v-model="authFilter">
              <option v-for="option in authFilterOptions" :key="option" v-bind:value="option">{{showAuth(option)}}</option>
            </select>
          </th>
          <th>
            operations
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in filteredUsers" v-bind:key="user.id">
          <!-- <td>{{user.id}}</td> -->
          <td>{{user.userName}}</td>
          <td>{{showAuth(user.auth)}}</td>
          <td>
            <button v-bind:disabled="isOperationDisabled('modifyUserPwd',user.auth)" v-on:click="showModifyPwdDialog(user.id)">重置密码</button>
            <button v-bind:disabled="isOperationDisabled('modifyUserAuth',user.auth)" v-on:click="showModifyAuthDialog(user.id)">修改权限</button>
            <button v-bind:disabled="isOperationDisabled('removeUser',user.auth)" v-on:click="removeUser(user.id)">删除用户</button>
          </td>
        </tr>
      </tbody>
    </table>

    <button v-on:click="addUserDialogVisible = !addUserDialogVisible">+</button>
    <div v-show="addUserDialogVisible">
      <input type="text" v-model="operatingUser.userName" placeholder="username">
      <input type="text" v-model="operatingUser.pwd" placeholder="password">
      <select v-model="operatingUser.auth">
        <option v-for="option in userAuthOptions" :key="option" v-bind:value="option">{{showAuth(option)}}</option>
      </select>
      <button v-on:click="addUser">增加用户</button>
    </div>

    <div v-show="modifyAuthDialogVisible">
      <select v-model="operatingUser.auth">
        <option v-for="option in userAuthOptions" :key="option" v-bind:value="option">{{showAuth(option)}}</option>
      </select>
      <button v-on:click="modifyUserAuth">修改权限</button>
    </div>

    <div v-show="modifyPwdDialogVisible">
      <input v-model="operatingUser.pwd">
      <button v-on:click="modifyUserPwd">重置密码</button>
    </div>
  </div>

</template>

<script>
export default {
  data () {
    return {
      // name: '', // this.$route.params.name,
      auth: 0,
      authFilter: 0,
      authFilterOptions: [
        0, 1, 2, 3
        // { value: 0, text: 'All' },
        // { value: 1, text: 'User' },
        // { value: 2, text: 'Admin' },
        // { value: 3, text: 'Superadmin' }
      ],
      nameKeyword: '',
      userList: [],
      userAuthOptions: [], // addUser, modifyAuth
      operatingUser: {
        id: '',
        userName: '',
        pwd: '',
        auth: 1
      },
      addUserDialogVisible: false,
      modifyPwdDialogVisible: false,
      modifyAuthDialogVisible: false
    }
  },
  created () { // no need to validate user auth, since myApp.vue already did that for us
    this.getAuth()
    this.getUserList()
    this.userAuthOptions = this.getUserAuthOptions()
  },
  computed: {
    filteredUsers: function () {
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
      // console.log('getAuth')
      var arr
      var reg = new RegExp('(^| )' + 'auth' + '=([^;]*)(;|$)')

      if ((arr = document.cookie.match(reg))) this.auth = parseInt(unescape(arr[2]))
    },
    getUserList () {
      // console.log('getUserList')
      console.log(this.nameKeyword)
      this.userList = [
        {id: 1, userName: '1', auth: 1},
        {id: 2, userName: '2', auth: 2},
        {id: 3, userName: '3', auth: 3}
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
        return [1, 2, 3]
      } else { // normal admin
        return [1]
      }
    },
    resetOperationUser () {
      // console.log('resetOperationUser')
      this.operatingUser.id = 0
      this.operatingUser.userName = ''
      this.operatingUser.auth = 1
      this.operatingUser.pwd = ''
    },
    addUser () {
      // console.log('addUser')
      if (this.operatingUser.userName === '' || this.operatingUser.pwd === '') {
        // this.msg = '请输入用户名和密码后再登录'
        return
      }

      this.userList.push({
        id: '4',
        userName: this.operatingUser.userName,
        auth: this.operatingUser.auth
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

      this.resetOperationUser()
      this.addUserDialogVisible = false
      // this.getUserList()
    },
    removeUser (id) {
      console.log('removeUser' + id)
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
      console.log('user.vue-modifyUserPwd' + this.operatingUser.id) // TODO
      this.resetOperationUser()
      this.modifyPwdDialogVisible = false
    },
    showModifyAuthDialog (id) {
      // console.log('showModifyAuthDialog')
      this.modifyAuthDialogVisible = true
      this.operatingUser.id = id
    },
    showModifyPwdDialog (id) {
      this.modifyPwdDialogVisible = true
      this.operatingUser.id = id
    },
    modifyUserAuth () {
      console.log('user.vue-modifyUserAuth' + this.operatingUser.id)
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
      // console.log('user.vue-showAuth' + typeof auth)
      if (auth === 0) return 'All'
      else if (auth === 1) return 'User'
      else if (auth === 2) return 'Admin'
      else return 'Superadmin'
    }
  }
}
</script>
