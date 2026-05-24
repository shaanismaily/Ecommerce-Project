import axios from "axios"
import store from "../store/store"

const client = axios.create({
    baseURL: "https://api.freeapi.app/api/v1",
    headers: {"Content-Type" : "application/json"}
})

client.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const { data } = await client.post('/users/refresh-token', {
          refreshToken: getRefreshToken()  // ← send it in body, not cookie
        })
        setAccessToken(data.data.accessToken)
        setRefreshToken(data.data.refreshToken)
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`
        return client(originalRequest)
      } catch {
        setAccessToken(null)
        setRefreshToken(null)
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

let _accessToken  = null
let _refreshToken = null

export const getAccessToken  = () => _accessToken
export const setAccessToken  = (token) => { _accessToken = token }
export const getRefreshToken = () => _refreshToken
export const setRefreshToken = (token) => { _refreshToken = token }

export default client