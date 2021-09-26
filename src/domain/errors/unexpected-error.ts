export class UnexpectedError extends Error {
  constructor () {
    super('Algo de errado aconteceu, tente novamente!')
    this.name = 'UnexpectedError'
  }
}
