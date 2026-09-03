# Express.js Concepts — Repository Guide

> A practical Express.js learning repository covering application setup, middleware basics, routing, route callbacks, regular-expression routes, static files, `sendFile()`, routers, controllers, EJS templates, and a simple route/controller/view architecture.

This repository is a small **Express.js concept-learning project** rather than a production application. It contains separate examples that build from a basic Express server to a more organized application using routes, controllers, static assets, and EJS templates.

The guide below follows the code currently present in the repository and explains what each example is teaching.

---

## What you will learn

- How an Express application is created
- `express()` and the application instance
- Middleware with `app.use()`
- Basic HTTP routing
- GET, POST, PUT, PATCH, DELETE and ALL concepts
- Route callback functions
- Multiple callbacks in one route
- `next()` and callback chains
- Arrays of callback functions
- Combining callback functions and callback arrays
- Advanced route matching with regular expressions
- Serving static files with `express.static()`
- `res.send()` and `res.sendFile()`
- The difference between static files and rendered templates
- `express.Router()`
- Separating routes from controllers
- EJS template engine setup
- `app.set("view engine", "ejs")`
- Configuring the views directory
- `res.render()`
- Serving CSS and other public assets
- A simple Routes → Controller → View flow
- ES Modules in Express
- How to run each example independently
- Common mistakes and improvements for production-oriented code

---

# 1. Repository overview

The repository currently contains three main learning examples plus the root Express example.

```text
ExpressJs/
├── Routes-callback/
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── Serving-Static-files/
│   ├── public/
│   │   ├── app.js
│   │   └── index.html
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── Template-engine-setup/
│   ├── controllers/
│   │   ├── aboutController.js
│   │   └── homeController.js
│   ├── public/
│   │   └── css/
│   ├── routes/
│   │   └── web.js
│   ├── views/
│   │   ├── about.ejs
│   │   └── index.ejs
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
├── index.js
├── package.json
└── package-lock.json
```

The three folders represent a progression:

```text
Express basics
      │
      ▼
Routing callbacks
      │
      ▼
Static file serving
      │
      ▼
Routes + Controllers + EJS Views
```

---

# 2. What is Express.js?

Express.js is a web framework for Node.js that provides a simpler API for creating HTTP applications, handling routes, composing middleware, and sending responses.

Without Express, Node.js can create a server using the built-in `http` module:

```js
import http from "http";

const server = http.createServer((req, res) => {
  res.end("Hello World");
});

server.listen(3000);
```

With Express:

```js
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000);
```

The second version hides much of the low-level HTTP handling and gives you a higher-level routing and middleware model.

The official Express project describes Express as a minimal HTTP/web framework with routing and middleware capabilities. citeturn750825search1

---

# 3. Project prerequisites

You need:

```text
Node.js
npm
```

Check your installation:

```bash
node --version
npm --version
```

Because the repository's `package.json` files use:

```json
"type": "module"
```

the examples use ES Module syntax such as:

```js
import express from "express";
```

The repository pins Express with:

```json
"express": "^5.2.1"
```

in its package definitions. citeturn138947view1turn656346view1turn656346view0

---

# 4. Installing dependencies

Clone the repository:

```bash
git clone https://github.com/Shrey5112/ExpressJs.git
cd ExpressJs
```

Install the root dependency:

```bash
npm install
```

For each example that has its own `package.json`, install dependencies from that directory.

For example:

```bash
cd Routes-callback
npm install
```

or:

```bash
cd Serving-Static-files
npm install
```

or:

```bash
cd Template-engine-setup
npm install
```

The template-engine example additionally depends on EJS. citeturn656346view0

---

# 5. ES Modules in this repository

The repository uses ES Module syntax in its main Express examples.

For example:

```js
import express from "express";
```

rather than:

```js
const express = require("express");
```

The `package.json` explicitly declares:

```json
{
  "type": "module"
}
```

This means `.js` files are interpreted as ES Modules within that package scope. citeturn138947view1turn656346view1turn656346view0

### Common ES Module syntax

Import:

```js
import express from "express";
```

Named import:

```js
import { something } from "./module.js";
```

Export:

```js
export default something;
```

or:

```js
export { something };
```

The template example uses named exports for its controllers and a default export for the router. citeturn890099view0turn490865view1turn890099view1

---

# 6. Creating the Express application

The basic pattern is:

```js
import express from "express";

const app = express();
```

There are two important objects to understand:

```text
express
   │
   ▼
factory function
   │
   ▼
app
   │
   ├── routes
   ├── middleware
   ├── settings
   └── server behavior
```

`app` is the Express application instance.

You configure the application using methods such as:

```js
app.use(...)
app.get(...)
app.post(...)
app.set(...)
app.listen(...)
```

---

# 7. Starting the server

The repository repeatedly uses:

```js
app.listen(3000, () => console.log("Server Up!"));
```

This starts the HTTP server.

Conceptually:

