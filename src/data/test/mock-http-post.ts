import { HttpPostParams, HttpPostClient, HttpResponse, HttpStatusCode } from '@data/protocols/http'
import faker from 'faker'

export class HttpPostClientSpy implements HttpPostClient {
  url?: string
  payload?: any
  response: HttpResponse = {
    statusCode: HttpStatusCode.ok
  }

  async post (params: HttpPostParams): Promise<HttpResponse> {
    this.url = params.url
    this.payload = params.payload

    return Promise.resolve(this.response)
  }
}

export const mockHttpPostParams: HttpPostParams = {
  url: faker.internet.url(),
  payload: faker.random.objectElement()
}
