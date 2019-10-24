import Api from './Api'

// GET
export const listAll = async () => await Api.get('/user')

// POST
export const create = async data => await Api.post('/user', data)
export const alterPassword = async data => await Api.post('/user/create-password', data)

// DELETE
export const remove = async id => await Api.delete(`/user/${id}`)

// PUT
export const update = async (id, data) => await Api.put(`/user/${id}`, data)
export const resetPassword = async (id) => await Api.put(`/user/reset-password/${id}`)

  
