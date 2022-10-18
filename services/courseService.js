const Course = require('../models/Course');


async function getAllByDate(search) {
    const query = {};
    if (search) {
        query.title = new RegExp(search, 'i');
    }
    return Course.find(query).sort({ createdAt: 1 }).lean();
}


async function getRecent() {
    return Course.find({}).sort({ usersCount: -1 }).limit(3).lean();
}

async function getById(id) {
    return Course.findById(id).lean();
}

async function getByIdNoLean(id) {
    return Course.findById(id);
}

async function createCourse(course) {
    return Course.create(course);
}

async function deleteById(id) {
    return Course.findByIdAndDelete(id);
}

async function updateById(id, data) {
    const existing = await Course.findById(id);
    existing.title = data.title;
    existing.description = data.description;
    existing.imageUrl = data.imageUrl;
    existing.duration = data.duration;
    return existing.save();
}

async function update(course, data) {
    course.title = data.title;
    course.description = data.description;
    course.imageUrl = data.imageUrl;
    course.duration = data.duration;
    return course.save();
}

async function enrollUser(courseId, userId) {
    const course = await Course.findById(courseId);
    course.users.push(userId);
    course.usersCount++;
    return course.save();
}

async function enroll(course, userId) {
    course.users.push(userId);
    course.usersCount++;
    return course.save();
}

module.exports = {
    getAllByDate,
    getRecent,
    getById,
    getByIdNoLean,
    createCourse,
    deleteById,
    updateById,
    update,
    enrollUser,
    enroll
}