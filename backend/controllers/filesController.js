const fs = require('fs');
const path = require('path');
// LISTA PLIKÓW i upload
exports.listFiles = (req, res) => {
    const uploadDir = path.join(process.cwd(), 'uploads');

    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            const error = new Error('Błąd odczytu folderu');
            error.status = 500;
            throw error;
        }

        const fileList = files.map(filename => ({
            name: filename,
            url: `/uploads/${filename}`
        }));

        res.json({ ok: true, files: fileList });
    });
};
// USUWANIE
exports.deleteFile = (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(process.cwd(), 'uploads', filename);

    if (!fs.existsSync(filePath)) {
        const error = new Error('Plik nie istnieje');
        error.status = 404;
        throw error;
    }

    fs.unlink(filePath, (err) => {
        if (err) {
            const error = new Error('Błąd podczas usuwania pliku');
            error.status = 500;
            throw error;
        }

        res.json({ ok: true, message: 'Plik usunięty' });
    });
};
// POBIERANIE
exports.downloadFile = (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(process.cwd(), 'uploads', filename);

    if (!fs.existsSync(filePath)) {
        const error = new Error('Plik nie istnieje');
        error.status = 404;
        throw error;
    }

    res.download(filePath, filename, (err) => {
        if (err) {
            const error = new Error('Błąd pobierania pliku');
            error.status = 500;
            throw error;
        }
    });
};
// ZMIANA NAZWY
exports.renameFile = (req, res) => {
    const oldFilename = req.params.filename;
    const newFilename = req.body.newName;
    const oldFilePath = path.join(process.cwd(), 'uploads', oldFilename);
    const newFilePath = path.join(process.cwd(), 'uploads', newFilename);
    //walidacja żeby nazwa była podana
    if (!newFilename) {
        const error = new Error('Nowa nazwa pliku jest wymagana');
        error.status = 400;
        throw error;
    }
    //walidacja żeby plik istniał
    if (!fs.existsSync(oldFilePath)) {
        const error = new Error('Plik nie istnieje');
        error.status = 404;
        throw error;
    }
    //walidacja żeby nazwa nie zawierała niedozwolonych znaków
    const invalidChars = /[<>:"\/\\|?*\x00-\x1F]/g;
    if (invalidChars.test(newFilename)) {
        const error = new Error('Nazwa pliku zawiera niedozwolone znaki');
        error.status = 400;
        throw error;
    }   

    fs.rename(oldFilePath, newFilePath, (err) => {
        if (err) {
            const error = new Error('Błąd podczas zmiany nazwy pliku');
            error.status = 500;
            throw error;
        }

        res.json({ ok: true, message: 'Plik przemieniony' });
    });
};