```text
Express application
        │
        ▼
    app.listen()
        │
        ▼
   HTTP server
        │
        ▼
 localhost:3000
```

For example:

```bash
node index.js
```

then open:

```text
http://localhost:3000
```

---

# 8. Middleware with `app.use()`

One of the first concepts demonstrated in the root `index.js` is:

```js
app.use((req, res) => {
  res.send("Hello world");
});
```

`app.use()` is used to register middleware.

A middleware function usually receives:

```js
(req, res, next)
```

and can:

- inspect the request
- modify the request
- modify the response
- end the response
- call `next()` to pass control onward

Example:

```js
app.use((req, res, next) => {
  console.log("Request received");
  next();
});
```

The flow becomes:

```text
Request
   │
   ▼
Middleware 1
   │
 next()
   ▼
Middleware 2
   │
 next()
   ▼
Route handler
   │
   ▼
Response
```

---

# 9. Why `next()` matters

Suppose you write:

```js
app.use((req, res, next) => {
  console.log("Middleware");
  next();
});
```

Calling:

```js
next();
```

tells Express:

> Continue processing the next matching middleware or route.

Without `next()` and without ending the response, the request can remain unresolved.

A middleware can instead terminate the request:

```js
app.use((req, res) => {
  res.send("Done");
});
```

In that case it does not need to call `next()` because it has already produced the response.

---

# 10. Routing fundamentals

The root `index.js` comments describe routing as the way application endpoints respond to client requests. The same file lists the common HTTP methods used for route handling. citeturn138947view2

The major methods are:

| Method | Typical meaning |
|---|---|
| `GET` | Read/retrieve data |
| `POST` | Create data |
| `PUT` | Replace/update a resource |
| `PATCH` | Partially update a resource |
| `DELETE` | Delete a resource |
| `ALL` | Handle any HTTP method |

These meanings describe common API conventions, not a restriction imposed by Express itself.

---

# 11. Basic route

The standard Express route pattern is:

```js
app.get("/", (req, res) => {
  res.send("Home");
});
```

The three important parts are:

```text
app.get
  │
  ├── path
  │
  └── handler
```

For example:

```js
app.get("/about", (req, res) => {
  res.send("About page");
});
```

The repository's root example shows routes for:

```text
/
 /about
 /contact
 /work
```

using the same pattern. citeturn138947view3

---

# 12. Request and response objects

An Express route commonly receives:

```js
(req, res)
```

## `req`

`req` represents the incoming HTTP request.

Common properties include:

```js
req.method
req.url
req.params
req.query
req.headers
req.body
```

Some properties become especially useful after adding middleware such as body parsers.

## `res`

`res` represents the outgoing HTTP response.

Common methods include:

```js
res.send(...)
res.json(...)
res.status(...)
res.sendFile(...)
res.render(...)
res.redirect(...)
```

The repository demonstrates several of these response-oriented patterns.

---

# 13. `res.send()`

The simplest way to return content is:

```js
res.send("Hello World");
```

It can also send HTML:

```js
res.send("<h1>Hello</h1>");
```

Example from the repository:

```js
app.get("/", (req, res) => {
  res.send("<h1>HOME 🏠</h1>");
});
```

Express handles the response mechanics for you.

---

# 14. Route callbacks

The `Routes-callback` example focuses specifically on route callbacks.

The repository comments identify four supported patterns:

```text
1. Single callback function
2. More than one callback
3. Array of functions
4. Combination of both
```

This is a useful introduction to how Express routes can be composed. citeturn510191view0

---

# 15. Single callback function

The simplest pattern is:

```js
app.get("/", (req, res) => {
  res.send("Single Callback");
});
```

Flow:

```text
GET /
 │
 ▼
callback
 │
 ▼
res.send()
```

This is enough for small routes.

---

# 16. Multiple callback functions

A route can contain several callbacks:

```js
app.get(
  "/example",
  (req, res, next) => {
    // first middleware
    next();
  },
  (req, res) => {
    // second callback
    res.send("Done");
  }
);
```

The repository specifically points out two important rules:

1. A route should not attempt to send multiple responses for the same request.
2. Intermediate callbacks should call `next()` when they want the next callback to execute. citeturn510191view0

The idea is:

```text
Request
   │
   ▼
Callback 1
   │
 next()
   ▼
Callback 2
   │
   ▼
Response
```

---

# 17. Response can only be completed once

A common mistake is:

```js
app.get("/", (req, res) => {
  res.send("First");
  res.send("Second");
});
```

This attempts to send two responses for one request.

The correct callback chain is:

```js
app.get(
  "/",
  (req, res, next) => {
    console.log("Do some work");
    next();
  },
  (req, res) => {
    res.send("Final response");
  }
);
```

Think of `next()` as moving through the processing chain, while `res.send()` or another terminal response method finishes the request.

---

# 18. Callback arrays

The repository demonstrates an array of middleware/callback functions:

