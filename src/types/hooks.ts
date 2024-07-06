import type { AxiosError, AxiosHeaders } from "axios";

export interface IHooks {
	/**
	 * Hook to detect, if need to proccess the http error with the interceptor
	 * @param {AxiosError} error
	 * @returns {Promise<boolean> | boolean}
	 */
	isAuthError(error: AxiosError): Promise<boolean> | boolean;

	/*
	 * Getter to receive current refresh token
	 * @return {Promise<string | false> | string | false}
	 */
	getRefreshToken(): Promise<string | false> | string | false;

	/**
	 * Request on backend to receivce new token and refresh token
	 * @param {string} refreshToken
	 * @return { Promise<{ token: string, refresh_token: string } | false> }
	 */
	fetchNewTokens(
		refreshToken: string,
	): Promise<false | { token: string; refresh_token: string }>;

	/**
	 * Hook to update your localStorage, vuex, pinia, etc. with new tokens
	 * @param {{token: string, refresh_token: string}} newTokens
	 * @return {void}
	 */
	updateTokens(newTokens: {
		token: string;
		refresh_token: string;
	}): Promise<void>;

	/**
	 * Hook to update auth headers, for example, with new access token, recieved after refresh
	 * @param {AxiosHeaders} headers
	 * @param {string} token
	 * @returns {Promise<AxiosHeaders>}
	 * */
	setAuthHeaders(
		headers: AxiosHeaders | undefined,
		token: string,
	): Promise<AxiosHeaders>;

	/**
	 * Hook to perform logout logic, including redirect to login page
	 * @param {AxiosError} error
	 * @return {void}
	 */
	logout(error: AxiosError): Promise<void>;
}
