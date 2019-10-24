import Api from './Api'

// GET´s
export const listAll = async () => await Api.get('/item')

// POST´s
export const create = async item => await Api.post('/item', item)
export const createMetrics = async (id, data) =>
  await Api.post(`/item/${id}/metrics`, data)

// DELETE´s
export const remove = async id => await Api.delete(`/item/${id}`)
export const removeMetric = async (id, data) =>
  await Api.delete(`/item/${id}/metrics/${data}`)

// PUT's
export const update = async (id, data) => await Api.put(`/item/${id}`, data)
