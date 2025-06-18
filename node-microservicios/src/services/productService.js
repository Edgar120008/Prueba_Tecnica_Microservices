const productRepository = require('../repositories/productRepository');
const logger = require('../utils/logger');

class ProductService {
    async getAllProducts() {
        try {
            const products = await productRepository.findAll();
            return products.map(this.transformProduct);
        } catch (error) {
            logger.error('Error fetching products:', error.message);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const product = await productRepository.findById(id);
            if (!product) {
                const notFoundError = new Error('Product not found');
                notFoundError.statusCode = 404;
                throw notFoundError;
            }
            return this.transformProduct(product);
        } catch (error) {
            logger.error(`Error fetching product ${id}:`, error.message);
            throw error;
        }
    }

    async createProduct(productData) {
        try {
            if (!productData.name || !productData.countryCode) {
                const validationError = new Error('Name and countryCode are required');
                validationError.statusCode = 400;
                throw validationError;
            }

            const newProduct = await productRepository.create({
                name: productData.name,
                country: productData.countryCode
            });
            return this.transformProduct(newProduct);
        } catch (error) {
            logger.error('Error creating product:', error.message);
            throw error;
        }
    }

    async updateProduct(id, productData) {
        try {
            if (!productData.name || !productData.countryCode) {
                const validationError = new Error('Name and countryCode are required');
                validationError.statusCode = 400;
                throw validationError;
            }

            const updatedProduct = await productRepository.update(id, {
                name: productData.name,
                country: productData.countryCode
            });
            return this.transformProduct(updatedProduct);
        } catch (error) {
            logger.error(`Error updating product ${id}:`, error.message);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            await productRepository.delete(id);
            return { message: 'Producto eliminado con éxito' };
        } catch (error) {
            logger.error(`Error deleting product ${id}:`, error.message);
            throw error;
        }
    }

    async restoreProduct(id) {
        try {
            await productRepository.restore(id);
            return { message: 'Producto restaurado con éxito' };
        } catch (error) {
            logger.error(`Error restoring product ${id}:`, error.message);
            throw error;
        }
    }

    transformProduct(product) {
        if (!product) {
            return null;
        }

        return {
            id: product.id,
            name: product.name,
            countryCode: product.country,
            sku: product.sku,
            createdAt: product.created_at || product.createdAt,
            updatedAt: product.updated_at || product.updatedAt,
            deletedAt: product.deleted_at || product.deletedAt
        };
    }
}

module.exports = new ProductService();