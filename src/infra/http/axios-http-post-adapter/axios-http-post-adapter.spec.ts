import { AxiosHttpPostAdapter } from './axios-http-post-adapter'
import { HttpPostParams, HttpStatusCode } from '@data/protocols/http'
import axios from 'axios'
import faker from 'faker'

jest.mock('axios')

const mockAxios = axios as jest.Mocked<typeof axios>

const mockAxiosReturn = {
  data: faker.random.objectElement(),
  status: HttpStatusCode.ok
}

mockAxios.post.mockResolvedValue(mockAxiosReturn)

type SutTypes = {
  sut: AxiosHttpPostAdapter
}

const makeSut = (): SutTypes => {
  const sut = new AxiosHttpPostAdapter()

  return { sut }
}

const mockPostParams: HttpPostParams = {
  url: faker.internet.url(),
  payload: faker.random.objectElement()
}

describe('AxiosHttpPostAdapter', () => {
  test('Should call axios with correct URL, http verb and payload', async () => {
    const { sut } = makeSut()

    await sut.post(mockPostParams)

    expect(mockAxios.post).toHaveBeenCalledWith(
      mockPostParams.url,
      mockPostParams.payload
    )
  })

  test('Should return HttpResponse', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.post(mockPostParams)

    expect(httpResponse).toEqual({
      statusCode: mockAxiosReturn.status,
      body: mockAxiosReturn.data
    })
  })
})
