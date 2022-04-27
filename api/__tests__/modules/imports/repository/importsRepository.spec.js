const { describe, expect, it, beforeAll, afterAll, beforeEach } = require('@jest/globals')
const importsRepository = require('../../../../src/modules/imports/repository/importsRepository')
const mongoHelper = require('../../../../src/repository-util/mongodb-setup')
const env = require('../../../../config/env')

const makeImport = () => ({
  transactionsDate: '2022-01-01',
  createdAt: new Date()
})

describe('Transaction Repository', () => {
  beforeAll(async () => {
    await mongoHelper.connect(env.mongoUrl)
  })
  beforeEach(async () => {
    const collection = await mongoHelper.getCollection(importsRepository.collection)
    await collection.deleteMany({})
  })
  afterAll(async () => {
    await mongoHelper.disconnect()
  })
  it('ensure createImport create import correctly', async () => {
    const importData = makeImport()
    const id = await importsRepository.createImport({ importData })
    expect(id).toBeTruthy()
  })
})
