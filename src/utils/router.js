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
import Disease from '@/pages/disease'
import Profile from '@/pages/profile'
// import Test from '@/pages/test'
import NotFound from '@/components/error'
Vue.use(Router)

export default new Router({
  mode: 'history',
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
        },
        {
          path: 'disease',
          component: Disease
        },
        {
          path: 'profile',
          component: Profile
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
    // }, {
    //   path: '/test',
    //   component: Test
    }, {
      path: '*',
      component: NotFound
    }
  ]
})
