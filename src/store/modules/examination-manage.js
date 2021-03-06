/**
 * @Author: YanHuaKang
 * @Date: 2019/11/11
 * @Description: 新增考试，选择试卷，跳页缓存数据
 * @remarks:
 */

const state = {
  exam: sessionStorage.getItem('exam') ? JSON.parse(sessionStorage.getItem('exam')) : {}, // 新增考试，选择试卷，跳页缓存考试数据
  examPaper: sessionStorage.getItem('examPaper') ? JSON.parse(sessionStorage.getItem('examPaper')) : {}, // 新增考试，选择试卷，跳页缓存数据
  activeStep: sessionStorage.getItem('activeStep') ? sessionStorage.getItem('activeStep') : 1,
  createType: sessionStorage.getItem('createType') ? sessionStorage.getItem('createType') : '1',
  examPaperId: sessionStorage.getItem('examPaperId') ? sessionStorage.getItem('examPaperId') : '', // 试卷ID
  examTopics: sessionStorage.getItem('examTopics') ? JSON.parse(sessionStorage.getItem('examTopics')) : [], // 试题
  examLabels: sessionStorage.getItem('examLabels') ? JSON.parse(sessionStorage.getItem('examLabels')) : [] // 标签
}

const mutations = {
  SET_EXAM_PAPER_TEPORARY_STORAGE: (state, examPaper) => {
    state.examPaper = examPaper
    sessionStorage.setItem('examPaper', JSON.stringify(examPaper || {}))
  },
  SET_EXAM_TEPORARY_STORAGE: (state, exam) => {
    state.exam = exam
    sessionStorage.setItem('exam', JSON.stringify(exam))
  },
  SET_ACTIVE_TYPE: (state, activeStep) => {
    state.activeStep = activeStep
    sessionStorage.setItem('activeStep', activeStep)
  },
  SET_CREATE_TYPE: (state, createType) => {
    state.createType = createType
    sessionStorage.setItem('createType', createType)
  },
  SET_EXAM_PAPER_ID: (state, examPaperId) => {
    state.examPaperId = examPaperId
    sessionStorage.setItem('examPaperId', examPaperId)
  },
  SET_TOPICS_TEPORARY_STORAGE: (state, examTopics) => {
    state.examTopics = examTopics
    sessionStorage.setItem('examTopics', JSON.stringify(examTopics))
  },
  SET_LABELS_TEPORARY_STORAGE: (state, examLabels) => {
    state.examLabels = examLabels
    sessionStorage.setItem('examLabels', JSON.stringify(examLabels))
  }
}

const actions = {
  temporaryStorageExam({ commit }, exam) {
    commit('SET_EXAM_TEPORARY_STORAGE', exam)
  },
  temporaryStorageExamPaper({ commit }, examPaper) {
    commit('SET_EXAM_PAPER_TEPORARY_STORAGE', examPaper)
  },
  activeStep({ commit }, activeStep) {
    commit('SET_ACTIVE_TYPE', activeStep)
  },
  createType({ commit }, createType) {
    commit('SET_CREATE_TYPE', createType)
  },
  examPaperId({ commit }, examPaperId) {
    commit('SET_EXAM_PAPER_ID', examPaperId)
  },
  temporaryStorageTopics({ commit }, examTopics) {
    commit('SET_TOPICS_TEPORARY_STORAGE', examTopics)
  },
  examLabels({ commit }, examLabels) {
    commit('SET_LABELS_TEPORARY_STORAGE', examLabels)
  }
}

export default {
  // 通过添加 namespaced: true,使模块具有更高的封装度和复用性，使其成为带命名空间的模块
  namespaced: true,
  state,
  mutations,
  actions
}
