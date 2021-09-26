import { Authentication, AuthCredentials } from '@domain/usecases'
import { HttpPostClient, HttpStatusCode } from '@data/protocols/http'
import { AccountModel } from '@domain/models'
import { InvalidCredentialsError } from '@domain/errors'

export class RemoteAuthentication implements Authentication {
  constructor (
    private readonly url: string,
    private readonly httpPostClient: HttpPostClient
  ) {}

  async auth (credentials: AuthCredentials): Promise<AccountModel> {
    const httpResponse = await this.httpPostClient.post<AccountModel>({
      url: this.url,
      payload: credentials
    })

    switch (httpResponse.statusCode) {
      case HttpStatusCode.ok: return httpResponse.body
      case HttpStatusCode.unauthorized: throw new InvalidCredentialsError()
      default: throw new Error()
    }
  }
}
