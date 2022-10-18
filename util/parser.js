function parseError(error) {
    // mongoose validation
    if (error.name == 'ValidationError') {
        return Object.values(error.errors).map(v => v.message);
    // express validation
    } else if (Array.isArray(error)) {
        return error.map(x => x.msg);
    // custom validation
    } else {
        return error.message.split('\n');
    }
};

module.exports = {
    parseError
};