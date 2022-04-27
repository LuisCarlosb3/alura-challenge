const { describe, expect, it } = require('@jest/globals')
const createTransactionsFromCsv = require('../../../../src/modules/transactions/service/createTransactionsFromCsv.service')
const path = require('path')
const { copyFileSync, existsSync } = require('fs')
const FIXTURE_PATH = '../../../fixtures/csv_files/'
const UPLOAD_PATH = '../../../../../uploads/'
const makeSut = () => {
  const transactionRepository = {
    checkIfTransactionExistsByDate: jest.fn(),
    createTransactionsInBatch: jest.fn()
  }
  const service = createTransactionsFromCsv(transactionRepository)
  return { service, transactionRepository }
}
const validTransactions = [
  {
    bankOrigin: 'BANCO DO BRASIL',
    agencyOrigin: '0001',
    accountOrigin: '00001-1',
    bankDestiny: 'BANCO BRADESCO',
    agencyDestiny: '0001',
    accountDestiny: '00001-1',
    amount: 8000,
    date: new Date('2022-01-01T07:30:00')
  }
]
function resolveAndCopy (file) {
  const originalPath = path.resolve(__dirname, FIXTURE_PATH, file)
  const uploadPath = path.resolve(__dirname, UPLOAD_PATH, (Date.now()).toString())
  copyFileSync(originalPath, uploadPath)
  return uploadPath
}

describe('Create Transaction From CSV service', () => {
  it('ensure service only call repository with transactions for same date as first', async () => {
    const { service, transactionRepository } = makeSut()
    const uploadPath = resolveAndCopy('one-different-day.csv')
    await service({ filePath: uploadPath })
    expect(transactionRepository.createTransactionsInBatch).toHaveBeenCalledWith({ transactions: validTransactions })
  })
  it('ensure service only call repository with transactions with all fields', async () => {
    const { service, transactionRepository } = makeSut()
    const uploadPath = resolveAndCopy('invalid-field.csv')
    await service({ filePath: uploadPath })
    expect(transactionRepository.createTransactionsInBatch).toHaveBeenCalledWith({ transactions: validTransactions })
  })
  it('ensure service throws an error if file is empty', async () => {
    const { service } = makeSut()
    const uploadPath = resolveAndCopy('empty.csv')
    const promise = service({ filePath: uploadPath })
    await expect(promise).rejects.toThrow()
  })
  it('ensure service call checkIfTransactionExistsByDateRepository with first transaction date', async () => {
    const { service, transactionRepository } = makeSut()
    const uploadPath = resolveAndCopy('ok-file.csv')
    await service({ filePath: uploadPath })
    expect(transactionRepository.checkIfTransactionExistsByDate).toHaveBeenCalledWith({ transactionDate: validTransactions[0].date })
  })
  it('ensure service throws if checkIfTransactionExistsByDateRepository returns true', async () => {
    const { service, transactionRepository } = makeSut()
    const uploadPath = resolveAndCopy('ok-file.csv')
    transactionRepository.checkIfTransactionExistsByDate.mockReturnValueOnce(true)
    const promise = service({ filePath: uploadPath })
    await expect(promise).rejects.toThrow()
  })
  it('ensure service remove file after process', async () => {
    const { service } = makeSut()
    const uploadPath = resolveAndCopy('ok-file.csv')
    await service({ filePath: uploadPath })
    const fileStillInFolder = existsSync(uploadPath)
    expect(fileStillInFolder).toBeFalsy()
  })
})
