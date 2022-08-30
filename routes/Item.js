const express = require("express");
const router = express.Router();
const db =require("../configs/db.config");

const mysql =require("mysql");
const req = require("express/lib/request");
const res = require("express/lib/response");
const Connection = require("mysql/lib/Connection");
const connection = mysql.createConnection(db.database);

connection.connect(function(err){
    if(err){
        console.log(err);
    }else{
        console.log("connected to the mysql server");
        var itemTbl="CREATE TABLE IF NOT EXISTs Item(id VARCHAR(255)PRIMARY KEY, name VARCHAR(255), qty INT, price DOUBLE)";
        connection.query(itemTbl,function(err,result){
            if (err) throw err;
            if(result.warningCount === 0){
                console.log("Item table created");
            }
        });
    }
});

router.get("/",(req,res)=>{
    const query ="SELECT * FROM item";
    connection.query(query,(err,rows)=>{
        if(err) throw err;
        res.send(rows);
    });
});

router.post("/",(req,res)=>{
    const id = req.body.id;
    const name = req.body.name;
    const qty = req.body.qty;
    const price = req.body.price;

    const query = "INSERT INTO item VALUES(?,?,?,?)"

    connection.query(query,[id,name,qty,price],(err)=>{
        if(err){
            res.send({message:"Duplicate entry"});
        }else{
            res.send({message:"item created"});
        }
    });
});

router.put("/",(req,res)=>{
    const id = req.body.id;
    const name = req.body.name;
    const qty = req.body.qty;
    const price = req.body.price;

    const query = " UPDATE item SET name=?, qty=?, price=? WHERE id=?";

    connection.query(query,[name,qty,price,id],(err,rows)=>{
        if (err) throw err;
        if (rows.affectedRows>0){
            res.send({message:"Item updated"});
        }else{
            res.send({message:"Item not found"});
        }
    });
});

router.delete("/:id",(req,res)=>{
    const id = req.params.id;
    const query = "DELETE FROM item WHERE id=?";
  
    connection.query(query, [id], (err, rows) => {
      if (err) throw err;
      if (rows.affectedRows > 0) {
        res.send({ message: "Item Deleted" });
      } else {
        res.send({ message: "Item Not Found" });
      }
    });
});

module.exports = router;