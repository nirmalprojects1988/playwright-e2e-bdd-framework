import { Before, Given, When, Then, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ProductsAPI, Product, CreateProductPayload } from '../../src/api/products.api';

// Use strong typing and initialize API instance for each scenario
const productsAPI = new ProductsAPI();
let products: Product[];
let product: Product;
let createProductData: CreateProductPayload;
let error: Error | null = null;

// Reset error state before each scenario
Before(function() {
  error = null;
});

When('I request all products', async function() {
  try {
    products = await productsAPI.getAllProducts();
  } catch (e) {
    error = e as Error;
    throw e;
  }
});

Then('I should receive a list of products', function() {
  expect(error).toBeNull();
  expect(Array.isArray(products)).toBeTruthy();
  expect(products.length).toBeGreaterThan(1);
});

Then('each product should have required fields', function() {
  expect(error).toBeNull();
  const requiredFields = ['id', 'title', 'price', 'description', 'category', 'image'];
  products.forEach(product => {
    requiredFields.forEach(field => {
      expect(product).toHaveProperty(field);
    });
    // Validate types
    expect(typeof product.id).toBe('number');
    expect(typeof product.title).toBe('string');
    expect(typeof product.price).toBe('number');
    expect(typeof product.description).toBe('string');
    expect(typeof product.category).toBe('string');
    expect(typeof product.image).toBe('string');
  });
});

When('I request product with id {int}', async function(id: number) {
  try {
    product = await productsAPI.getProduct(id);
  } catch (e) {
    error = e as Error;
    throw e;
  }
});

Then('I should receive the product details', function() {
  expect(error).toBeNull();
  expect(product).toBeDefined();
});

Then('the product should have id {int}', function(id: number) {
  expect(error).toBeNull();
  expect(product.id).toBe(id);
});

Given('I have product details to create:', function(dataTable: DataTable) {
  const [productData] = dataTable.hashes();
  createProductData = {
    title: String(productData.title),
    price: Number(productData.price),
    description: String(productData.description),
    category: String(productData.category),
    image: String(productData.image)
  };
  
  // Validate data types
  expect(typeof createProductData.title).toBe('string');
  expect(typeof createProductData.price).toBe('number');
  expect(typeof createProductData.description).toBe('string');
  expect(typeof createProductData.category).toBe('string');
  expect(typeof createProductData.image).toBe('string');
});

When('I create the product', async function() {
  try {
    product = await productsAPI.createProduct(createProductData);
  } catch (e) {
    error = e as Error;
    throw e;
  }
});

Then('the product should be created successfully', function() {
  expect(error).toBeNull();
  expect(product).toHaveProperty('id');
  expect(typeof product.id).toBe('number');
  
  // Verify each field matches the input
  expect(product.title).toBe(createProductData.title);
  expect(product.price).toBe(createProductData.price);
  expect(product.description).toBe(createProductData.description);
  expect(product.category).toBe(createProductData.category);
  expect(product.image).toBe(createProductData.image);
});
