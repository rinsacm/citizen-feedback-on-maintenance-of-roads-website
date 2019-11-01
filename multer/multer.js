let multer=require('multer');
let storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, 'public/images')
        },
        filename: function (req, file, cb) {
          cb(null, file.fieldname + '-' + Date.now())
        }
      });
      module.exports.storage=storage;

module.exports.upload = multer({ storage: storage })

// SET STORAGE

 


