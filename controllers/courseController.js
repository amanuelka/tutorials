const { createCourse, getById, deleteById, updateById, enrollUser, update, enroll } = require('../services/courseService');
const { isOwner } = require('../middlewares/guards');
const preloader = require('../middlewares/preloader');
const { parseError } = require('../util/parser');

const courseController = require('express').Router();

courseController.get('/create', (req, res) => {
    res.render('create');
});

courseController.post('/create', async (req, res) => {
    const course = {
        title: req.body.title,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        duration: req.body.duration,
        owner: req.user._id
    };
    try {
        await createCourse(course);
        res.redirect('/');
    } catch (error) {
        res.render('create', {
            errors: parseError(error),
            body: course
        });
    }
});

courseController.get('/:id', preloader(true), async (req, res) => {
    const course = res.locals.course;

    course.isOwner = course.owner.toString() == req.user._id.toString();
    course.enrolled = course.users.map(x => x.toString()).includes(req.user._id.toString());

    res.render('details', { course });
});

// courseController.get('/:id', async (req, res) => {
//     const course = await getById(req.params.id);

//     course.isOwner = course.owner.toString() == req.user._id.toString();
//     course.enrolled = course.users.map(x => x.toString()).includes(req.user._id.toString());

//     res.render('details', { course });
// });


// courseController.get('/:id/delete', async (req, res) => {
//     const course = await getById(req.params.id);

//     if (course.owner.toString() != req.user._id.toString()) {
//         return res.redirect('/auth/login');
//     }
//     await deleteById(req.params.id);
//     res.redirect('/');
// });

courseController.get('/:id/delete', preloader(), isOwner(), async (req, res) => {
    await deleteById(req.params.id);
    res.redirect('/');
});

// courseController.get('/:id/delete', async (req, res) => {
//     const course =  res.locals.course;

//     if (course.owner.toString() != req.user._id.toString()) {
//         return res.redirect('/auth/login');
//     }
//     await deleteById(req.params.id);
//     res.redirect('/');
// });

courseController.get('/:id/edit', preloader(true), isOwner(), async (req, res) => {
    const course = res.locals.course;
    res.render('edit', { course });
});

// courseController.get('/:id/edit', async (req, res) => {
//     const course = await getById(req.params.id);
//     if (course.owner.toString() != req.user._id.toString()) {
//         return res.redirect('/auth/login');
//     }
//     res.render('edit', { course });
// });

courseController.post('/:id/edit', preloader(), isOwner(), async (req, res) => {
    const course = res.locals.course;

    try {
        await update(course, req.body);
        res.redirect(`/course/${req.params.id}`);
    } catch (error) {
        res.render('edit', { errors: parseError(error), course: req.body });
    }
});


// courseController.post('/:id/edit', async (req, res) => {
//     const course = await getById(req.params.id);
//     if (course.owner.toString() != req.user._id.toString()) {
//         return res.redirect('/auth/login');
//     }
//     try {
//         await updateById(req.params.id, req.body);
//         res.redirect(`/course/${req.params.id}`);
//     } catch (error) {
//         res.render('edit', { errors: parseError(error), course: req.body });
//     }
// });

courseController.get('/:id/enroll', preloader(), async (req, res) => {
    const course = res.locals.course;
    if (course.owner.toString() != req.user._id.toString() &&
        course.users.map(u => u.toString()).includes(req.user._id.toString()) == false) {
        await enroll(course, req.user._id);
    }
    res.redirect(`/course/${req.params.id}`);
});

// courseController.get('/:id/enroll', async (req, res) => {
//     const course = await getById(req.params.id);
//     if (course.owner.toString() != req.user._id.toString() &&
//         course.users.map(u => u.toString()).includes(req.user._id.toString()) == false) {
//         await enrollUser(req.params.id, req.user._id);
//     }
//     res.redirect(`/course/${req.params.id}`);
// });

module.exports = courseController;