// const express = require("express");

// const app = express();

// app.use((req, res) =>{
//     res.send("Hello world");
// })

// console.log(app.use((req, res) =>{
//     res.send("Hello world");
// }))

// app.listen(8000, ()=>{console.log("Server is connected successfully")})

//Routing Basics
// import express from "express";
// const app = express();

// // Routing refers to how an application’s endpoints (URIs) respond to client requests.

// // HTTP Methods
// // GET👉 Retrive Data
// // POST 👉 Create/Insert Data
// // PUT 👉 Completely Update Data
// // PATCH 👉 Partially Update Data
// // DELETE 👉 Delete Data
// // ALL 👉 Any HTTP Request Method

// // BASIC ROUTES 👇
// app.get("/", (req, res) => {
//   res.send("<h1>HOME 🏠 </h1>");
// });

// app.get("/about", (req, res) => {
//   res.send("<h1>ABOUT 😶‍🌫️ </h1>");
// });

// app.get("/contact", (req, res) => {
//   res.send("<h1>CONTACT 📲 </h1>");
// });

// app.get("/work", (req, res) => {
//   res.send("<h1>MY WORK 💪 </h1>");
// });

// app.listen(3000, () => console.log("Server Up!"));


//Advance Routing
import express from "express";
const app = express();

// In path area you can either pass simple Strings or Regular Expressions

// --------------------------------------
// String Pattern Path
app.get(/^\/ab?cd$/, (req, res) => {
  res.send("If the user hit (acd) or (abcd) then this code will run.");
});

// --------------------------------------

// --------------------------------------
// Regular Expression (Regex) Path
app.get(/a/, (req, res) => {
  res.send("If the path includes the letter (a) it will work");
});

// Matches requests to /users/ followed by any 4-digit number
// /users/1234
app.get(/^\/users\/[0-9]{4}$/, function (req, res) {
  res.send("Working");
});
// --------------------------------------

app.listen(3000, () => console.log("Server Up!"));