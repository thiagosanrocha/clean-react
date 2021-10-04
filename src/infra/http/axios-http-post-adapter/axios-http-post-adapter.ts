import { HttpPostClient, HttpResponse, HttpPostParams } from '@data/protocols/http'
import axios from 'axios'

export class AxiosHttpPostAdapter implements HttpPostClient {
  async post (params: HttpPostParams): Promise<HttpResponse> {
    const { data, status } = await axios.post(params.url, params.payload)

    return {
      statusCode: status,
      body: data
    }
  }
}
