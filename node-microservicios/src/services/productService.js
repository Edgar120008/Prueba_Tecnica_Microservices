const productRepository = require('../repositories/productRepository');
const logger = require('../utils/logger');

class ProductService {
    async getAllProducts() {
        try {
            const products = await productRepository.findAll();
            return products.map(this.transformProduct);
        } catch (error) {
            logger.error('Error fetching products:', error);
            throw new Error('Failed to fetch products');
        }
    }

    async getProductById(id) {
        try {
            const product = await productRepository.findById(id);
            if (!product) {
                throw new Error('Product not found');
            }
            return this.transformProduct(product);
        } catch (error) {
            logger.error(`Error fetching product ${id}:`, error);
            throw error;
        }
    }

    async createProduct(productData) {
        try {
            const newProduct = await productRepository.create({
                name: productData.name,
                country: productData.countryCode
            });
            return this.transformProduct(newProduct);
        } catch (error) {
            logger.error('Error creating product:', error);
            throw new Error('Failed to create product');
        }
    }

    async updateProduct(id, productData) {
        try {
            const updatedProduct = await productRepository.update(id, {
                name: productData.name,
                country: productData.countryCode
            });
            return this.transformProduct(updatedProduct);
        } catch (error) {
            logger.error(`Error updating product ${id}:`, error);
            throw new Error('Failed to update product');
        }
    }

    async deleteProduct(id) {
        try {
            await productRepository.delete(id);
        } catch (error) {
            logger.error(`Error deleting product ${id}:`, error);
            throw new Error('Failed to delete product');
        }
    }

    async restoreProduct(id) {
        try {
            await productRepository.restore(id);
        } catch (error) {
            logger.error(`Error restoring product ${id}:`, error);
            throw new Error('Failed to restore product');
        }
    }

    transformProduct(product) {
        return {
            id: product.id,
            name: product.name,
            country: product.country,
            sku: product.sku,
            createdAt: product.created_at,
            updatedAt: product.updated_at
        };
    }
}

module.exports = new ProductService();