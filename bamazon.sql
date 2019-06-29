DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(30),
  price DECIMAL(10, 2) NOT NULL,
  stock_quantity INTEGER (10) NOT NULL,
  PRIMARY KEY (id)
);

-- Add products to the table --

INSERT INTO products(product_name, department_name, price, stock_quantity)
