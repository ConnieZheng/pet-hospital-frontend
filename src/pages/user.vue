<template>
  <div>
    <h3>user management</h3>
    <!-- <p>authFilter = {{authFilter}}</p> -->
    <table border="1">
      <thead>
        <tr>
          <th>id</th>
          <th>name</th>
          <th>auth
            <select v-model="authFilter">
              <option v-for="option in options" :key="option.value" v-bind:value="option.value">{{option.text}}</option>
            </select>
          </th>
          <th>
            operation
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in filteredUsers" v-bind:key="user.id">
          <td>{{user.id}}</td>
          <td>{{user.userName}}</td>
          <td>{{showAuth(user.auth)}}</td>
          <td>
            <!-- <button v-bind:disabled="getOperationsFilter('resetPwd',user.auth)" v-on:click="resetPwd(user.id)">重置密码</button> -->
            <button v-bind:disabled="getOperationsFilter('modifyAuth',user.auth)" v-on:click="showModifyTable(user.id)">修改权限</button>
            <button v-bind:disabled="getOperationsFilter('removeUser',user.auth)" v-on:click="removeUser(user.id)">删除用户</button>
          </td>
        </tr>
      </tbody>
    </table>

    <button v-on:click="addTableVisible = !addTableVisible">+</button>
    <div v-show="addTableVisible">
      <input type="text" v-model="newUser.name" placeholder="username">
      <input type="text" v-model="newUser.pwd" placeholder="password">
      <select v-model="newUser.auth">
        <option v-for="option in userAuthOptions" :key="option.value" v-bind:value="option.value">{{option.text}}</option>
      </select>
      <button v-on:click="addUser">增加用户</button>
    </div>

    <div v-show="modifyAuthTableVisible">
      <select v-model="operatingUser.auth">
        <option v-for="option in userAuthOptions" :key="option.value" v-bind:value="option.value">{{option.text}}</option>
      </select>
      <button v-on:click="modifyAuth">修改权限</button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // name: '', // this.$route.params.name,
      // picPath: {}
      authFilter: '0',
      options: [
        { value: '0', text: 'All' },
        { value: '1', text: 'User' },
        { value: '2', text: 'Admin' },
        { value: '3', text: 'Superadmin' }
      ],
      users: [],
      addTableVisible: false,
      newUser: {
        name: '',
        pwd: '',
        auth: ''
      },
      userAuthOptions: [],
      auth: '0',
      operatingUser: {
        id: '',
        pwd: '',
        auth: ''
      },
      modifyAuthTableVisible: false
    }
  },
  created () {
    this.getUserList()
    this.auth = this.getCookie('auth')
    this.userAuthOptions = this.getUserAuthOptions(this.auth)
  },
  computed: {
    filteredUsers: function () {
      // console.log(typeof this.authFilter)
      // console.log('this.authFilter' + this.authFilter)
      if (this.authFilter === '0') {
        return this.users
      }
      return this.users.filter(function (user) {
        // console.log(typeof user.auth)
        // console.log('user.auth' + user.auth)
        return user.auth.indexOf(this.authFilter) !== -1
      }.bind(this))
    }
  },
  methods: {
    getUserList () {
      this.$api.post(
        '/user/all',
        null,
        response => { // status, userList[id, userName, auth]
          if (response.status === 'success') {
            this.users = response.userList
          } else {
            window.alert('用户列表获取失败，刷新中...')
            window.location.reload() // 刷新本页面，https://www.zhihu.com/question/49863095
          }
        }
      )
    },
    getCookie (key) {
      var arr
      var reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)')

      if ((arr = document.cookie.match(reg))) return unescape(arr[2])
      else return null
    },
    getOperationsFilter (operationName, userAuth) {
      // console.log('auth=' + this.auth + ' ua=' + userAuth + 'operationName=' + operationName)
      if (this.auth === '3') {
        return false // disabled = false, 也就是button可点击
      } else if (this.auth === '2' && userAuth === '1' && operationName !== 'modifyAuth') {
        return false
      } else if (this.auth === '2') {
        return true
      } else { // normal user
        this.$router.push({
          name: 'Login'
        })
      }
    },
    getUserAuthOptions (auth) {
      if (auth === '3') { // super admin
        return this.options.slice(1, 4)
      } else if (auth === '2') { // normal admin
        return this.options.slice(1, 2)
      } else { // normal user
        // console.log('user.vue - getUserAuthOptions fail')
        this.$router.push({
          name: 'Login'
        })
      }
    },
    addUser () {
      this.$api.post(
        '/user/add',
        { // userName, pwd, auth
          userName: this.newUser.name,
          pwd: this.newUser.pwd,
          auth: this.newUser.auth
        },
        response => { // status, id, userName, auth, pictureUrl
          if (response.status === 'success') {
            this.users.push({
              id: response.id,
              name: response.userName,
              auth: response.auth
            })
          } else {
            window.alert('增加用户失败')
          }
        }
      )

      this.newUser.name = ''
      this.newUser.auth = ''
      this.addTableVisible = false
      // this.getUserList()
    },
    removeUser (id) {
      this.$api.post(
        '/user/delete',
        { // id
          id: id
        },
        response => { // status
          if (response.status === 'success') {
            this.getUserList() // TODO
          } else {
            window.alert('删除用户失败')
            console.log(response)
          }
        }
      )
    },
    resetPwd (id) {
      console.log(id + 'resetPwd\t') // TODO
    },
    showModifyTable (id) {
      this.modifyAuthTableVisible = !this.modifyAuthTableVisible
      if (this.modifyAuthTableVisible === true) {
        this.operatingUser.id = id
      }
    },
    modifyAuth () {
      this.$api.post(
        '/user/auth',
        { // id, auth
          id: this.operatingUser.id,
          auth: this.operatingUser.auth
        },
        response => { // status
          if (response.status === 'success') {
            this.getUserList() // TODO
          } else {
            window.alert('更新用户权限失败')
            console.log(response)
          }
        }
      )
      this.getUserList()
    },
    showAuth (auth) {
      if (auth === '1') return 'User'
      else if (auth === '2') return 'Admin'
      else return 'Superadmin'
    }
  }
}
</script>
