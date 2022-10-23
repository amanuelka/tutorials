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

async function create(course) {
    return Course.create(course);
}

async function deleteById(id) {
    return Course.findByIdAndDelete(id);
}

async function update(id, data) {
    const existing = await Course.findById(id);
    Object.assign(existing, data);
    return existing.save();
}

async function enroll(courseId, userId) {
    const course = await Course.findById(courseId);
    course.users.push(userId);
    course.usersCount++;
    return course.save();
}

module.exports = { getAllByDate, getRecent, getById, create, deleteById, update, enroll };