const { promises, createReadStream } = require('fs')
const { parse } = require('csv-parse')
module.exports = function createTransactionsFromCsv() {
  async function loadRegisters(file) {
    return new Promise((resolve, reject) => {
      const registros = []
      const stream = createReadStream(file);
      const parseFile = parse()
      stream.pipe(parseFile)
      parseFile.on('data', line => {
        console.log(line)
      }).on("end", () => {
        promises.unlink(file);
        resolve(registros);
      })
        .on("error", (err) => {
          reject(err);
        });
    })
  }
  return handle = async (request, response) => {
    const file = request.file.path
    await loadRegisters(file)
    response.json({ message: 'your file was received' })
  }
}