```js
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
  res.send("Array of callbacks");
};

app.get("/cbexample3", [cb1, cb2, cb3]);
```

The execution order is:

```text
GET /cbexample3
       │
       ▼
      cb1
       │
    next()
       ▼
      cb2
       │
    next()
       ▼
      cb3
       │
   res.send()
       ▼
    response
```

This is particularly useful when several reusable middleware functions need to be applied to one route. citeturn510191view0

---

# 19. Combining callback styles

Express also permits a combination of individual callbacks and callback arrays.

Conceptually:

```js
app.get(
  "/example",
  [cb1, cb2],
  cb3,
  cb4
);
```

This is useful when a route needs reusable middleware plus route-specific logic.

The repository includes this pattern as a commented example in `Routes-callback/index.js`. citeturn510191view0

---

# 20. Advanced routing with regular expressions

The root `index.js` demonstrates advanced route matching using regular expressions.

For example:

```js
app.get(/^\/ab?cd$/, (req, res) => {
  res.send("Matched");
});
```

The pattern allows paths such as:

```text
/acd
/abcd
```

The repository also demonstrates:

```js
app.get(/a/, (req, res) => {
  res.send("Matched");
});
```

and:

```js
app.get(/^\/users\/[0-9]{4}$/, (req, res) => {
  res.send("Working");
});
```

So:

```text
/users/1234
```

matches the final example, while:

```text
/users/123
```

does not.

These examples show that Express route paths can be defined using regular expressions. citeturn138947view2

---

# 21. Why regular-expression routes are useful

Regular expressions become useful when a route needs a rule rather than a single literal path.

For example:

```text
/users/1234
/users/5678
/users/9999
```

can be described with:

```regex
^\/users\/[0-9]{4}$
```

Instead of registering every possible route individually.

### Important

Regex-heavy routing can become harder to understand and maintain. For common REST-style applications, named route parameters are often easier to read:

```js
app.get("/users/:id", ...)
```

and then:

```js
req.params.id
```

Use regex constraints when the matching requirement genuinely benefits from them.

---

# 22. Static files

The `Serving-Static-files` example demonstrates:

```js
app.use(express.static("public"));
```

This is a very important Express middleware.

The repository describes `express.static` as built-in middleware for serving static files and uses it to expose the `public` directory. citeturn490865view0

The directory looks like:

```text
Serving-Static-files/
└── public/
    ├── app.js
    └── index.html
```

The browser can request files from that directory directly.

Conceptually:

```text
Browser
   │
   │ GET /index.html
   ▼
express.static("public")
   │
   ▼
public/index.html
   │
   ▼
Browser
```

---

# 23. What is a static file?

A static file is delivered as-is rather than generated dynamically for each request.

Typical static assets include:

```text
HTML
CSS
JavaScript
Images
Fonts
```

For example:

```text
public/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── images/
    └── logo.png
```

Express can expose the entire directory with:

```js
app.use(express.static("public"));
```

---

# 24. Relative static paths

The repository uses:

```js
app.use(express.static("public"));
```

This is simple and good for demonstrating the concept.

For more explicit path handling, especially in larger projects, you may resolve the absolute directory.

With ES Modules:

```js
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
```

This avoids relying on the process's current working directory.

---

# 25. `res.sendFile()`

The static-files example also demonstrates:

```js
res.sendFile(path.resolve(__dirname, "./public/index.html"));
```

The idea is:

```text
Route
  │
  ▼
res.sendFile(...)
  │
  ▼
Read file
  │
  ▼
Send file to browser
```

The code combines:

```js
const path = require("path");
```

with:

```js
res.sendFile(...)
```

to resolve the file path. citeturn490865view0

---

# 26. `express.static()` vs `res.sendFile()`

These are related but solve different problems.

| `express.static()` | `res.sendFile()` |
|---|---|
| Exposes a directory | Sends one specific file |
| Good for CSS/JS/images/HTML | Useful when a route intentionally returns one file |
| Middleware | Response method |
| Reusable for many assets | Explicit per route |

Example:

```js
app.use(express.static("public"));
```

is a good fit for an asset directory.

Meanwhile:

```js
app.get("/", (req, res) => {
  res.sendFile(...);
});
```

is useful when the route itself controls which file is returned.

---

# 27. Static files and routes together

The static example contains:

```js
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public/index.html"));
});
```

This demonstrates that Express can use both:

```text
middleware
+
explicit routes
```

in one application.

The order in which middleware and routes are registered matters because Express processes matching handlers in order.

---

# 28. EJS template engine

The `Template-engine-setup` example introduces server-side templates using **EJS**.

Its `package.json` includes:

```json
"dependencies": {
  "ejs": "^4.0.1",
  "express": "^5.2.1"
}
```

and:

```json
"type": "module"
```

citeturn656346view0

The purpose of a template engine is to generate HTML from a template plus server-side data.

Conceptually:

