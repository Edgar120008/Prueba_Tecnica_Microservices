const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
    logger.error('Error:', err.message);

    const statusCode = err.statusCode || 500;
    const message = statusCode === 500 ? 'Internal Server Error' : err.message;

    res.status(statusCode).json({
        success: false,
        error: message
    });
}

module.exports = errorHandler;