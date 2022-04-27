const mongoDb = require('../../../repository-util/mongodb-setup')

module.exports = {
  collection: 'imports',
  async createImport ({ importData }) {
    const collection = await mongoDb.getCollection(this.collection)
    const response = await collection.insertOne(importData)
    return response.insertedId
  }
}
