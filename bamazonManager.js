//enable mysql, inquirer, cli-table, chalk
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
const chalk = require("chalk");


// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "bamazon"
});

//connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    //call main functions
    manager()

});

//Function for manager inquire main menu
function manager() {
    inquirer.prompt([
        {
            name: "manage",
            type: "list",
            message: "\nWhat would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit Application"]

        }
    ]).then(function (input) {
        switch (input.manage) {
            case "View Products for Sale":
                displayInventory();
                break;

            case "View Low Inventory":
                lowInventory();
                break;

            case "Add to Inventory":
                addInventory();
                break;

            case "Add New Product":
                console.log("Add New Product function");
                addProduct()
                break;

            case "Quit Application":
                connection.end();
        }
    })
};

//Display the complete bamazon inventory in a table in the console with cli-table package
function displayInventory() {

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var table = new Table({
            head: [chalk.blue("ID#"), chalk.blue("Product Name"), chalk.blue("Department"), chalk.blue("Price"), chalk.blue("Available Qty")],
            colWidths: [5, 50, 15, 10, 20]
        });
        for (var i = 0; i < res.length; i++) {
            var tableID = res[i].id;
            var tableProd = res[i].product_name;
            var tableDept = res[i].department_name;
            var tablePrice = res[i].price;
            var tableQty = res[i].stock_quantity
            table.push(
                [tableID, tableProd, tableDept, tablePrice, tableQty]
            );
        }
        console.log(table.toString());
        manager();
    });
};


//Function to display low inventory products
function lowInventory() {
    connection.query("SELECT * FROM products WHERE products.stock_quantity < 5", function (err, res) {
        if (err) throw err;
        var table = new Table({
            head: [chalk.blue("ID#"), chalk.blue("Product Name"), chalk.blue("Department"), chalk.blue("Price"), chalk.blue("Available Qty")],
            colWidths: [5, 50, 15, 10, 20]
        });
        for (var i = 0; i < res.length; i++) {
            var tableID = res[i].id;
            var tableProd = res[i].product_name;
            var tableDept = res[i].department_name;
            var tablePrice = res[i].price;
            var tableQty = res[i].stock_quantity
            table.push(
                [tableID, tableProd, tableDept, tablePrice, tableQty]
            );
        }
        console.log(table.toString());
        manager();
    });
};


//Function to add products to inventory
function addInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "product",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < res.length; i++) {
                            choiceArray.push(res[i].product_name)
                        }
                        return choiceArray;
                    },
                    message: "Which item would you like to restock?"
                },
                {
                    name: "qtyAdd",
                    type: "input",
                    message: "Enter the quantity to be restocked:",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        console.log(chalk.yellow("\nPlease enter in a number."));
                        return false;
                    }
                }
            ]).then(function (input) {
                var chosenItem;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].product_name === input.product) {
                        chosenItem = res[i];
                    }
                }

                var availQty = chosenItem.stock_quantity;
                var restockQty = parseInt(input.qtyAdd);
                //add quantity to stock_quantity in products database
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: availQty + restockQty,
                        },
                        {
                            id: chosenItem.id
                        }
                    ],
                    function (error) {
                        if (error) throw err;
                        console.log(chalk.green("\nProducts restocked.\n"));
                        manager();
                    }

                )
            })
    })
};


//Function to add new products to bamazon
//inquirer query to get product_name, department_name, price, stock_quantity
function addProduct() {
   inquirer
    .prompt([
      {
        name: "prodname",
        type: "input",
        message: "What is the name of the product?"
      },
      {
        name: "proddepartment",
        type: "input",
        message: "Which department does this product go under?"
      },
      {
        name: "prodprice",
        type: "input",
        message: "What is the price of the product?",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            console.log(chalk.yellow("\nPlease enter in a number."));
            return false;
        }
      },
      {
        name: "prodqty",
        type: "input",
        message: "How many units do you want to add?",
        validate: function (value) {
            if (isNaN(value) === false) {
                return true;
            }
            console.log(chalk.yellow("\nPlease enter in a number."));
            return false;
        }
      }
    ]).then(function(input) {
    //after prompt questions are answered, insert new data into products database
    connection.query(
      "INSERT INTO products SET ?",
      {
        product_name: input.prodname,
        department_name: input.proddepartment,
        price: input.prodprice,
        stock_quantity: input.prodqty
      },
      function(err) {
          if (err) throw err;
          console.log(chalk.green("\nYour product has been added to Bamazon!"));
          //display new product in inventory
          displayInventory();
      }
    )
    })
};