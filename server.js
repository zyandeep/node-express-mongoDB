require("dotenv").config();

const express = require("express");
const router = require("./router");

const app = express();

app.use(express.static("./public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use("/", router);


app.listen(process.env.PORT, () => {
  console.log("server started at port 3000");
  
});
