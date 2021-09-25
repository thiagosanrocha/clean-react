import { Authentication, AuthCredentials } from '@domain/usecases/authentication'
import { AccountModel } from '@domain/models'

export class RemoteAuthentication implements Authentication {
  async auth (credentials: AuthCredentials): Promise<AccountModel> {
    return await Promise.resolve({
      accessToken: 'any_token',
      name: 'any_name'
    })
  }
}
