export const validateObjectId = id => {
  var bool = false
  if (id.length === 24) bool = /[a-f]+/.test(id)
  return bool
}

export const transformNameId = string => {
  return string.replace(/\s/, '-').toLowerCase()
}
