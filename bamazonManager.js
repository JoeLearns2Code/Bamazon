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
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit Application"]

        }
    ]).then(function (input) {
        switch (input.manage) {
            case "View Products for Sale":
                displayInventory();
                break;

            case "View Low Inventory":
                // console.log("Low Inventory function");
                lowInventory();
                break;
            
            case "Add to Inventory":
                console.log("Add to Inventory function");
                break;

            case "Add New Product":
                console.log("Add New Product function");
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
function lowInventory(){
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
