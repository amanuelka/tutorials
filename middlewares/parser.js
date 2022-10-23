function parseError(error) {
    if (error.name == 'ValidationError') {
        // mongoose validation
        return Object.values(error.errors).map(v => v.message);
    } else if (Array.isArray(error)) {
        // express validation
        return error.map(x => x.msg);
    } else {
        // custom validation
        return error.message.split('\n');
    }
};

module.exports = { parseError };