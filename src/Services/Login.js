import Api from './Api'

export const login = async (data) => await Api.post('/login', data)
