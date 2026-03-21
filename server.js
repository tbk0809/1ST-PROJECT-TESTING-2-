/*
const express=require('express');
//the server
const mysql=require('mysql2');
//database
const path=require('path');//for the file system, the better to have,delete doesn'tg matter
const cor=require('cors');//make trhe frontend communicate with the backend


require('/database.js');

const main=require('/main.js');

const app=express();//create the server
const port=3000;

app.use(cors());//allow the server from other website even the frontend(e.g., http://localhost:5173) and backend(http://localhost:3000) is different origins
app.use(express.json());
app.use(express.static('public'));

app.use('tracker',main);

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});


*/

//test  from github

import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app=express();


const port=3000;
app.use(express.json());
app.use(cors());

const db=mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"TBK@89boonkai",
  database:"expenses",
});

db.connect((err)=>{
  if(err){
    console.error("unable to connect");
  }
  else{
    console.log("successfully connected");
  }
});

app.listen(port,()=>{
  console.log("server is running at localhost 3000")
});


//to view
app.get('/data',(req,res)=>{

  const order="SELECT * FROM tracker OREDER BY id DESC";
  db.query(order, (err, data) => {
    if (err) return res.json(err)
    return res.json(data);
  });
});

//to add
app.post('/data',(req,res)=>{
  
  const order='INSERT INTO tracker(date, expense,description) VALUES(UTC_date(),?,?)';
  db.query(order, (err, data) => {
    if (err) return res.json(err)
    return "EXPENSE SUCCESSFULLY ENTERED";
  });
});

app.delete('/data',(req,res)=>{
  const order="DELETE FROM tracker WHERE id=(?)";
  db.query(order, (err, data) => {
    if (err) return res.json(err)
    return res.json(data);
  });
});

app.patch('/data',(req,res)=>{
  const order="DELETE FROM tracker WHERE id=(?)";
  db.query(order, (err, data) => {
    if (err) return res.json(err)
    return res.json(data);
  });
});






