import { BaseAPI } from './base.api';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export type CreateProductPayload = Omit<Product, 'id'>;
export type UpdateProductPayload = Partial<Product>;

export class ProductsAPI extends BaseAPI {
  async getAllProducts(): Promise<Product[]> {
    const products = await this.request<Product[]>('/products');
    
    // Validate response
    if (!Array.isArray(products)) {
      throw new Error('Expected products to be an array');
    }

    products.forEach(this.validateProduct);
    return products;
  }

  async getProduct(id: number): Promise<Product> {
    const product = await this.request<Product>(`/products/${id}`);
    this.validateProduct(product);
    return product;
  }

  async createProduct(data: CreateProductPayload): Promise<Product> {
    // Validate request payload
    this.validateProductPayload(data);

    const product = await this.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    // API returns stringified price, convert to number
    if (typeof product.price === 'string') {
      product.price = parseFloat(product.price);
    }

    this.validateProduct(product);
    return product;
  }

  async updateProduct(id: number, data: UpdateProductPayload): Promise<Product> {
    // Validate request payload
    if (Object.keys(data).length === 0) {
      throw new Error('Update payload cannot be empty');
    }

    const product = await this.request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });

    // API returns stringified price, convert to number
    if (typeof product.price === 'string') {
      product.price = parseFloat(product.price);
    }

    this.validateProduct(product);
    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    await this.request<void>(`/products/${id}`, { 
      method: 'DELETE' 
    });
  }

  private validateProduct(product: Product): void {
    // Check required fields
    const requiredFields: (keyof Product)[] = [
      'id', 'title', 'price', 'description', 'category', 'image'
    ];

    for (const field of requiredFields) {
      if (product[field] === undefined || product[field] === null) {
        throw new Error(`Product is missing required field: ${field}`);
      }
    }

    // Validate types
    if (typeof product.id !== 'number') {
      throw new Error('Product id must be a number');
    }
    if (typeof product.price !== 'number') {
      throw new Error('Product price must be a number');
    }
    if (typeof product.title !== 'string') {
      throw new Error('Product title must be a string');
    }
    if (typeof product.description !== 'string') {
      throw new Error('Product description must be a string');
    }
    if (typeof product.category !== 'string') {
      throw new Error('Product category must be a string');
    }
    if (typeof product.image !== 'string') {
      throw new Error('Product image must be a string');
    }
  }

  private validateProductPayload(data: CreateProductPayload): void {
    const requiredFields: (keyof CreateProductPayload)[] = [
      'title', 'price', 'description', 'category', 'image'
    ];

    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null) {
        throw new Error(`Product payload is missing required field: ${field}`);
      }
    }

    // Validate types
    if (typeof data.price !== 'number') {
      throw new Error('Product price must be a number');
    }
    if (typeof data.title !== 'string') {
      throw new Error('Product title must be a string');
    }
    if (typeof data.description !== 'string') {
      throw new Error('Product description must be a string');
    }
    if (typeof data.category !== 'string') {
      throw new Error('Product category must be a string');
    }
    if (typeof data.image !== 'string') {
      throw new Error('Product image must be a string');
    }
  }
}