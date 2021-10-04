import { InvalidCredentialsError, UnexpectedError } from '@domain/errors'
import { mockAuthCredentials, mockAccountModel } from '@domain/test'
import { RemoteAuthentication } from './remote-authentication'
import { HttpStatusCode } from '@data/protocols/http'
import { HttpPostClientSpy } from '@data/test'
import faker from 'faker'

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

  test('Should return UnexpectedError if HttpPostClient return others errors', async () => {
    const { sut, httpPostClientSpy } = makeSut()

    const errors = [
      HttpStatusCode.badRequest,
      HttpStatusCode.notFound,
      HttpStatusCode.serverError
    ]

    httpPostClientSpy.response = {
      statusCode: faker.random.arrayElement(errors)
    }

    const sutPromise = sut.auth(mockAuthCredentials())

    await expect(sutPromise).rejects.toThrow(new UnexpectedError())
  })
})
