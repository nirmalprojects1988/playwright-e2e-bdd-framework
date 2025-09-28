import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ProductsAPI } from '@/api/products.api';
import { DataTable } from '@cucumber/cucumber';

const productsAPI = new ProductsAPI();
let products: any[];
let product: any;
let createProductData: any;

When('I request all products', async function() {
  products = await productsAPI.getAllProducts();
});

Then('I should receive a list of products', function() {
  expect(Array.isArray(products)).toBeTruthy();
  expect(products.length).toBeGreaterThan(0);
});

Then('each product should have required fields', function() {
  const requiredFields = ['id', 'title', 'price', 'description', 'category', 'image'];
  products.forEach(product => {
    requiredFields.forEach(field => {
      expect(product).toHaveProperty(field);
    });
  });
});

When('I request product with id {int}', async function(id: number) {
  product = await productsAPI.getProduct(id);
});

Then('I should receive the product details', function() {
  expect(product).toBeDefined();
});

Then('the product should have id {int}', function(id: number) {
  expect(product.id).toBe(id);
});

Given('I have product details to create:', function(dataTable: DataTable) {
  const [productData] = dataTable.hashes();
  createProductData = {
    ...productData,
    price: Number(productData.price)
  };
});

When('I create the product', async function() {
  product = await productsAPI.createProduct(createProductData);
});

Then('the product should be created successfully', function() {
  expect(product).toHaveProperty('id');
  Object.entries(createProductData).forEach(([key, value]) => {
    expect(product[key]).toEqual(value);
  });
});