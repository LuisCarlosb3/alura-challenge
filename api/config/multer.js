const { join } = require('path')
const multer = require('multer')
const fs = require('fs')
const setupMulter = () => {
  const fileUploadFolder = join(__dirname, '../../uploads')
  if(!fs.existsSync(fileUploadFolder)){
    fs.mkdirSync(fileUploadFolder)
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, fileUploadFolder)
    },
    filename: function (req, file, cb) {
      const fileType = file.mimetype.split('/')[1]
      const uniqueSuffix = Date.now() + '.' + fileType
      cb(null, uniqueSuffix)
    }
  })
  const fileFilter = function (file, cb) {
    const filetypes = /csv/;
    const extname = filetypes.test(file.originalname);
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Only CSV file allowed!');
    }
  }

  const upload = multer({
    dest: fileUploadFolder,
    storage: storage,
    fileFilter: function (_req, file, cb) {
      fileFilter(file, cb);
    }
  })

  return upload
}

module.exports = { setupMulter }