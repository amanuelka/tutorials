const { getById, deleteById, update, enroll, create } = require('../services/courseService');
const { isOwner } = require('../middlewares/guards');
const preloader = require('../middlewares/preloader');
const { parseError } = require('../middlewares/parser');

const courseController = require('express').Router();

courseController.get('/create', (req, res) => {
    res.render('create');
});

courseController.post('/create', async (req, res) => {
    const data = { ...req.body, owner: req.user._id };

    try {
        if (Object.values(data).some(v => !v)) {
            throw new Error('All fields are required');
        }
        await create(data);
        res.redirect('/');
    } catch (err) {
        res.render('create', { errors: parseError(err), ...data });
    }

});

courseController.get('/:id', async (req, res) => {
    const course = await getById(req.params.id);

    course.isOwner = course.owner == req.user._id;
    course.enrolled = course.users.some(u => u._id == req.user._id);

    res.render('details', { ...course });
});

courseController.get('/:id/delete', preloader(), isOwner(), async (req, res) => {
    await deleteById(req.params.id);
    res.redirect('/');
});

courseController.get('/:id/edit', preloader(), isOwner(), async (req, res) => {
    const course = res.locals.course;
    res.render('edit', { ...course });
});

courseController.post('/:id/edit', preloader(), isOwner(), async (req, res) => {

    try {
        await update(req.params.id, { ...req.body, _id: req.params.id });
        res.redirect(`/course/${req.params.id}`);
    } catch (error) {
        res.render('edit', { errors: parseError(error), ...req.body });
    }
});

courseController.get('/:id/enroll', preloader(), async (req, res) => {
    const course = res.locals.course;
    if (course.owner != req.user._id && course.users.some(u => u._id == req.user._id) == false) {
        await enroll(req.params.id, req.user._id);
    }
    res.redirect(`/course/${req.params.id}`);
});

module.exports = courseController;