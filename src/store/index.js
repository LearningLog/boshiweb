import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import permission from './modules/permission'
import settings from './modules/settings'
import menuManage from './modules/menu-manage'
import user from './modules/user'
import egroup from './modules/egroup'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    permission,
    settings,
    user,
    menuManage,
    egroup
  },
  getters
})

export default store
