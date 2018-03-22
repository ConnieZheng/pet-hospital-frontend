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
          <td>{{user.name}}</td>
          <td>{{user.auth}}</td>
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
import axios from 'axios'
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
      // console.log(this.authFilter)
      if (this.authFilter === '0') {
        return this.users
      }
      return this.users.filter(function (user) {
        return user.auth.indexOf(this.authFilter) !== -1
      }.bind(this))
    }
  },
  methods: {
    getUserList () {
      axios
        .get('/api/users')
        .then(response => {
          if (response.data.status === 'success') {
            this.users = response.data.userList
          } else {
            window.alert('user list fail, refreshing this page...')
            window.location.reload()
          }
        })
        .catch(error => {
          console.log(error.response.status)
        })
    },
    getCookie (key) {
      var arr
      var reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)')

      if ((arr = document.cookie.match(reg))) return unescape(arr[2])
      else return null
    },
    getOperationsFilter (operationName, userAuth) {
      // console.log('auth=' + this.auth + 'ua=' + userAuth)
      if (this.auth === '3') {
        return false // disabled = false, 也就是button可见
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
        console.log('Not admin user, back to login page')
        this.$router.push({
          name: 'Login'
        })
      }
    },
    addUser () {
      axios({
        url: '/api/users',
        method: 'post',
        data: {
          // pwd: this.newUser.pwd,
          id: 6, // this.newUser.id,
          name: this.newUser.name,
          auth: this.newUser.auth
        }
        // transformRequest: [function (data) {
        //   // Do whatever you want to transform the data
        //   let ret = ''
        //   for (let it in data) {
        //     ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        //   }
        //   return ret
        // }],
        // headers: {
        //   'Content-Type': 'application/x-www-form-urlencoded'
        // }
      })
      this.newUser.name = ''
      this.newUser.auth = ''
      this.addTableVisible = false
      this.getUserList()
    },
    removeUser (id) {
      console.log(id + 'removeUser\t')
      axios({
        url: '/api/userList/' + id,
        method: 'delete'
        // data: {
        //   id: id
        // }
      })
      this.getUserList()
    },
    resetPwd (id) {
      console.log(id + 'resetPwd\t')
    },
    showModifyTable (id) {
      this.modifyAuthTableVisible = !this.modifyAuthTableVisible
      if (this.modifyAuthTableVisible === true) {
        this.operatingUser.id = id
      }
    },
    modifyAuth () {
      axios({
        url: '/api/userList/' + this.operatingUser.id,
        method: 'put',
        data: {
          name: 'id1-auth1', //
          auth: this.operatingUser.auth
        }
      })
      this.getUserList()
    }
  }
}
</script>
