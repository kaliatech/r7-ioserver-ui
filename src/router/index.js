import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import IoControllers from '@/views/iocontrollers/IoControllersView'
import IoControllerEdit from '@/views/iocontrollers/IoControllerEdit'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/controllers',
      name: 'IoControllers',
      component: IoControllers
    },
    {
      path: '/controllers/:id',
      name: 'IoControllerEdit',
      component: IoControllerEdit
    }
  ]
})
