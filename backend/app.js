const express = require("express");
const app = express();
const PORT = 1000;

//connections with db
require("./conn/conn");

//authentication
const auth = require("./routes/auth");

//list??
const list = require("./routes/list");

app.use(express.json());


//Route
app.get("/", (req, res) => {
    res.send("Hello");
});

//Start Server
app.use("/api/v1", auth);
app.use("/api/v2", list);

app.listen(PORT, () => {
    console.log("Server started");
});