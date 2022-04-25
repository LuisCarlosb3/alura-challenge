const { describe, expect, it, beforeAll, afterAll, beforeEach } = require('@jest/globals')

const transactionRepository = require('../../../src/modules/transactions/repository/transactionRepository')
const mongoHelper = require('../../../src/repository-util/mongodb-setup')
const env = require('../../../config/env')
const transactions = [
  {
    bankOrigin: 'BANCO DO BRASIL',
    agencyOrigin: '0001',
    accountOrigin: '00001-1',
    bankDestiny: 'BANCO BRADESCO',
    agencyDestiny: '0001',
    accountDestiny: '00001-1',
    amount: 8000,
    date: new Date('2022-01-01T07:30:00')
  },
  {
    bankOrigin: 'BANCO DO BRASIL',
    agencyOrigin: '0002',
    accountOrigin: '00002-2',
    bankDestiny: 'BANCO BRADESCO',
    agencyDestiny: '0002',
    accountDestiny: '00002-2',
    amount: 9000,
    date: new Date('2022-01-01T08:30:00')
  }
]
describe('Transaction Repository', () => {
  beforeAll(async () => {
    await mongoHelper.connect(env.mongoUrl)
  })
  beforeEach(async () => {
    const collection = await mongoHelper.getCollection(transactionRepository.collection)
    await collection.deleteMany({})
  })
  afterAll(async () => {
    await mongoHelper.disconnect()
  })
  it('ensure createTransactionsInBatchRepository create all transactions correctly', async () => {
    const ids = await transactionRepository.createTransactionsInBatch({ transactions })
    expect(ids).toBeTruthy()
    expect(Object.keys(ids).length).toEqual(2)
  })
  it('ensure checkIfTransactionExistsByDateRepository returns true if transaction exists', async () => {
    const collection = await mongoHelper.getCollection(transactionRepository.collection)
    await collection.insertOne(transactions[0])
    const exists = await transactionRepository.checkIfTransactionExistsByDate({ transactionDate: transactions[1].date })
    expect(exists).toBeTruthy()
  })
  it('ensure checkIfTransactionExistsByDateRepository returns true if transaction exists for same day', async () => {
    const collection = await mongoHelper.getCollection(transactionRepository.collection)
    await collection.insertOne(transactions[0])
    const exists = await transactionRepository.checkIfTransactionExistsByDate({ transactionDate: transactions[1].date })
    expect(exists).toBeTruthy()
  })
  it('ensure checkIfTransactionExistsByDateRepository returns false if transaction not exists for same day', async () => {
    const exists = await transactionRepository.checkIfTransactionExistsByDate({ transactionDate: transactions[1].date })
    expect(exists).toBeFalsy()
  })
})
