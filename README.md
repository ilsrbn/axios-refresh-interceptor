# Not for public usage
_Package created only to easily use Refresh tokens strategy within Frontend apps._

## Usage (with common axios setup configuration)
```javascript
import { ResponseInterceptor } from '@ilsrbn/axios-refresh-interceptor'

const axiosIns = axios.create({
  // Your configuration
})

axiosIns.interceptors.request.use(
  // Your interceptors for request
)

const getRefreshToken = () => {
  // Your logic of receiving refresh token (Ex.: from localStorage)
}

const updateTokens = ({ token, refresh_token }) => {
  // Your logic of updating your store (localStorage, redux, etc.) with new token and refresh token
}

const fetchNewTokens = (refreshToken) => {
  // Your logic receiving new tokens. Usually - request to backend's /auth/refresh endpoint
}

const logout = (axiosError) => {
  // Your logic of logging out user in case if:
  // 1. getRefreshToken returns false
  // 2. fetchNewTokens return false,
  // 3. Retried latest request still returns error, even with new tokens
}

// Few things to notice
// 1. Pass your created `axiosIns` as 1-st argument
// 2. Pass object with your implemented hooks as 2-nd argument (take a look at provided autocomplete typings)
const requestInterceptor = new ResponseInterceptor(axiosIns, { fetchNewTokens, getRefreshToken, updateTokens, logout })

axiosIns.interceptors.response.use(
  // Your response `onFullfilled` interceptor
  (response) => {}

  // Here pass `onRejected` method from interceptor class
  (error) => responsetInterceptor.onRejected(error),
)

export default axiosIns
```

## Refresh flow overview

1. Check, if there is refresh token (`getRefreshToken()`)
2. If no refresh token - logout (`logout(error)`)
3. If it's present - fetch new tokens from backend (`fetchNewTokens(refreshToken)`)
4. If cannot receive new tokens - logout (`logout(error)`)
5. If received new - update storage with new tokens (`updateTokens({ token, refresh_token })`)
6. Retry latest request with new token
7. If latest request fails again - logout. (`logout(error)`)

