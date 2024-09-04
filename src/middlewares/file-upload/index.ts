import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null,path.resolve('./uploads'));

    },
    filename: function (req, file, cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const uploadFile = multer({storage,limits:{fieldSize: 8 * 1024 * 1024}});

export {uploadFile};