```text
Data
  +
EJS template
  │
  ▼
Rendered HTML
  │
  ▼
Browser
```

---

# 29. Configuring EJS

The repository's `Template-engine-setup/index.js` contains:

```js
app.set("views", "./views");
app.set("view engine", "ejs");
```

These settings tell Express:

1. where templates are located
2. which rendering engine should be used

The full example then serves static files and mounts the router. citeturn382549view0

---

# 30. The `views` directory

The repository contains:

```text
views/
├── about.ejs
└── index.ejs
```

These files are HTML-like templates.

For example:

```html
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>HOME</title>
</head>
<body>
  <h1>HOME</h1>
  <h5>This Is Home Page</h5>
</body>
</html>
```

The repository's current EJS views are mostly static HTML, which is a useful first step before adding dynamic EJS expressions. citeturn490865view2turn490865view3

---

# 31. `res.render()`

The controller files use:

```js
res.render("index");
```

and:

```js
res.render("about");
```

For example:

```js
const homeController = (req, res) => {
  res.render("index");
};
```

and:

```js
const aboutController = (req, res) => {
  res.render("about");
};
```

citeturn490865view1turn890099view1

Notice that the code does not specify:

```text
views/index.ejs
```

directly.

Because Express already knows:

```js
app.set("views", "./views");
app.set("view engine", "ejs");
```

the expression:

```js
res.render("index");
```

can resolve the template.

---

# 32. Passing data to EJS

The current repository does not yet pass dynamic data into its views, but the next natural concept is:

```js
res.render("index", {
  title: "Home",
  username: "John"
});
```

Then inside EJS:

```ejs
<h1><%= title %></h1>
<p>Hello <%= username %></p>
```

This transforms EJS from simple HTML storage into a real server-side view layer.

---

# 33. Important EJS syntax

Useful EJS syntax includes:

### Output escaped value

```ejs
<%= value %>
```

### Execute JavaScript

```ejs
<% if (user) { %>
  <p>Welcome</p>
<% } %>
```

### Loop

```ejs
<% users.forEach(user => { %>
  <p><%= user.name %></p>
<% }) %>
```

A typical server flow becomes:

```text
Route
   │
   ▼
Controller
   │
   ├── fetch data
   │
   └── res.render("view", data)
            │
            ▼
          EJS
            │
            ▼
      rendered HTML
            │
            ▼
         browser
```

---

# 34. Routes with `express.Router()`

The template example introduces a separate router:

```js
import express from "express";

const router = express.Router();
```

The router then defines:

```js
router.get("/", homeController);
router.get("/about", aboutController);
```

and exports:

```js
export default router;
```

citeturn890099view0

This is one of the most important architectural steps in the repository.

---

# 35. Why use `express.Router()`?

Without a router, you might place everything inside:

```js
index.js
```

As the application grows, that file becomes difficult to maintain.

Instead:

```text
index.js
   │
   └── mounts router

routes/
   │
   └── defines URL → controller relationships

controllers/
   │
   └── contains request-handling logic

views/
   │
   └── contains presentation templates
```

This creates separation of responsibilities.

---

# 36. Mounting a router

The repository's main template file uses:

```js
app.use("/", web);
```

This means requests beginning with `/` are delegated to the `web` router. citeturn382549view0

For example:

```text
GET /
      │
      ▼
app.use("/", web)
      │
      ▼
web router
      │
      ▼
router.get("/")
      │
      ▼
homeController
```

Similarly:

```text
GET /about
      │
      ▼
web router
      │
      ▼
router.get("/about")
      │
      ▼
aboutController
```

---

# 37. Controllers

The repository has:

```text
controllers/
├── aboutController.js
└── homeController.js
```

A controller is simply a function responsible for handling a request.

Home controller:

```js
const homeController = (req, res) => {
  res.render("index");
};

export { homeController };
```

About controller:

```js
const aboutController = (req, res) => {
  res.render("about");
};

export { aboutController };
```

citeturn490865view1turn890099view1

This is a simple form of controller separation.

---

# 38. Route → controller connection

The router imports the controllers:

```js
import { homeController } from "../controllers/homeController.js";
import { aboutController } from "../controllers/aboutController.js";
```

Then maps routes:

```js
router.get("/", homeController);
router.get("/about", aboutController);
```

This gives a clean relationship:

```text
URL
 │
 ▼
Router
 │
 ├── "/"      → homeController
 │
 └── "/about" → aboutController
```

The router file is therefore responsible for **routing**, while the controller is responsible for **handling** the request.

---

# 39. The complete template-engine architecture

The repository's template example can be understood as:

```text
                Browser
                   │
                   │ HTTP request
                   ▼
              index.js
                   │
             app.use("/")
                   │
                   ▼
             routes/web.js
              │           │
              ▼           ▼
       homeController  aboutController
              │           │
              ▼           ▼
         index.ejs     about.ejs
              │           │
              └─────┬─────┘
                    ▼
              rendered HTML
                    │
                    ▼
                 Browser
```

