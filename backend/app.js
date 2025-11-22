const express = require("express");
const app = express();
const PORT = 1000;
const cors = require("cors");

// 🔑 SOLUTION: Place Middleware at the beginning
app.use(cors({ origin: "http://localhost:3000", credentials: true }))
 // Enable CORS first, to handle requests from the frontend origin
app.use(express.json()); // Enable JSON body parser *before* the routes are hit

//connections with db
require("./conn/conn");

//authentication
const auth = require("./routes/auth");

//list??
const list = require("./routes/list");


//Route
app.get("/", (req, res) => {
    res.send("Hello");
});

//Start Server - Now the routes will have access to req.body
app.use("/api/v1", auth);
app.use("/api/v2", list);

app.listen(PORT, () => {
    console.log("Server started on port", PORT);
});