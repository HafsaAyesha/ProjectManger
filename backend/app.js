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

//projects
//projects
const project = require("./routes/project");
const projectWorkspace = require("./routes/projectWorkspace");
const milestone = require("./routes/milestone");


//Route
app.get("/", (req, res) => {
    res.send("Hello");
});

//Start Server - Now the routes will have access to req.body
app.use("/api/v1", auth);
app.use("/api/v2", list);
app.use("/api/v3", project);
app.use("/api/v3", projectWorkspace);
app.use("/api/v3", milestone);
app.use("/api/v3", require("./routes/documents"));
app.use("/api/v3", require("./routes/techLinks"));

app.listen(PORT, () => {
    console.log("Server started on port", PORT);
});