This is the most architecturally important example in the repository.

---

# 40. Static assets in the template project

The template project also includes:

```text
public/
└── css/
```

and configures:

```js
app.use(express.static(join(process.cwd(), "public")));
```

This makes public assets available to the browser. citeturn382549view0

For example, a stylesheet might be requested as:

```text
/css/style.css
```

while the actual filesystem location is:

```text
public/css/style.css
```

---

# 41. `process.cwd()` in the repository

The template setup uses:

```js
join(process.cwd(), "public")
```

`process.cwd()` returns the current working directory of the Node.js process.

This is different from:

```text
the directory containing the current source file
```

That distinction matters.

For source-file-relative paths in ES Modules, another common approach is:

```js
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

Then:

```js
path.join(__dirname, "public")
```

is relative to the module file.

---

# 42. `app.set()` and Express application settings

The repository demonstrates:

```js
app.set("views", "./views");
app.set("view engine", "ejs");
```

`app.set()` stores application configuration.

This mechanism is commonly used for Express settings such as:

```js
app.set("view engine", "ejs");
```

Some settings affect:

- view rendering
- environment behavior
- query parsing
- application configuration

The key concept is:

```text
app.set(name, value)
```

sets an application-level configuration value.

---

# 43. Middleware vs routes

This distinction is critical.

### Middleware

```js
app.use(...)
```

usually participates in a processing chain.

Examples:

```js
app.use(express.static("public"));

app.use((req, res, next) => {
  console.log(req.method);
  next();
});
```

### Route

```js
app.get("/about", ...)
```

matches a particular HTTP method and route pattern.

A route normally represents an endpoint.

Think:

```text
Middleware → "Do something while processing requests"

Route      → "Handle this endpoint"
```

---

# 44. Express request lifecycle

A simple request might pass through:

```text
Browser
   │
   ▼
Express app
   │
   ▼
Global middleware
   │
   ▼
Static middleware
   │
   ▼
Router
   │
   ▼
Controller
   │
   ▼
Template / response
   │
   ▼
Browser
```

Not every request goes through every layer.

The exact behavior depends on registration order and route matching.

---

# 45. Order matters in Express

Consider:

```js
app.use(middlewareA);
app.use(middlewareB);

app.get("/", handler);
```

Express processes matching handlers in registration order.

This means:

```text
A
 ↓
B
 ↓
route handler
```

If an earlier middleware ends the response, later handlers may never run.

Likewise, a middleware that calls `next()` passes control forward.

This is why middleware order should be intentional.

---

# 46. A clean project structure

The repository's template example already introduces a useful structure:

```text
project/
├── controllers/
├── routes/
├── views/
├── public/
└── index.js
```

A larger Express application often grows this into:

```text
src/
├── controllers/
├── middleware/
├── routes/
├── services/
├── models/
├── validators/
├── views/
├── public/
└── app.js
```

The exact architecture depends on the application, but the repository's Routes → Controllers → Views pattern is a strong starting point.

---

# 47. `app.js` vs server entry point

The current repository commonly uses `index.js` as both:

```text
application setup
+
server startup
```

For larger applications, you may separate these:

```text
app.js
server.js
```

For example:

```js
// app.js
const app = express();

app.use(...);

export default app;
```

and:

```js
// server.js
import app from "./app.js";

app.listen(3000);
```

This separation becomes useful for testing and deployment.

---

# 48. Error handling

The repository currently focuses on routing and rendering, so it does not yet include a dedicated error-handling middleware layer.

A standard Express error middleware signature is:

```js
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).send("Internal Server Error");
});
```

The four parameters matter:

```js
(err, req, res, next)
```

This should be kept separate from normal three-argument middleware.

---

# 49. 404 handling

A useful next step after the repository's route examples is a final 404 handler:

```js
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});
```

Because middleware and routes are processed in order, placing this after the normal routes allows unmatched requests to reach it.

Flow:

```text
Request
  │
  ├── /       → route
  ├── /about  → route
  ├── /contact → route
  │
  └── unknown → 404 middleware
```

---

# 50. JSON responses

Although this repository focuses heavily on pages, Express is also widely used for APIs.

A JSON response is simple:

```js
app.get("/api/users", (req, res) => {
  res.json([
    { id: 1, name: "John" },
    { id: 2, name: "Jane" }
  ]);
});
```

`res.json()` serializes the JavaScript value and sends a JSON response.

This is a natural next step after the repository's routing examples.

---

# 51. Request body parsing

For JSON request bodies, a common Express middleware is:

```js
app.use(express.json());
```

Then:

```js
app.post("/users", (req, res) => {
  console.log(req.body);
  res.json(req.body);
});
```

Conceptually:

```text
Client JSON
    │
    ▼
express.json()
    │
    ▼
req.body
    │
    ▼
