const axios = require('axios');
const logger = require('../utils/logger');

const LARAVEL_API_URL = process.env.LARAVEL_API_URL || 'http://localhost:8000/api';
const REQUEST_TIMEOUT = 5000;
const HEALTH_CHECK_TIMEOUT = 3000;

class ProductRepository {
    /**
     * @private
     */
    async #checkLaravelService() {
        try {
            await axios.get(`${LARAVEL_API_URL}/health-check`, { 
                timeout: HEALTH_CHECK_TIMEOUT 
            });
            return true;
        } catch (error) {
            logger.error('Laravel service is not available:', error.message);
            return false;
        }
    }

    /**
     * @private
     * @throws {Object}
     */
    async #handleLaravelUnavailable() {
        const serviceAvailable = await this.#checkLaravelService();
        if (!serviceAvailable) {
            throw {
                statusCode: 503,
                message: 'El microservicio de Laravel no está disponible. Por favor, verifique que esté encendido.',
                serviceUnavailable: true,
                details: {
                    service: 'Laravel',
                    status: 'unavailable',
                    timestamp: new Date().toISOString()
                }
            };
        }
    }

    /**
     * @private
     * @param {Error} error
     * @param {string} operation
     * @throws {Object}
     */
    #handleRequestError(error, operation) {
        if (error.serviceUnavailable) throw error;

        if (error.response) {
            const { status, data } = error.response;
            throw { 
                statusCode: status, 
                message: data.message || data.error || `Error en ${operation}`,
                data: data,
                details: {
                    service: 'Laravel',
                    status: 'responding_with_error',
                    error_code: status
                }
            };
        } else if (error.code === 'ECONNABORTED') {
            throw { 
                statusCode: 504, 
                message: `Tiempo de espera agotado al ${operation}`,
                details: {
                    service: 'Laravel',
                    status: 'timeout',
                    timeout_ms: REQUEST_TIMEOUT
                }
            };
        } else if (error.code === 'ECONNREFUSED') {
            throw { 
                statusCode: 503, 
                message: 'No se puede conectar al microservicio de Laravel',
                details: {
                    service: 'Laravel',
                    status: 'connection_refused',
                    timestamp: new Date().toISOString()
                }
            };
        } else {
            throw { 
                statusCode: 503, 
                message: `Error de conexión al ${operation}`,
                details: {
                    service: 'Laravel',
                    status: 'connection_error',
                    error_code: error.code || 'UNKNOWN',
                    timestamp: new Date().toISOString()
                }
            };
        }
    }

    async findAll() {
        try {
            await this.#handleLaravelUnavailable();
            const response = await axios.get(`${LARAVEL_API_URL}/products`, { 
                timeout: REQUEST_TIMEOUT 
            });
            return response.data;
        } catch (error) {
            this.#handleRequestError(error, 'obtener los productos');
        }
    }

    async findById(id) {
        try {
            await this.#handleLaravelUnavailable();
            const response = await axios.get(`${LARAVEL_API_URL}/products/${id}`, { 
                timeout: REQUEST_TIMEOUT 
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return null;
            }
            this.#handleRequestError(error, `obtener el producto con ID ${id}`);
        }
    }

    async create(productData) {
        try {
            await this.#handleLaravelUnavailable();
            const response = await axios.post(`${LARAVEL_API_URL}/products`, productData, { 
                timeout: REQUEST_TIMEOUT 
            });
            return response.data;
        } catch (error) {
            this.#handleRequestError(error, 'crear el producto');
        }
    }

    async update(id, productData) {
        try {
            await this.#handleLaravelUnavailable();
            const response = await axios.put(`${LARAVEL_API_URL}/products/${id}`, productData, { 
                timeout: REQUEST_TIMEOUT 
            });
            return response.data;
        } catch (error) {
            this.#handleRequestError(error, `actualizar el producto con ID ${id}`);
        }
    }

    async delete(id) {
        try {
            await this.#handleLaravelUnavailable();
            const response = await axios.delete(`${LARAVEL_API_URL}/products/${id}`, { 
                timeout: REQUEST_TIMEOUT 
            });
            return response.data;
        } catch (error) {
            this.#handleRequestError(error, `eliminar el producto con ID ${id}`);
        }
    }

    async restore(id) {
        try {
            await this.#handleLaravelUnavailable();
            const response = await axios.patch(`${LARAVEL_API_URL}/products/${id}/restore`, { 
                timeout: REQUEST_TIMEOUT 
            });
            return response.data;
        } catch (error) {
            this.#handleRequestError(error, `restaurar el producto con ID ${id}`);
        }
    }
}

module.exports = new ProductRepository();