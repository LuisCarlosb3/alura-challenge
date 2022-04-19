const { MongoClient } = require('mongodb')

module.exports = {
    client: null,
    uri: null,
    async connect(uri) {
        this.uri = uri
        this.client = MongoClient.connect(uri, { useNewUrlParser: true })
    },
    async disconnect () {
        this.client.close()
        this.client = null
    },
    async getCollection (name) {
        if (!this.client?.isConnected()) { 
            await this.connect(this.uri) 
        }
        return this.client.db().collection(name)
    }
}