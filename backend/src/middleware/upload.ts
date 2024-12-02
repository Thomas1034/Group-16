import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import fs from 'fs';
import path from 'path';

type File = Express.Multer.File;
const maxFileSize = 1024 * 1024 * 8; // 8MB
const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
const uploadFolder = process.env.UPLOAD_FOLDER || 'uploads';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create the uploads folder if it doesn't exist
    fs.mkdirSync(uploadFolder, { recursive: true });

    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    // Generate a unique name for the file
    // Use the field name and current timestamp as the file name
    const ext = path.extname(file.originalname);
    const filename = `${file.fieldname}-${Date.now()}${ext}`;

    cb(null, filename);
  },
});

const fileFilter = (req: Request, file: File, cb: FileFilterCallback) => {
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
