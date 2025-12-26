const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Brak tokena' });
    }

    try {
        const decoded = jwt.verify(token, 'sekretnyklucz');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Nieprawidłowy token' });
    }
};
