import Api from './Api'

// GET´s
export const getAllItems = async id =>
  await Api.get(`/map-navigation/screen/${id}/items`)

// PUT
export const update = async (id, data) =>
  await Api.put(`map-navigation/screen/${id}`, data)
export const updateItemsOfScreen = async (id, data) =>
  await Api.put(`/map-navigation/screen/${id}/items`, data)

// POST
export const createChildrenScreen = async (id, data) =>
  await Api.post(`map-navigation/screen/${id}`, data)
