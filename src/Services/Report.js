import Api from './Api'

export const listAll = async () => await Api.get('/report')
export const create = async (data) => await Api.post('/report', data)
export const remove = async (id) => await Api.delete(`/report/${id}`)
export const update = async (id, data) => await Api.put(`/report/${id}`, data)
