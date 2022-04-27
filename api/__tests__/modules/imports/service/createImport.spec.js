const { describe, expect, it } = require('@jest/globals')
const mockDate = require('mockdate')
const createImport = require('../../../../src/modules/imports/service/createImport.service')

const makeSut = () => {
  const importsRepository = {
    createImport: jest.fn()
  }
  const service = createImport(importsRepository)
  return { service, importsRepository }
}
const makeImport = () => ({
  transactionsDate: '2021-01-01',
  createdAt: new Date()
})
describe('Create Import service', () => {
  beforeAll(() => {
    mockDate.set(new Date())
  })
  afterAll(() => {
    mockDate.reset()
  })
  it('ensure service call repository with data object', async () => {
    const { service, importsRepository } = makeSut()
    const operationDate = new Date('1/1/2021')
    const importData = makeImport()
    await service({ importDate: operationDate })
    expect(importsRepository.createImport).toHaveBeenCalledWith({ importData })
  })
  it('ensure service throws if repository throws', async () => {
    const { service, importsRepository } = makeSut()
    const operationDate = new Date('1/1/2021')
    importsRepository.createImport.mockRejectedValueOnce(new Error())
    const promise = service({ importDate: operationDate })
    await expect(promise).rejects.toThrow()
  })
})
