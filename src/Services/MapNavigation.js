import Api from './Api'

// GET
export const getWizard = async () => (await Api.get('/map-navigation/default')).data
export const getMapNavigation = async (id) => (await Api.get(`/map-navigation/screen/${id}`)).data

// POST
export const getRoot = async (data) => {
  const result = await Api.post('/map-navigation', data)
  return result
}

// DELETE
export const deleteScreen = async (id) => {
  const result = await Api.delete(`/map-navigation/screen/${id}`)
  return result
}
