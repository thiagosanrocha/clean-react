import { HttpPostParams } from '@data/protocols/http'
import faker from 'faker'

export const mockHttpPostParams: HttpPostParams = {
  url: faker.internet.url(),
  payload: faker.random.objectElement()
}
