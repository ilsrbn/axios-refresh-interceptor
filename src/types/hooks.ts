import type {AxiosError} from 'axios';

export interface IHooks {
  /*
   * Getter to receive current refresh token
   * @return {string | false}
   */
  getRefreshToken(): string | false;

  /*
   * Request on backend to receivce new token and refresh token
   * @param {string} refreshToken
   * @return { Promise<{ token: string, refresh_token: string } | false> }
   */
  fetchNewTokens(
    refreshToken: string
  ): Promise<false | {token: string; refresh_token: string}>;

  /*
   * Hook to update your localStorage, vuex, pinia, etc. with new tokens
   * @param {{token: string, refresh_token: string}} newTokens
   * @return {void}
   */
  updateTokens(newTokens: {token: string; refresh_token: string}): void;

  /*
   * Hook to perform logout logic, including redirect to login page
   * @param {AxiosError} error
   * @return {void}
   */
  logout(error: AxiosError): void;
}
