import { AxiosHttpPostAdapter } from './axios-http-post-adapter'
import { mockHttpPostParams } from '@data/test'
import { mockAxios } from '@infra/test'

jest.mock('axios')

type SutTypes = {
  sut: AxiosHttpPostAdapter
  mockedAxios: ReturnType<typeof mockAxios>
}

const makeSut = (): SutTypes => {
  const sut = new AxiosHttpPostAdapter()
  const mockedAxios = mockAxios()

  return {
    sut,
    mockedAxios
  }
}

describe('AxiosHttpPostAdapter', () => {
  test('Should call axios with correct URL, http verb and payload', async () => {
    const { sut, mockedAxios } = makeSut()

    await sut.post(mockHttpPostParams)

    expect(mockedAxios.post).toHaveBeenCalledWith(
      mockHttpPostParams.url,
      mockHttpPostParams.payload
    )
  })

  test('Should return HttpResponse', () => {
    const { sut, mockedAxios } = makeSut()

    const httpPromiseResponse = sut.post(mockHttpPostParams)

    expect(httpPromiseResponse).toEqual(mockedAxios.post.mock.results[0].value)
  })
})
