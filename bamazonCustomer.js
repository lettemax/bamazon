var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  
});


function showProducts() {

    connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;  
    // loop through products (each record in response)  
    for (let record in res) {
        let product = res[record]
        // log each product's information
        console.log(
            "Product ID: ", product.item_id,
            "Product: ", product.product_name, 
            "Department: ", product.department_name,
            "Price: ", product.price
        );        
    }

  });
}

function inquirePrompt(){
    // Show all products
    showProducts();
    // Prompt user to tell us which item they'd like to purchase and how many
    inquirer.prompt([
        // Here we give the user the option to input an id
        {
            type: "input",
            message: "Please enter the id of the product you'd like to buy",
            name: "product_id",
        },
        // then an option to input how many they'd like to buy
        {
            type: "input",
            message: "How many would you like to purchase?",
            name: "quantity"
        }
    ]).then(function(response) {
        // Check database to see if we have enough of product in stock
        connection.query("SELECT stock_quantity, price FROM products WHERE item_id =" + response.product_id, function(err, res) {
            // handle error
            if (err) throw err;
            // if there is enough in stock
            if (res[0].stock_quantity >= response.quantity) {
                // decrease stock by purchased quantity (set to new quantity)
                var newQuantity = res[0].stock_quantity - response.quantity;
                // update database with new stock
                connection.query("UPDATE products SET ? WHERE ?",
                [ {stock_quantity: newQuantity},
                {item_id: response.product_id}]
                );
                // log the cost of purchase
                var cost = response.quantity * res[0].price;
                console.log("Cost of purchase: $" + cost);
                // log new stock quantity

            } else {
                console.log("Insufficient quantity!");
            }
        });
    });
}

inquirePrompt();

// function bidPrompt() {
//   showProducts()
//   inquirer.prompt([
//     {
//       name: "item_id",
//       message: "What is the id of the product you would like to order?",
//       choices: results.map(row=>row.product_name),
//       type: 'input'
//     },
//     {
//       name: "userQuantity",
//       message: "How many would you like?"
//     }
// ]).then(function(answers) {
//   // const dbItem = results.

//   connection.query("SELECT stock_quantity, price FROM products WHERE id =" + answers.userItem_id, function(err, res) {
//     if (err) throw err;

//     if (answers.userQuantity <= res[0].stock_quantity) {

//       var newQuantity = res[0].stock_quantity - answers.userQuantity;
//       var cost = answers.userQuantity * res[0].higest_bid;
//       console.log("new quantity: " + newQuantity);
      

//       connection.query(
//         "UPDATE products SET ? WHERE ?",
//         [ {stock_quantity: newQuantity},
//           {id: answers.userItem_id}],
//         function(err, res) {
//         if (err) throw err;
        
//         console.log("The cost of your order is $" + cost);
//         connection.end();
//       })
//     }
//     else {
//       console.log("Insufficient quantity");
//       console.log(res[0].stock_quantity);
//       connection.end();
//     }
//   })
// })
// }
// inquirePrompt()


// function post() {
//   console.log("Post an item");
//   getItem();
// }

// var getItem = function() {
  
//   // Prompt the user for an item
//   inquirer.prompt([
//     {
//       name: "product_name",
//       message: "What is the product name?"
//     },
//     {
//       name: "seller",
//       message: "What is your name?"
//     },
//     {
//       name: "stock_quantity",
//       message: "How many do you have to sell?"
//     }
//   ]).then(function(answers) {
//     connection.query("INSERT INTO products SET ?",
//     {
//       product_name: answers.product_name,
//       seller: answers.seller,
//       higest_bid: 0,
//       stock_quantity: answers.stock_quantity
//     },
//       function(err, res) {
//         if (err) throw (err)
//       console.log(res.affectedRows + " product inserted!\n");
//       showProducts()
//       connection.end();
//       }
//   )
// })
// }

// function bid() {

//     console.log("Bid on an item");

//     bidPrompt()
 
      
// }


