const express = require("express");
require("../db/mongoose");
const admainRouter = require("../routers/admin");
const eventRouter = require("../routers/event");

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(admainRouter);
app.use(eventRouter);

app.listen(port, () => {
  console.log("server up on ", port);
});
