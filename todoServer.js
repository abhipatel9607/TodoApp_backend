const fs = require("fs");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const port = 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json());

// 01- Get All List of Data
app.get("/todos", (req, res) => {
  fs.readFile("./todos.txt", "utf-8", (err, data) => {
    if (err) console.error(err);
    let myData = JSON.parse(data);
    res.json(myData);
  });
});

// 02- Get Specific data by Unique-ID
app.get("/todos/:id", (req, res) => {
  fs.readFile("./todos.txt", "utf-8", (err, data) => {
    if (err) console.error(err);
    let myData = JSON.parse(data);
    let id = req.params.id;
    let todoToSend = myData.find((e) => id == e.id);
    if (todoToSend) {
      res.json(todoToSend);
    } else {
      res.status(404).send();
    }
  });
});

// 03- Create New TODO
app.post("/todos", (req, res) => {
  fs.readFile("./todos.txt", "utf-8", (err, data) => {
    if (err) console.error(err);
    let myData = JSON.parse(data);
    let todo = {};
    let uniqueId = `${Date.now()}`;
    todo.title = req.body.title;
    todo.description = req.body.description;
    todo.status = "Not Done";
    todo.id = uniqueId;
    myData.push(todo);
    fs.writeFile("./todos.txt", JSON.stringify(myData), "utf-8", (err) => {
      if (err) console.error(err);
      res.status(201).send("Todo Saved");
    });
  });
});

// 04- Edit Specific Todo by Unique-ID
app.put("/todos/:id", (req, res) => {
  fs.readFile("./todos.txt", "utf-8", (err, data) => {
    if (err) console.error(err);
    let myData = JSON.parse(data);
    let id = req.params.id;
    let index = myData.findIndex((e) => e.id == id);
    if (index === -1) {
      res.status(404).send();
    } else {
      myData[index].title = req.body.title;
      myData[index].description = req.body.description;
      myData[index].status = req.body.status;
      fs.writeFile("./todos.txt", JSON.stringify(myData), "utf-8", (err) => {
        if (err) console.error(err);
        res.status(200).send("Todo Updated");
      });
    }
  });
});

// 05- Delete Specific Todo by Unique-ID
app.delete("/todos/:id", (req, res) => {
  fs.readFile("./todos.txt", "utf-8", (err, data) => {
    if (err) console.error(err);
    let myData = JSON.parse(data);
    let id = req.params.id;
    let index = myData.findIndex((e) => e.id == id);
    if (index === -1) {
      res.status(404).send();
    } else {
      myData.splice(index, 1);
      fs.writeFile("./todos.txt", JSON.stringify(myData), "utf-8", (err) => {
        if (err) console.error(err);
        res.status(200).send("Todo Deleted");
      });
    }
  });
});

// 06- Hndle wrong route
app.get("*", (req, res) => {
  res.status(404).send("Route not found");
});

// Live Server On
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
module.exports = app;
