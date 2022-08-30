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
      "CREATE TABLE IF NOT EXISTs Customer(id VARCHAR(255) PRIMARY KEY, name VARCHAR(255), address VARCHAR(255))";
    connection.query(customerTbl, function (err, result) {
      if (err) throw err;
      if (result.warningCount === 0) {
        console.log("User table created");
      }
    });
  }
});

router.get("/", (req, res) => {
    const query = "SELECT * FROM customer";
    connection.query(query, (err, rows) => {
      if (err) throw err;
      res.send(rows);
    });
  });


  router.post("/", (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const address = req.body.address;
  
    const query = "INSERT INTO customer VALUES (?,?,?)";
  
    connection.query(query, [id, name, address], (err) => {
      if (err) {
        res.send({ message: "Duplicate entry" });
      } else {
        res.send({ message: "user created!" });
      }
    });
  });

  router.put("/", (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const address = req.body.address;
  
    const query = "UPDATE customer SET name=?, address=? WHERE id=?";
  
    connection.query(query, [name, address, id], (err, rows) => {
      if (err) throw err;
  
      if (rows.affectedRows > 0 ) {
          res.send({'message':'user updated'})
      }else{
          res.send({'message':'user not found'})
      }
  
    });
  });

  router.delete('/:id',(req,res)=>{
    const id = req.params.id;
    const query = "DELETE FROM customer WHERE id=?";
    
    connection.query(query,[id],(err,rows)=>{
        if (err) throw err;
        if (rows.affectedRows>0) {
            res.send({'message':'Customer Deleted'})
        }else{
            res.send({'message':'Customer Not Found'})
        }
    })
})


module.exports = router;