import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

type File = Express.Multer.File;
const maxFileSize = 1024 * 1024 * 8; // 8MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const fileFilter = (req: Request, file: File, cb: FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Incorrect file type');
      return cb(error);
    } 
    
    return cb(null, true);
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: maxFileSize,
    },
});

export default upload;
