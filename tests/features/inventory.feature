@ui
Feature: Product Inventory
  As a standard user
  I want to browse products
  So that I can add items to my cart

  Background:
    Given I am on the inventory page

  @smoke
  Scenario: View product inventory
    Then I should see product items
    And the inventory should show correct item count

  @regression
  Scenario: Add product to cart
    When I add "Sauce Labs Backpack" to cart
    Then the cart badge should show "1"
    And the item should be added to my cart