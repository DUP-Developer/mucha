/* eslint-disable */
export default {
  get () {
    return localStorage.getItem('advansat@tempMap')
  },

  set (data) {
    localStorage.setItem('advansat@tempMap', data)
  },

  remove () {
    localStorage.removeItem('advansat@tempMap')
  }
}
