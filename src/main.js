// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import VueProgressBar from 'vue-progressbar'

import App from './App'

import store from '@/store'
import router from './router'

// https://github.com/FortAwesome/vue-fontawesome
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import fontawesome from '@fortawesome/fontawesome'

import faChevronUp from '@fortawesome/fontawesome-free-solid/faChevronUp'
import faChevronDown from '@fortawesome/fontawesome-free-solid/faChevronDown'
import faChevronLeft from '@fortawesome/fontawesome-free-solid/faChevronLeft'
import faChevronRight from '@fortawesome/fontawesome-free-solid/faChevronRight'
import faEdit from '@fortawesome/fontawesome-free-solid/faEdit'
import faExclamation from '@fortawesome/fontawesome-free-solid/faExclamationCircle'
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner'
import faStop from '@fortawesome/fontawesome-free-solid/faStop'
import faPlay from '@fortawesome/fontawesome-free-solid/faPlay'
import faPlusSquare from '@fortawesome/fontawesome-free-solid/faPlusSquare'
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt'

import promiseFinally from 'promise.prototype.finally'

promiseFinally.shim()

fontawesome.library.add(faChevronUp)
fontawesome.library.add(faChevronDown)
fontawesome.library.add(faChevronLeft)
fontawesome.library.add(faChevronRight)
fontawesome.library.add(faEdit)
fontawesome.library.add(faExclamation)
fontawesome.library.add(faPlay)
fontawesome.library.add(faSpinner)
fontawesome.library.add(faStop)
fontawesome.library.add(faTrashAlt)

fontawesome.library.add(faPlusSquare)

Vue.use(BootstrapVue)
Vue.use(VueProgressBar)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App, FontAwesomeIcon},
  template: '<App/>'
})
