import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
const port = 3000;

// This line is crucial! It allows your server to read the JSON body sent from main.js
app.use(express.json()); 
app.use(cors());
// Add this line so Express knows to send your index.html to the browser!
app.use(express.static('./'));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "TBK@89boonkai",
  database: "expenses",
});

db.connect((err) => {
  if (err) {
    console.error("unable to connect", err);
  } else {
    console.log("successfully connected");
  }
});

app.listen(port, () => {
  console.log("server is running at http://localhost:3000");
});

// --- THE FIXES ARE BELOW ---

// 1. CHANGED ROUTE: Changed '/data' to '/tracker' to match the API variable in your main.js
// 2. TYPO FIX: Changed OREDER to ORDER
app.get('/tracker', (req, res) => {
  const order = "SELECT * FROM tracker ORDER BY id DESC";
  db.query(order, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// 3. ADDING DATA: We need to pull the data out of the request body and feed it to the SQL query
app.post('/tracker', (req, res) => {
  // Grab the values sent from your frontend
  const { expense, description } = req.body; 
  
  const order = 'INSERT INTO tracker(date, expense, description) VALUES(UTC_date(), ?, ?)';
  
  // Pass those values into an array as the second argument. They replace the '?' in the SQL string.
  db.query(order, [expense, description], (err, data) => {
    if (err) return res.json(err);
    return res.json("EXPENSE SUCCESSFULLY ENTERED");
  });
});

// 4. DELETING DATA: Added '/:id' to the URL so the server knows exactly WHICH row to delete
app.delete('/tracker/:id', (req, res) => {
  const id = req.params.id; // Grab the ID from the URL
  
  const order = "DELETE FROM tracker WHERE id=(?)";
  
  // Pass the ID into the query
  db.query(order, [id], (err, data) => {
    if (err) return res.json(err);
    return res.json("Expense deleted successfully");
  });
});

// 5. UPDATING DATA: Changed the SQL query from DELETE to UPDATE, and grab both ID and new data
app.patch('/tracker/:id', (req, res) => {
  const id = req.params.id; // From the URL
  const { expense, description } = req.body; // From the frontend form

  // The UPDATE statement sets the new values for the specific ID
  const order = "UPDATE tracker SET expense = ?, description = ? WHERE id = ?";
  
  // Pass the variables in the exact order the '?' appear in the query
  db.query(order, [expense, description, id], (err, data) => {
    if (err) return res.json(err);
    return res.json("Expense updated successfully");
  });
});






