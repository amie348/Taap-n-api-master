const multer = require('fastify-multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public');
  },
  filename: (req, file, cb) => {
    const type = file.mimetype.split('/')[0];
    const ext = file.mimetype.split('/')[1];
    req.file.filename = `${type}-${Date.now()}.${ext}`;
    cb(null, req.file.filename);
  },
});

let upload = multer({ storage });
module.exports.uploadPicture = upload.single('content');
