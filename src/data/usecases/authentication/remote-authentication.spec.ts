import { RemoteAuthentication } from './remote-authentication'
import { HttpPostClient, HttpResponse, HttpStatusCode, HttpPostParams } from '@data/protocols/http'
import faker from 'faker'

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

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy()
  const sut = new RemoteAuthentication(url, httpPostClientSpy)

  return {
    sut,
    httpPostClientSpy
  }
}

describe('RemoteAuthentication', () => {
  test('Should call HttpPostClient with correct URL', async () => {
    const url = faker.internet.url()

    const { sut, httpPostClientSpy } = makeSut(url)

    const authCredentials = {
      email: faker.internet.email(),
      password: faker.internet.password()
    }

    await sut.auth(authCredentials)

    expect(httpPostClientSpy.url).toBe(url)
  })

  test('Should return an AccountModel if HttpPostClient return 200', async () => {
    const { sut, httpPostClientSpy } = makeSut()

    const mockHttpResponse = {
      accessToken: faker.datatype.uuid(),
      name: faker.name.findName()
    }

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: mockHttpResponse
    }

    const authCredentials = {
      email: faker.internet.email(),
      password: faker.internet.password()
    }

    const account = await sut.auth(authCredentials)

    expect(account).toEqual(mockHttpResponse)
  })
})
