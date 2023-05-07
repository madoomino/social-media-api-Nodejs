const multer = require("multer");

// # creating the storing options object
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./public/images"),
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

// # creating the single image uploader middleware
exports.imageUploader = multer({
    storage,
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|PNG|JPG|JPEG)$/)) {
          return cb(new Error('Only image files are allowed!'));
        }
        cb(null, true);
      },
      limits: {
        fileSize: 1024 * 3096,
      },
});