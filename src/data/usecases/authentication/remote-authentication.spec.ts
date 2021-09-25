import { RemoteAuthentication } from './remote-authentication'
import { HttpPostClient, HttpResponse, HttpStatusCode } from '@data/protocols/http'

type SutTypes = {
  sut: RemoteAuthentication
  httpPostClientSpy: HttpPostClientSpy
}

class HttpPostClientSpy implements HttpPostClient {
  response: HttpResponse = {
    statusCode: HttpStatusCode.ok
  }

  async post (): Promise<HttpResponse> {
    return Promise.resolve(this.response)
  }
}

const makeSut = (): SutTypes => {
  const url = 'any_url'
  const httpPostClientSpy = new HttpPostClientSpy()
  const sut = new RemoteAuthentication(url, httpPostClientSpy)

  return {
    sut,
    httpPostClientSpy
  }
}

describe('RemoteAuthentication', () => {
  test('Should return an AccountModel if HttpPostClient return 200', async () => {
    const { sut, httpPostClientSpy } = makeSut()

    const mockHttpResponse = {
      accessToken: 'any_token',
      name: 'any_name'
    }

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: mockHttpResponse
    }

    const authCredentials = {
      email: 'any_email@mail.com',
      password: 'any_password'
    }

    const account = await sut.auth(authCredentials)

    expect(account).toEqual(mockHttpResponse)
  })
})
