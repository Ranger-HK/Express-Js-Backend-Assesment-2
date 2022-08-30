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
    var orderTbl =
      "CREATE TABLE IF NOT EXISTS Orders(id VARCHAR(255) PRIMARY KEY, date VARCHAR(255), customer_id VARCHAR(255))";
    connection.query(orderTbl, function (err, result) {
      if (err) throw err;
      if (result.warningCount === 0) {
        console.log("Order table created");
      }
    });
  }
});

router.get("/", (req, res) => {
  const query = "SELECT * FROM orders";
  connection.query(query, (err, rows) => {
    if (err) throw err;
    res.send(rows);
  });
});

router.post("/", (req, res) => {
  const id = req.body.id;
  const date = req.body.date;
  const customer_id = req.body.customer_id;

  const query = "INSERT INTO orders VALUES (?,?,?)";

  connection.query(query, [id, date, customer_id], (err) => {
    if (err) {
      res.send({ message: "Duplicate entry" });
    } else {
      res.send({ message: "Order created!" });
    }
  });
});

router.put("/", (req, res) => {
  const id = req.body.id;
  const date = req.body.date;
  const customer_id = req.body.customer_id;

  const query = "UPDATE orders SET date=?, customer_id=? WHERE id=?";

  connection.query(query, [date, customer_id, id], (err, rows) => {
    if (err) throw err;

    if (rows.affectedRows > 0) {
      res.send({ message: "Order updated" });
    } else {
      res.send({ message: "Order not found" });
    }
  });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM orders WHERE id=?";

  connection.query(query, [id], (err, rows) => {
    if (err) throw err;
    if (rows.affectedRows > 0) {
      res.send({ message: "Order Deleted" });
    } else {
      res.send({ message: "Order Not Found" });
    }
  });
});



module.exports = router;
