import express from "express";
const app = express();

// Route callback can be in the form of
//  - Single Callback Function
//  - More then one callback
//  - Array Of Function
//  - Combination Of Both

// ----------------------------
// One Callback Function 🛫
// app.get("/", (req, res) => res.send("Single Callback"));
// ----------------------------

// ----------------------------
// More Then One Callback
//  - You cannot post response two times ❌
//  - Don't forget to pass the "next" function ⚠️
//  - (next) function will allows us to run another cb. 🏃‍♂️
//  - here in the first callback you can put your (logic) 🗯️

// app.get(
//   "/cbexample2",
//   (req, res, next) => {
//     // console.log("First callback");
//     res.send("First Callback");
//     next();
//   },
//   (req, res) => {
//     res.send("More then one callback");
//   }
// );
// ----------------------------

// Array of callbacks
const cb1 = (req, res, next) => {
  console.log("First callback");
  next();
};

const cb2 = (req, res, next) => {
  console.log("Second callback");
  next();
};

const cb3 = (req, res) => {
  console.log("Third callback");
  res.send("Array of callbacks (response)");
};

// Passing array of callbacks
app.get("/cbexample3", [cb1, cb2, cb3]);


// Combination of independent function and array of function
// const cb1 = (req, res, next) => {
//   console.log("First callback");
//   next();
// };

// const cb2 = (req, res, next) => {
//   console.log("Second callback");
//   next();
// };

// app.get(
//   "/cbexample4",
//   [cb1, cb2],
//   (req, res, next) => {
//     console.log("Third callback");
//     next();
//   },
//   (req, res) => {
//     console.log("Fourth callback");
//     res.send("Combination of independent function and array of function");
//   }
// );

app.listen(3000, () => console.log("Server Up!"));