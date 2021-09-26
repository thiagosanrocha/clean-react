import { RemoteAuthentication } from './remote-authentication'
import { HttpPostClient, HttpResponse, HttpStatusCode, HttpPostParams } from '@data/protocols/http'
import { InvalidCredentialsError } from '@domain/errors'
import { AuthCredentials } from '@domain/usecases'
import { AccountModel } from '@domain/models'
import faker from 'faker'

class HttpPostClientSpy implements HttpPostClient {
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

const mockAuthCredentials = (): AuthCredentials => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})

const mockAccountModel = (): AccountModel => ({
  accessToken: faker.datatype.uuid(),
  name: faker.name.findName()
})

describe('RemoteAuthentication', () => {
  test('Should call HttpPostClient with correct URL', async () => {
    const url = faker.internet.url()

    const { sut, httpPostClientSpy } = makeSut(url)

    const authCredentials = mockAuthCredentials()

    await sut.auth(authCredentials)

    expect(httpPostClientSpy.url).toBe(url)
  })

  test('Sould call HttpPostClient with correct payload', async () => {
    const { sut, httpPostClientSpy } = makeSut()

    const authCredentials = mockAuthCredentials()

    await sut.auth(authCredentials)

    expect(httpPostClientSpy.payload).toEqual(authCredentials)
  })

  test('Should return an AccountModel if HttpPostClient return 200', async () => {
    const { sut, httpPostClientSpy } = makeSut()

    const accountModel = mockAccountModel()

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.ok,
      body: accountModel
    }

    const authCredentials = mockAuthCredentials()

    const account = await sut.auth(authCredentials)

    expect(account).toEqual(accountModel)
  })

  test('Should return InvalidCredentialsError if HttpPostClient return 401', async () => {
    const { sut, httpPostClientSpy } = makeSut()

    httpPostClientSpy.response = {
      statusCode: HttpStatusCode.unauthorized
    }

    const sutPromise = sut.auth(mockAuthCredentials())

    await expect(sutPromise).rejects.toThrow(new InvalidCredentialsError())
  })
})
