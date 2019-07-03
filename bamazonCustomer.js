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
    displayInventory()

});

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
        customer();
    });
};


//Function allows customer to select an ID to buy
//customer can indicate how many they would like to buy
//if there is sufficient qty, customer buys and the qty subtracts
//if there is not enough qty, customer gets an insufficient stock message
function customer() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "idBuy",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < res.length; i++) {
                            choiceArray.push(res[i].product_name)
                        }
                        return choiceArray;
                    },
                    message: "Which item would you like to buy?"
                },
                {
                    name: "qtyBuy",
                    type: "input",
                    message: "How many would you like to buy?",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        console.log(chalk.yellow("\nPlease enter in a number."));
                        return false;
                    }
                }
            ]).then(function (input) {
                //Get data on chosen item based on user's input from idBuy
                var chosenItem;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].product_name === input.idBuy) {
                        chosenItem = res[i];
                    }
                }
                //   console.log(chosenItem);
                var availQty = chosenItem.stock_quantity;
                var chosenQty = input.qtyBuy;

                //determine if qtyBuy value is greater than available qty
                if (parseInt(chosenQty) > availQty) {
                    console.log(chalk.red("\nNot enough inventory.  Sorry.\n"));
                    shopAgain();

                } else {
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                              stock_quantity: availQty - parseInt(chosenQty)
                            },
                            {
                              id: chosenItem.id
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            console.log(chalk.green("\nSold!\n"));
                            shopAgain();
                        }
                    )
                }
            });
    });

    //function to shop again or quit the program
    function shopAgain() {
        inquirer.prompt([
            {
                name: "shop",
                type: "list",
                message: "Would you like to make another purchase?",
                choices: ["Yes.", "No, I am done."]
            }
        ]).then(function (input) {
            if (input.shop === "Yes.") {
                displayInventory();
            } else {
                connection.end();
            }
        })
    };
};