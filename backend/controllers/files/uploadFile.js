const log = require('../../models/log');
const file = require('../../models/file');


const uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            const error = new Error("Brak pliku w żądaniu");
            error.status = 400;
            return next(error);
        }
        // walidacja żeby nazwa pliku nie była pusta
        if (req.file.originalname.trim() === '') {
            const error = new Error("Nazwa pliku nie może być pusta");
            error.status = 400;
            return next(error);
        }
        //walidacja żeby upload zawierał plik
        if (!req.file) {
            const error = new Error("Brak pliku w żądaniu");
            error.status = 400;
            return next(error)
        }

        // 🔥 Zapis logu
        await log.create({
            action: "UPLOAD",
            fileName: req.file.filename,
            date: new Date(),   
            email: req.user.email
        });

        await file.create({
            name: req.file.filename,
            url: `/uploads/${req.file.filename}`,
            size: req.file.size,
            uploadedBy: req.user.email,
            uploadedAt: new Date()
        });


        res.json({
            ok: true,
            message: "Plik zapisany",
            file: req.file
        });
    } catch (err) {
        next(err);
    }
};

module.exports = uploadFile;

