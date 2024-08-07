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


const isAuthError = async (error) => {
  // Your logic to define, if the axios error need to be processed with the interceptor
	// error.response && error.response.status === 401 &&	error.config?.url !== `${ApiUrl}/auth/refresh`
}

const getRefreshToken = async () => {
  // Your logic of receiving refresh token (Ex.: from localStorage)
}

const updateTokens = async ({ token, refresh_token }) => {
  // Your logic of updating your store (localStorage, redux, etc.) with new token and refresh token
}

const fetchNewTokens = async (refreshToken) => {
  // Your logic receiving new tokens. Usually - request to backend's /auth/refresh endpoint
}

const	setAuthHeaders = async (headers, token) => {
  // Your logic to update Auth Headers. First arg is Headers from latest failed request.
}


const logout = async (axiosError) => {
  // Your logic of logging out user in case if:
  // 1. getRefreshToken returns false
  // 2. fetchNewTokens return false,
  // 3. Retried latest request still returns error, even with new tokens
}

// Few things to notice
// 1. Pass your created `axiosIns` as 1-st argument
// 2. Pass object with your implemented hooks as 2-nd argument (take a look at provided autocomplete typings)
const responsetInterceptor = new ResponseInterceptor(
  axiosIns,
  {
    isAuthError,
    fetchNewTokens,
    getRefreshToken,
    setAuthHeaders,
    updateTokens,
    logout
  }
)

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
6. Update auth headers.
7. Retry latest request with new token
8. If latest request fails again - logout. (`logout(error)`)

## If you want to support me, you can [buy me a coffee](https://www.buymeacoffee.com/ilsrbn). Thanks!
