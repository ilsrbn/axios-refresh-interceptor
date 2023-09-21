import type { AxiosError, AxiosResponse } from "axios";

export interface IResponseInterceptor {
  onFullfilled: (response: AxiosResponse<any, any>) => AxiosResponse<any, any>;
  onRejected: (error: AxiosError) => any;
}
