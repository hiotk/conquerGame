import Cookies from 'js-cookie'
const AuthKey = 'AuthKey'


export function getToken() {
  return Cookies.get(AuthKey)
}

export function setToken(token) {
  return Cookies.set(AuthKey, token, { expires: 29 })
}

export function removeToken() {
  return Cookies.remove(AuthKey)
}
