import express from "express";

const app = express();
app.use(express.json());

const todo = [];

app.get("/", (req, res) => {
  res.send({ message: "Home Page" });
});

app.get("/todos", (req, res) => {
  res.send(todo);
});

app.post("/todo", (req, res) => {
  const todo = req.body;
  todo.push({ ...todo, id: todo.length + 1 });
  res.send("added Sussecfully");
});

app.listen(3000, () => {
  console.log("Server Started");
});
