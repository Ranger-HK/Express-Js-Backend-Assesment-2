const express = require("express");
const router = express.Router();
const db = require("../configs/db.config");

const mysql = require("mysql");
const connection = mysql.createConnection(db.database);

connection.connect(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log("connected to the mysql server");
    var customerTbl =
      "CREATE TABLE IF NOT EXISTS order_details(order_id VARCHAR(255) PRIMARY KEY, item_id VARCHAR(255), qty INT)";
    connection.query(customerTbl, function (err, result) {
      if (err) throw err;
      if (result.warningCount === 0) {
        console.log("Order_details table created");
      }
    });
  }
});

router.get("/", (req, res) => {
    const query = "SELECT * FROM order_details";
    connection.query(query, (err, rows) => {
      if (err) throw err;
      res.send(rows);
    });
  });

  router.post("/", (req, res) => {
    const order_id = req.body.order_id;
    const item_id = req.body.item_id;
    const qty = req.body.qty;
  
    const query = "INSERT INTO order_details VALUES (?,?,?)";
  
    connection.query(query, [order_id, item_id, qty], (err) => {
      if (err) {
        res.send({ message: "Duplicate entry" });
      } else {
        res.send({ message: "Order_details created!" });
      }
    });
  });

  router.put("/", (req, res) => {
    const order_id = req.body.order_id;
    const item_id = req.body.item_id;
    const qty = req.body.qty;

  const query = "UPDATE order_details SET item_id=?, qty=? WHERE order_id=?";

  connection.query(query, [item_id, qty, order_id], (err, rows) => {
    if (err) throw err;

    if (rows.affectedRows > 0) {
      res.send({ message: "Order_details updated" });
    } else {
      res.send({ message: "Order_details not found" });
    }
  });
});

router.delete("/:order_id", (req, res) => {
    const order_id  = req.params.order_id ;
    const query = "DELETE FROM order_details WHERE order_id=?";
  
    connection.query(query, [order_id ], (err, rows) => {
      if (err) throw err;
      if (rows.affectedRows > 0) {
        res.send({ message: "Order_details Deleted" });
      } else {
        res.send({ message: "Order_details Not Found" });
      }
    });
  });

module.exports = router;