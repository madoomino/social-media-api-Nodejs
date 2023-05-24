const multer = require("multer");

// # creating the storing options object
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => cb(null, "./public/images"),
  filename: (req: any, file: any, cb: any) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// # creating the single image uploader middleware
export const imageUploader = multer({
  storage,
  fileFilter: function (req: any, file: any, cb: any) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|PNG|JPG|JPEG)$/)) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 3096,
  },
});
