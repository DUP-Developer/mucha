export default {
  /**
   * Getter e setter de regras do usuario
   * nivel de acesso no local history
   */
  getRule () {
    const data = localStorage.getItem('advansat@rule')

    return data || 'anonymous'
  },

  setRule (data) {
    localStorage.setItem('advansat@rule', data)
  },

  /**
   * Getter e setter de dados do usuario
   * logado
   */
  getUser () {
    let user = JSON.parse(localStorage.getItem('advansat@user'))

    if (!user) {
      user = {
        userType: 'anonymous'
      }
    }

    return user
  },

  setUser (data) {
    localStorage.setItem('advansat@user', JSON.stringify(data))
  },

  /**
   * Getter e setter do token do usuario
   * logado
   */
  getToken () {
    return localStorage.getItem('advansat@token')
  },

  setToken (data) {
    localStorage.setItem('advansat@token', data)
  },

  /**
   * Getter e setter de linguagem
   */
  getLocale () {
    const locale = localStorage.getItem('locale')
    return locale || 'pt-br'
  },

  setLocale (data) {
    localStorage.setItem('locale', data)
  },

  isFirstAccess() {
    return this.getUser().newUser
  }
}
