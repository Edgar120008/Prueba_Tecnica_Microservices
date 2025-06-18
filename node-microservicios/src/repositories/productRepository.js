const axios = require('axios');
const logger = require('../utils/logger');

const LARAVEL_API_URL = process.env.LARAVEL_API_URL || 'http://localhost:8000/api';

class ProductRepository {
    async findAll() {
        try {
            const response = await axios.get(`${LARAVEL_API_URL}/products`);
            return response.data;
        } catch (error) {
            logger.error('Error fetching products:', error.message);
            throw error;
        }
    }

    async findById(id) {
        try {
            const response = await axios.get(`${LARAVEL_API_URL}/products/${id}`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return null;
            }
            logger.error(`Error fetching product ${id}:`, error.message);
            throw error;
        }
    }

    async create(productData) {
        try {
            const response = await axios.post(`${LARAVEL_API_URL}/products`, productData);
            return response.data;
        } catch (error) {
            logger.error('Error creating product:', error.message);
            throw error;
        }
    }

    async update(id, productData) {
        try {
            const response = await axios.put(`${LARAVEL_API_URL}/products/${id}`, productData);
            return response.data;
        } catch (error) {
            logger.error(`Error updating product ${id}:`, error.message);
            throw error;
        }
    }

    async delete(id) {
        try {
            await axios.delete(`${LARAVEL_API_URL}/products/${id}`);
        } catch (error) {
            logger.error(`Error deleting product ${id}:`, error.message);
            throw error;
        }
    }

    async restore(id) {
        try {
            await axios.patch(`${LARAVEL_API_URL}/products/${id}/restore`);
        } catch (error) {
            logger.error(`Error restoring product ${id}:`, error.message);
            throw error;
        }
    }
}

module.exports = new ProductRepository();