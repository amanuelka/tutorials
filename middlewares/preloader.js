const { getById } = require('../services/courseService');

function preload() {
    return async function (req, res, next) {
        res.locals.course = await getById(req.params.id);
        next();
    };
}

module.exports = preload;