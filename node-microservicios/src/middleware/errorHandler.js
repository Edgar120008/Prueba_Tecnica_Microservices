const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
    logger.error('Error:', err.message);

    const statusCode = err.statusCode || 500;
    let message = err.message;
    
    if (statusCode === 503 || statusCode === 504) {
        message = err.message;
    } else if (statusCode === 500 && !message.includes('Failed to')) {
        message = 'Internal Server Error';
    }

    const errorResponse = {
        success: false,
        error: message
    };

    if (err.data) {
        errorResponse.details = err.data;
    }

    res.status(statusCode).json(errorResponse);
}

module.exports = errorHandler;
