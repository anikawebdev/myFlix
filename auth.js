const jwtSecret = 'your_jwt_secret';
const jwt = require('jsonwebtoken');
const passport = require('passport');

require('./passport');

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username,
        expiresIn: '7d',
        algorithm: 'HS256'
    });
}

// Login
module.exports = (router) => {
    router.post('/login', (request, response) => {
        passport.authenticate(
            'local', 
            { session: false }, 
            (error, user, info) => {
                if (error || !user) {
                    return response.status(400).json({
                        message: 'Something is not right',
                        user: user
                    });
                }
                request.login(user, { session: false }, (error) => {
                    if (error) {
                        response.send(error);
                    }
                    let token = generateJWTToken(user.toJSON());
                    return response.json({ user, token });
                });
            })(request, response);
    });
}