controller
```

This is not yet demonstrated in the repository, but it is one of the next concepts to learn after route callbacks.

---

# 52. Route parameters

Another important routing concept beyond the repository's regex examples is:

```js
app.get("/users/:id", (req, res) => {
  res.send(`User ID: ${req.params.id}`);
});
```

A request:

```text
/users/123
```

produces:

```js
req.params.id === "123"
```

This is generally more readable than manually building many regex routes.

---

# 53. Query parameters

A URL such as:

```text
/products?page=2&limit=10
```

can be accessed through:

```js
req.query
```

Example:

```js
app.get("/products", (req, res) => {
  console.log(req.query.page);
  console.log(req.query.limit);

  res.send("Products");
});
```

This is another natural next step after basic routing.

---

# 54. Route design

A good Express API route should communicate its purpose clearly.

Examples:

```text
GET    /users
GET    /users/:id
POST   /users
PUT    /users/:id
PATCH  /users/:id
DELETE /users/:id
```

The repository's comments already introduce the main HTTP methods, so these REST-style patterns are a natural continuation. citeturn138947view2

---

# 55. Static pages vs dynamic pages

The repository teaches both.

## Static

```text
public/index.html
```

served with:

```js
express.static(...)
```

The file is delivered as a static asset.

## Dynamic/server-rendered

```text
views/index.ejs
```

rendered with:

```js
res.render("index", data);
```

The HTML is generated from a template.

The difference is:

```text
Static:
file → browser

Dynamic:
data + template → HTML → browser
```

---

# 56. Common mistakes

## Mistake 1 — Forgetting `next()`

Incorrect:

```js
app.get("/example",
  (req, res, next) => {
    console.log("First");
  },
  (req, res) => {
    res.send("Second");
  }
);
```

The first callback does not pass control onward.

Correct:

```js
(req, res, next) => {
  console.log("First");
  next();
}
```

---

## Mistake 2 — Sending two responses

Avoid:

```js
res.send("A");
res.send("B");
```

Send one final response or let middleware prepare the request and call `next()`.

---

## Mistake 3 — Forgetting that routes are method-specific

This:

```js
app.get("/users", handler);
```

does not mean:

```text
all HTTP methods
```

It specifically registers a GET route.

Use the appropriate route method:

```js
app.post(...)
app.put(...)
app.patch(...)
app.delete(...)
```

---

## Mistake 4 — Registering middleware in the wrong order

For example:

```js
app.use(notFoundHandler);

app.get("/", homeHandler);
```

would prevent the intended route from being reached if the 404 middleware ends the response.

Place final fallback handlers after normal routes.

---

## Mistake 5 — Confusing `public` and `views`

A common organization is:

```text
public/ → files served directly
views/  → templates rendered by the server
```

Do not put dynamic EJS templates into the public directory and expect `express.static()` to render them.

---

# 57. Repository-specific note: CommonJS code in the static-files example

The root repository uses ES Modules:

```json
"type": "module"
```

but the current `Serving-Static-files/index.js` uses CommonJS syntax:

```js
const path = require("path");
const express = require("express");
```

The same folder has its own `package.json`, so its module configuration matters when running it. The source should be kept consistent with its local package configuration. citeturn490865view0turn656346view2

This is an important learning point:

> Always check the nearest `package.json` before deciding whether a `.js` file should use `import` or `require`.

---

# 58. Repository-specific note: `process.cwd()` vs file-relative paths

The template example uses:

```js
join(process.cwd(), "public")
```

while the static-files example uses:

```js
path.resolve(__dirname, "./public/index.html")
```

These are two different path strategies.

### `process.cwd()`

Depends on where the process was started.

### `__dirname`

In CommonJS, refers to the directory containing the current file.

### ES Module equivalent

In ES Modules, you can create a file-relative directory with:

```js
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

Understanding this difference will prevent many path-related bugs.

---

# 59. Running the repository examples

## Root example

From the repository root:

```bash
npm install
node index.js
```

The current root example's active code creates an Express app with advanced regex routes and listens on port `3000`. citeturn138947view2

---

## Routes-callback

```bash
cd Routes-callback
npm install
node index.js
```

The example listens on:

```text
http://localhost:3000
```

The active route is:

```text
GET /cbexample3
```

which demonstrates an array of callbacks. citeturn510191view0turn656346view1

---

## Serving-static-files

```bash
cd Serving-Static-files
npm install
node index.js
```

The server listens on:

```text
http://localhost:5000
```

The application exposes the `public` directory and explicitly serves the root HTML file. citeturn490865view0

---

## Template-engine-setup

```bash
cd Template-engine-setup
npm install
node index.js
```

The server listens on:

```text
http://localhost:8000
```

Routes include:

```text
GET /
GET /about
```

The router forwards requests to controllers, and controllers render EJS templates. citeturn382549view0turn890099view0

---

# 60. Concept-to-folder map

