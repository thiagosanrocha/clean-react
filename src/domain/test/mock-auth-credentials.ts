import { AuthCredentials } from '../usecases'
import faker from 'faker'

export const mockAuthCredentials = (): AuthCredentials => ({
  email: faker.internet.email(),
  password: faker.internet.password()
})
