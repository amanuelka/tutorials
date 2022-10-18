const { body, validationResult } = require('express-validator');
const { register, login } = require('../services/userService');
const { parseError } = require('../util/parser');

const authController = require('express').Router();

authController.get('/register', (req, res) => {
    res.render('register');
});

authController.post('/register',
    body('username')
        .isLength({ min: 5 }).withMessage('Username must be at least 5 characters long')
        .isAlphanumeric().withMessage('Username may contain only letters and numbers'),
    body('password')
        .isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
        .isAlphanumeric().withMessage('Password may contain only letters and numbers'),
    async (req, res) => {
        try {
            const { errors } = validationResult(req);
            if (errors.length > 0) {
                throw errors;
            }
            if (req.body.password != req.body.repass) {
                throw new Error('Passwords don\'t match');
            }
            const token = await register(req.body.username, req.body.password);

            res.cookie('token', token);
            res.redirect('/');
        }
        catch (error) {
            const errors = parseError(error);
            res.render('register', {
                errors,
                body: {
                    username: req.body.username
                }
            });
        }
    });

authController.get('/login', (req, res) => {
    res.render('login');
});

authController.post('/login', async (req, res) => {
    try {
        if (req.body.username == '' || req.body.password == '') {
            throw new Error('All fields are required');
        }
        const token = await login(req.body.username, req.body.password);
        res.cookie('token', token);
        res.redirect('/');
    }
    catch (error) {
        const errors = parseError(error);
        // TODO: Add error display to actual template from assignment
        res.render('login', {
            title: 'Login page',
            errors,
            body: {
                username: req.body.username
            }
        });
    }
});

authController.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
})

module.exports = authController;