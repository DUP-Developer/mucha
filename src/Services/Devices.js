import Api from './Api'

// GET
export const listAll = async () => await Api.get('/device')
export const findOne = async id => await Api.get(`/device/${id}`)

// POST
export const create = async data => await Api.post('/device', data)

// PUT
export const update = async (id, data) => await Api.put(`/device/${id}`, data)

// DELETE
export const remove = async id => await Api.delete(`/device/${id}`)
