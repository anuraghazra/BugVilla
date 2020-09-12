const multer = require('multer');

module.exports = function (err, req, res, next) {
  console.error(err);
  if (err instanceof SyntaxError) {
    res.internalError({ error: "Something isn't right" });
  } else if (err instanceof multer.MulterError) {
    // fileUpload
    console.log(err.field);
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        res.payloadTooLarge({ error: 'File size is too large' });
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        res.unsupportedMedia({
          error: 'Invalid File format. must be PNG,JPG,JPEG',
        });
        break;
      default:
        res.internalError({
          error: 'Something went wrong while uploading file',
        });
        break;
    }
  } else next();
};
