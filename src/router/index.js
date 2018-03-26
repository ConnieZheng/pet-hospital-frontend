import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import MyApp from '@/pages/myApp'
import Login from '@/pages/login'
import Home from '@/pages/home'
import User from '@/pages/user'
import Question from '@/pages/question'
import Department from '@/pages/department'
import Procedure from '@/pages/procedure'
import Case from '@/pages/case'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: MyApp,
      children: [
        {
          path: '',
          component: Home
        },
        {
          path: 'user',
          // name: 'User',
          component: User
        },
        {
          path: 'question',
          component: Question
        },
        {
          path: 'department',
          component: Department
        },
        {
          path: 'procedure',
          component: Procedure
        },
        {
          path: 'case',
          component: Case
        }
      ]
    },
    {
      path: '/helloworld',
      name: 'HelloWorld',
      component: HelloWorld
    }, {
      path: '/login',
      // name: 'Login',
      component: Login
    }
  ]
})