| Concept | Folder/file | Main idea |
|---|---|---|
| Express app | `/index.js` | `express()` |
| Basic middleware | `/index.js` | `app.use()` |
| Basic routes | `/index.js` comments | `app.get()` |
| HTTP methods | `/index.js` comments | GET/POST/PUT/PATCH/DELETE/ALL |
| Regex routing | `/index.js` | regex path matching |
| Callback chains | `/Routes-callback/index.js` | multiple callbacks |
| `next()` | `/Routes-callback/index.js` | continue the middleware chain |
| Callback arrays | `/Routes-callback/index.js` | reusable callbacks |
| Static files | `/Serving-Static-files/index.js` | `express.static()` |
| Specific file response | `/Serving-Static-files/index.js` | `res.sendFile()` |
| EJS setup | `/Template-engine-setup/index.js` | `app.set()` |
| Router | `/Template-engine-setup/routes/web.js` | `express.Router()` |
| Controllers | `/Template-engine-setup/controllers` | request handling |
| Views | `/Template-engine-setup/views` | EJS templates |
| Public assets | `/Template-engine-setup/public` | CSS/static assets |

---

# 61. Learning path

A good order for studying this repository is:

### Step 1 — Express basics

Start with:

```text
index.js
```

Understand:

- `express()`
- `app`
- `app.use()`
- `app.get()`
- `app.listen()`

### Step 2 — Routing

Continue with:

```text
Routes-callback/
```

Understand:

- route handlers
- multiple callbacks
- `next()`
- callback arrays

### Step 3 — Route matching

Return to:

```text
index.js
```

Understand:

- regex routes
- route patterns
- matching rules

### Step 4 — Static assets

Study:

```text
Serving-Static-files/
```

Understand:

- `express.static()`
- public directories
- `res.sendFile()`
- file paths

### Step 5 — Application organization

Study:

```text
Template-engine-setup/
```

Understand:

- routers
- controllers
- views
- EJS
- static assets
- separation of concerns

---

# 62. The full Express mental model

Once all repository examples are connected, the application flow looks like this:

```text
                    HTTP Request
                         │
                         ▼
                    Express App
                         │
                         ▼
                  Global Middleware
                         │
              ┌──────────┴──────────┐
              │                     │
              ▼                     ▼
       Static Middleware          Router
              │                     │
              │                     ▼
              │               Route Handler
              │                     │
              │                     ▼
              │                 Controller
              │                     │
              │                     ▼
              │                  EJS View
              │                     │
              └─────────────┬───────┘
                            ▼
                       HTTP Response
                            │
                            ▼
                         Browser
```

This is the most important architecture to understand from the repository.

---

# 63. Middleware mental model

Think of middleware as a chain:

```text
Request
  │
  ▼
[Logger]
  │
 next()
  ▼
[Authentication]
  │
 next()
  ▼
[Validation]
  │
 next()
  ▼
[Controller]
  │
  ▼
Response
```

A middleware may:

```text
inspect
modify
reject
continue
respond
```

This flexibility is one of Express's core ideas.

---

# 64. Router mental model

A router is a smaller routing unit:

```text
app
 │
 ├── /api/users
 │      └── userRouter
 │
 ├── /
 │      └── webRouter
 │
 └── /admin
        └── adminRouter
```

This keeps a growing application organized.

---

# 65. Controller mental model

A controller should generally answer:

> What should happen for this request?

For example:

```js
const getHome = (req, res) => {
  res.render("index");
};
```

As the application grows, the controller might:

```text
receive request
     │
     ▼
validate input
     │
     ▼
call service
     │
     ▼
get data
     │
     ▼
send response
```

The repository's controllers are deliberately simple because the project is teaching the architecture rather than databases or business logic. citeturn490865view1turn890099view1

---

# 66. View mental model

The view answers:

> How should the result be presented?

In this repository:

```text
controllers/
    │
    ▼
res.render(...)
    │
    ▼
views/*.ejs
```

This separates presentation from request routing.

---

# 67. Static vs EJS architecture

A useful comparison:

```text
STATIC
Browser
  │
  ▼
express.static()
  │
  ▼
public/file.css
```

versus:

```text
SERVER RENDERING
Browser
  │
  ▼
Router
  │
  ▼
Controller
  │
  ▼
res.render()
  │
  ▼
views/file.ejs
  │
  ▼
HTML
```

The repository intentionally teaches both approaches.

---

# 68. Practical exercises

After reading the examples, build these incrementally.

## Exercise 1 — Add a contact route

Add:

```text
GET /contact
```

and return a response.

---

## Exercise 2 — Add a route parameter

Implement:

```text
GET /users/:id
```

and display the ID.

Example:

```text
/users/42
```

should return:

```text
User ID: 42
```

---

## Exercise 3 — Add a query string

Implement:

```text
/search?q=express
```

and read:

```js
req.query.q
```

---

## Exercise 4 — Add a JSON API

Create:

```text
GET /api/users
```

and return:

```json
[
  {
    "id": 1,
    "name": "John"
  },
  {
    "id": 2,
    "name": "Jane"
  }
]
```

