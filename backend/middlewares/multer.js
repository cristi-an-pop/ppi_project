const multer = require('multer');
const path = require('path');

const multerError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
          message: 'File upload error',
          error: err.message
        });
      }
      next(err);
};

module.exports = multerError;