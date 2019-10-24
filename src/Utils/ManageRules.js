import Auth from './Auth'

/**
 * Pegando as informações de regras do usuario
 * assim sabendo se ele possue ou permição
 * para poder acessar determinada rota
 *
 * @param {*} rule
 */
export const isPermited = (rule) => {
  return Auth.getUser() ? rule.split('|').includes(Auth.getUser().userType) : false
}
