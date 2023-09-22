/* NOTE: Refresh flow overview
 * 1. Check, if there is refresh token
 * 2.a. If no refresh token - logout
 * 2.b. If it's present - fetch new tokens from backend
 * 3.a. If cannot receive new tokens - logout
 * 3.b. If received new - retry latest request with new token
 * 4. If latest request fails again - logout.
 * */

import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  RawAxiosRequestHeaders,
} from 'axios';

import type {IHooks, IResponseInterceptor} from './types';

export class ResponseInterceptor implements IResponseInterceptor {
  constructor(
    /**
     * An instance of Axios for making HTTP requests.
     * @type {AxiosInstance}
     */
    private axios: AxiosInstance,

    /**
     * An object containing hooks for various operations.
     * @type {IHooks}
     */
    private hooks: IHooks
  ) {}

  public onFullfilled(response: AxiosResponse) {
    return response;
  }

  public async onRejected(error: AxiosError) {
    // INFO: Handled logic for tokens refreshing
    if (error.response && error.response.status === 401) {
      const refreshToken = this.hooks.getRefreshToken();

      if (!refreshToken) this.hooks.logout(error);
      else {
        const newTokens = await this.hooks.fetchNewTokens(refreshToken);
        if (!newTokens) this.hooks.logout(error);
        else {
          this.hooks.updateTokens(newTokens);

          // WARN: Workaround for axios issue
          // Issue: https://github.com/axios/axios/issues/5089#issuecomment-1297761617
          const config = this.convertAxiosHeaders(error.config || {});

          try {
            return await this.retryLatestRequest(config);
          } catch (latestError) {
            console.warn("Latest request wasn't performed.", latestError);
            this.hooks.logout(latestError as AxiosError);
          }
        }
      }
    }

    return Promise.reject(error);
  }

  private retryLatestRequest(
    config: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    return new Promise(resolve => {
      resolve(this.axios(config));
    });
  }

  // WARN: Workaround for axios issue
  // Issue: https://github.com/axios/axios/issues/5089#issuecomment-1297761617
  private convertAxiosHeaders(config: AxiosRequestConfig): AxiosRequestConfig {
    config.headers = JSON.parse(
      JSON.stringify(config.headers || {})
    ) as RawAxiosRequestHeaders;

    return config;
  }
}
