const { describe, expect, it } = require('@jest/globals')
const request = require('supertest')
const path = require('path')

const app = require('../../../../config/server')
const mongoHelper = require('../../../../src/repository-util/mongodb-setup')
const env = require('../../../../config/env')
const FIXTURE_PATH = '../../../fixtures/csv_files/'

const transactions = [
  {
    bankOrigin: 'BANCO DO BRASIL',
    agencyOrigin: '0001',
    accountOrigin: '00001-1',
    bankDestiny: 'BANCO BRADESCO',
    agencyDestiny: '0001',
    accountDestiny: '00001-1',
    amount: 8000,
    date: new Date('2022-01-01T16:30:00')
  }
]

describe('Create Transactions From CSV', () => {
  beforeAll(async () => {
    await mongoHelper.connect(env.mongoUrl)
  })
  beforeEach(async () => {
    const collection = await mongoHelper.getCollection('transaction')
    await collection.deleteMany({})
  })
  afterAll(async () => {
    await mongoHelper.disconnect()
  })
  it('ensure create transactions returns 200 if files ok', async () => {
    const csvFile = path.resolve(__dirname, FIXTURE_PATH, 'ok-file.csv')
    const response = await request(app).post('/history').attach('history', csvFile)
    expect(response.status).toBe(200)
  })
  it('ensure create transactions returns 400 if already exists transaction for the day', async () => {
    const collection = await mongoHelper.getCollection('transaction')
    await collection.insertOne(transactions[0])
    const csvFile = path.resolve(__dirname, FIXTURE_PATH, 'ok-file.csv')
    const response = await request(app).post('/history').attach('history', csvFile)
    expect(response.status).toBe(400)
  })

  it('ensure should return 400 if file is empty', async () => {
    const csvFile = path.resolve(__dirname, FIXTURE_PATH, 'empty.csv')
    const response = await request(app).post('/history').attach('history', csvFile)
    expect(response.status).toBe(400)
  })
})
