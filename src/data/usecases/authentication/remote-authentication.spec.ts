import { RemoteAuthentication } from './remote-authentication'
import { HttpPostClient, HttpResponse, HttpStatusCode, HttpPostParams } from '@data/protocols/http'

class HttpPostClientSpy implements HttpPostClient {
  url?: string
  response: HttpResponse = {
    statusCode: HttpStatusCode.ok
  }

  async post (params: HttpPostParams): Promise<HttpResponse> {
    this.url = params.url
    return Promise.resolve(this.response)
  }
}

type SutTypes = {
  sut: RemoteAuthentication
  httpPostClientSpy: HttpPostClientSpy
}

const makeSut = (url = 'any_url'): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy()
  const sut = new RemoteAuthentication(url, httpPostClientSpy)

  return {
    sut,
    httpPostClientSpy
  }
}

describe('RemoteAuthentication', () => {
  test('Should call HttpPostClient with correct URL', async () => {
    const url = 'any_url'

    const { sut, httpPostClientSpy } = makeSut(url)

    const authCredentials = {
      email: 'any_email@mail.com',
      password: 'any_password'
    }

    await sut.auth(authCredentials)

    expect(httpPostClientSpy.url).toBe(url)
  })

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
