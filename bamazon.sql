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
VALUES ("Dress Shoes", "Clothing", 119.99, 30),
	     ("5-Light Chandelier", "Lighting", 1000.00, 5),
       ("Diamond Ring", "Jewelry", 8999.99, 1),
       ("Pokemon Trading Card Pack", "Games", 2.99, 500),
       ("Final Fantasy VII Remake PS4", "Games", 59.99, 5000),
       ("Esoteric Unknowable Icon of Nyarlethotep", "", 00.01, 47),
       ("Carrots", "Vegetables", 0.99, 30),
	     ("Fancy Shirt", "Clothing", 35.00, 12),
       ("Cheap Imported Floor Lamp", "Lighting", 29.99, 3),
       ("Batman Suit", "Clothing", 123.45, 10);

--Query table for data --

SELECT * FROM products