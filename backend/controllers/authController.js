const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
    const { email, password } = req.body;

    // Na razie na sztywno
    if (email === 'admin@admin.pl' && password === 'adminadmin123') {
        const token = jwt.sign({ email }, 'sekretnyklucz', { expiresIn: '1h' });
        return res.json({
            ok: true,
            message: 'Zalogowano pomyślnie!',
            token
        });
    }

    res.status(401).json({ error: 'Złe dane logowania' });
};
