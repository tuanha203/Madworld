
import initializeBasicAuth from 'nextjs-basic-auth';

export const isUserAuthenticated = () => {
  const accessToken = localStorage.getItem('accessToken')
  return accessToken ? true : false
}

export const isHaveAccessToken = () => {
  const accessToken = localStorage.getItem('accessToken')
  return !!accessToken
}

const basicUsers = [
  { user: 'madworld', password: 'M4dw0rld!#' },
]
export const basicAuthCheck = initializeBasicAuth({
  users: basicUsers
})
