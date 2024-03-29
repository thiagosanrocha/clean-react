import { HttpResponse } from './http-response'

export type HttpPostParams = {
  url: string
  payload?: any
}

export interface HttpPostClient {
  post<T = any>(params: HttpPostParams): Promise<HttpResponse<T>>
}
