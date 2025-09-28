@api
Feature: Product API
  As an API client
  I want to manage products
  So that I can maintain the product catalog

  @smoke
  Scenario: Get all products
    When I request all products
    Then I should receive a list of products
    And each product should have required fields

  @regression
  Scenario: Get a single product
    When I request product with id 1
    Then I should receive the product details
    And the product should have id 1

  @regression
  Scenario: Create a new product
    Given I have product details to create:
      | title       | price | description    | category      | image            |
      | Test Product| 99.99 | Test Description | electronics | test-image.jpg |
    When I create the product
    Then the product should be created successfully