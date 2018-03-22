<template>
  <div>
    <p>user management  </p>
    <p>authFilter = {{authFilter}}</p>
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
        </tr>
      </thead>

      <tbody>
        <tr v-for="user in filteredUsers" v-bind:key="user.id">
          <td>{{user.id}}</td>
          <td>{{user.name}}</td>
          <td>{{user.auth}}</td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
export default {
  data () {
    return {
      authFilter: '0',
      options: [
        { value: '0', text: 'All' },
        { value: '1', text: 'User' },
        { value: '2', text: 'Admin' },
        { value: '3', text: 'Superadmin' }
      ],
      users: [
        {
          'name': 'id1-auth1',
          'auth': '1',
          'id': 1
        },
        {
          'id': 2,
          'name': 'id2-auth1',
          'auth': '2'
        }
      ]
    }
  },
  computed: {
    filteredUsers: function () {
      if (this.authFilter === '0') {
        // console.log(this.users)
        return this.users
      }
      return this.users.filter(function (user) {
        return user.auth.indexOf(this.authFilter) !== -1
      }.bind(this))
    }
  }
}
</script>
