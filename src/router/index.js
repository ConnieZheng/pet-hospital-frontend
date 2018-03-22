import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import MyApp from '@/pages/myApp'
import Login from '@/pages/login'
import User from '@/pages/user'
import Question from '@/pages/Question'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: MyApp,
      children: [
        {
          path: 'user',
          name: 'User',
          component: User
        },
        {
          path: 'question',
          component: Question
        }
      ]
    },
    {
      path: '/helloworld',
      name: 'HelloWorld',
      component: HelloWorld
    }, {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
