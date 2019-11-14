import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import permission from './modules/permission'
import settings from './modules/settings'
import user from './modules/user'
import menuManage from './modules/menu-manage'
import testPaper from './modules/test-paper'
import examinationManage from './modules/examination-manage'
import fileUpload from './modules/file-upload'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    permission,
    settings,
    user,
    menuManage,
    testPaper,
    examinationManage,
    fileUpload
  },
  getters
})

export default store