---

## Exercise 5 — Add JSON request parsing

Add:

```js
app.use(express.json());
```

Then create:

```text
POST /api/users
```

and inspect:

```js
req.body
```

---

## Exercise 6 — Pass data into EJS

Change the controller:

```js
res.render("index", {
  title: "Express Learning",
  message: "Hello from EJS"
});
```

Then use:

```ejs
<h1><%= title %></h1>
<p><%= message %></p>
```

---

## Exercise 7 — Add a shared middleware

Create:

```js
const logger = (req, res, next) => {
  console.log(req.method, req.url);
  next();
};
```

Register it with:

```js
app.use(logger);
```

---

## Exercise 8 — Add a 404 page

At the end of the application:

```js
app.use((req, res) => {
  res.status(404).send("404 - Page Not Found");
});
```

---

## Exercise 9 — Add error middleware

Create a centralized:

```js
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong");
});
```

---

## Exercise 10 — Refactor the application

Turn:

```text
index.js
```

into:

```text
app.js
server.js
routes/
controllers/
services/
views/
public/
```

This is the point at which the small repository examples start becoming a real application architecture.

---

# 69. What this repository does not yet cover

This repository is focused on Express fundamentals. It does not currently demonstrate a complete production API stack.

Natural next concepts include:

- middleware architecture
- centralized error handling
- request validation
- REST API design
- JSON body parsing
- query parameters
- route parameters
- authentication
- authorization
- cookies
- sessions
- file uploads
- CORS
- security headers
- rate limiting
- logging
- databases
- services/repositories
- automated tests
- environment configuration
- API documentation
- deployment

These are extensions of the concepts already introduced here.

---

# 70. Production-oriented improvements

For a more complete Express application, consider adding:

## Environment variables

Use:

```text
process.env.PORT
process.env.NODE_ENV
```

rather than hard-coding configuration everywhere.

---

## Error handling

Use centralized error middleware instead of repeating error logic in every route.

---

## Validation

Validate:

```text
params
query
body
headers
```

before business logic runs.

---

## Security

Production applications should consider:

```text
HTTPS
secure headers
input validation
authentication
authorization
rate limiting
safe cookie settings
dependency updates
```

---

## Logging

A real application benefits from structured logs rather than only:

```js
console.log(...)
```

---

## Testing

Test:

```text
routes
controllers
services
error behavior
authentication
```

with an automated test suite.

---

# 71. Express 5 note

The repository currently declares:

```json
"express": "^5.2.1"
```

The official Express repository currently lists Express 5.2.1 as its latest release in the source checked for this guide. citeturn750825search5turn750825search7

That matters because tutorials written for older Express versions may contain differences in behavior or recommended patterns.

When reading external tutorials, check whether they are written for Express 4 or Express 5.

---

# 72. Quick reference

## Application

```js
const app = express();

app.listen(3000);
```

## Middleware

```js
app.use((req, res, next) => {
  next();
});
```

## Routes

```js
app.get(path, handler);
app.post(path, handler);
app.put(path, handler);
app.patch(path, handler);
app.delete(path, handler);
app.all(path, handler);
```

## Response

```js
res.send(...)
res.json(...)
res.status(...)
res.sendFile(...)
res.render(...)
res.redirect(...)
```

## Request

```js
req.params
req.query
req.body
req.headers
req.method
req.url
```

## Static files

```js
app.use(express.static("public"));
```

## Router

```js
const router = express.Router();

router.get("/", handler);

app.use("/", router);
```

## EJS

```js
app.set("views", "./views");
app.set("view engine", "ejs");

res.render("index", data);
```

## Middleware chain

```js
(req, res, next) => {
  next();
}
```

---

# 73. Final mental model

When you see an Express application, try to identify these layers:

```text
1. App
   │
   ▼
2. Middleware
   │
   ▼
3. Router
   │
   ▼
4. Route
   │
   ▼
5. Controller
   │
   ▼
6. Service / Data layer
   │
   ▼
7. Response
   │
   ├── JSON
   ├── HTML
   ├── EJS
   ├── File
   └── Redirect
```

For this repository specifically, the main progression is:

```text
Express App
    ↓
Middleware
    ↓
Basic Routing
    ↓
Route Callbacks
    ↓
next()
    ↓
Callback Arrays
    ↓
Regex Routing
    ↓
Static Files
    ↓
Router
    ↓
Controllers
    ↓
EJS Views
    ↓
Routes → Controllers → Views architecture
```

Once you understand that flow, the repository stops being a collection of isolated examples and becomes a small introduction to how Express applications are structured.

---

## Repository

Original repository:

[Shrey5112/ExpressJs](https://github.com/Shrey5112/ExpressJs)

This README is designed as a learning companion for the code in that repository. It explains the concepts represented by the current examples and adds the next concepts needed to understand how those examples develop into a maintainable Express application.
