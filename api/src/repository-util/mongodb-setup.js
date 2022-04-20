const { MongoClient } = require('mongodb')

module.exports = {
  client: null,
  uri: null,
  async connect (uri) {
    this.uri = uri
    this.client = new MongoClient(uri, { useNewUrlParser: true })
    await this.client.connect()
  },
  async disconnect () {
    this.client.close()
    this.client = null
  },
  async getCollection (name) {
    return this.client.db().collection(name)
  }
}
