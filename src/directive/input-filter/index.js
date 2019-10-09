import inputFilter from './input-filter'

const install = function(Vue) {
  Vue.directive('inputFilter', inputFilter)
}

if (window.Vue) {
  window['inputFilter'] = inputFilter
  Vue.use(install); // eslint-disable-line
}

inputFilter.install = install
export default inputFilter
