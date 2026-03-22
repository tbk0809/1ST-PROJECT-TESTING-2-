const addBtn = document.getElementById("add");
const deleteBtn = document.getElementById("delete");
const viewBtn = document.getElementById("view");
const updateBtn = document.getElementById("update");

// Grab the containers we just added to HTML
const actionArea = document.getElementById("actionArea");
const taskList = document.getElementById("taskList");

const API = "http://localhost:3000/tracker";

// ==========================================
// 1. READ (GET) - View all expenses
// ==========================================
viewBtn.onclick = async function() {
  actionArea.innerHTML = ""; 
  
  try {
    const response = await fetch(API);
    const result = await response.json(); 
    
    taskList.innerHTML = ""; 
    
    // Loop through the data from MySQL
    result.forEach(item => {
      const li = document.createElement("li"); 
      // Matching the exact column names from your database
      li.textContent = `ID: ${item.id} | Date: ${item.date} | Expense: $${item.expense} | Desc: ${item.description}`; 
      taskList.appendChild(li); 
    });
  } catch (error) {
    console.error("Error viewing expenses:", error);
  }
};

// ==========================================
// 2. CREATE (POST) - Add new expense
// ==========================================
addBtn.onclick = function() {
  actionArea.innerHTML = `
    <label>Expense Amount:</label>
    <input type="number" id="newExpenseInput">
    <label>Description:</label>
    <input type="text" id="newDescInput">
    <button id="saveNewExpense">Save</button>
  `;

  document.getElementById("saveNewExpense").onclick = async function() {
    const expenseVal = document.getElementById("newExpenseInput").value; 
    const descVal = document.getElementById("newDescInput").value; 
    
    try {
      await fetch(API, {
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        // We must send "expense" and "description" so server.js can find them in req.body
        body: JSON.stringify({ expense: expenseVal, description: descVal }) 
      });
      
      alert("Expense added successfully!");
      actionArea.innerHTML = ""; 
      viewBtn.onclick(); // Automatically refresh the list
    } catch (error) {
      console.error("Error adding expenses:", error);
    }
  };
};

// ==========================================
// 3. DELETE - Remove an expense
// ==========================================
deleteBtn.onclick = function() {
  actionArea.innerHTML = `
    <label>Enter Expense ID to delete:</label>
    <input type="number" id="deleteIdInput">
    <button id="confirmDelete">Delete</button>
  `;

  document.getElementById("confirmDelete").onclick = async function() {
    const id = document.getElementById("deleteIdInput").value; 
    
    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE"
      });
      
      alert("Expense deleted successfully!");
      actionArea.innerHTML = "";
      viewBtn.onclick(); // Automatically refresh the list
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };
};

// ==========================================
// 4. UPDATE (PATCH) - Update an expense
// ==========================================
updateBtn.onclick = function() {
  actionArea.innerHTML = `
    <label>ID to update:</label>
    <input type="number" id="updateIdInput">
    <br><br>
    <label>New Expense Amount:</label>
    <input type="number" id="updateExpenseInput">
    <label>New Description:</label>
    <input type="text" id="updateDescInput">
    <button id="confirmUpdate">Update</button>
  `;

  document.getElementById("confirmUpdate").onclick = async function() {
    const id = document.getElementById("updateIdInput").value;
    const newExpense = document.getElementById("updateExpenseInput").value;
    const newDesc = document.getElementById("updateDescInput").value;
    
    try {
      await fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" }, // Crucial for PATCH requests with data!
        body: JSON.stringify({ expense: newExpense, description: newDesc })
      });
      
      alert("Expense updated!");
      actionArea.innerHTML = "";
      viewBtn.onclick(); // Automatically refresh the list
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };
};