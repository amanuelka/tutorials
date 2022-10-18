const { getAllByDate } = require('../services/courseService');

const homeController = require('express').Router();

homeController.get('/', async (req, res) => {
    let view;
    let courses = [];

    if (req.user) {
        view = 'user-home';
        courses = await getAllByDate();
    } else {
        view = 'guest-home';
    }
    res.render(view, { courses });
});

module.exports = homeController;