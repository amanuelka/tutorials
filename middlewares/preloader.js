const { getById, getByIdNoLean } = require("../services/courseService")

module.exports = (lean) => async (req, res, next) => {
    res.locals.course = lean
        ? await getById(req.params.id)
        : await getByIdNoLean(req.params.id);
    next();
}