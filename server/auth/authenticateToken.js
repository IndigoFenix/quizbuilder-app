const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).send({ 'message': 'No token!' });

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {

        if (err) {
            console.log(err);
            return res.status(403).send({ 'message': 'Invalid token!' });
        }

        req.currentUser = user;

        next();
    })
}