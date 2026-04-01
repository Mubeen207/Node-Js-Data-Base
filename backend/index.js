import express from "express";
import cors from "cors";
const app = express();
app.use(cors({ origin: "http://localhost:3001" }));
app.use(express.json());

let todo = [];

function generateID(length = 8) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

app.get("/", (req, res) => {
  res.send({ message: "Home Page" });
});

app.get("/todos", (req, res) => {
  res.send(todo);
});

app.post("/todo", (req, res) => {
  const getTodo = req.body;
  const newTodo = { ...getTodo, id: generateID(8) };
  todo.push(newTodo);
  res.status(201).json("Added Successfully").send();
});

app.put("/todo/:id", (req, res) => {
  const getTodo = req.body;
  const { id } = req.params;

  todo = todo.map((item) => {
    if (item.id === id) {
      return { ...item, ...getTodo, id: item.id };
    }
    return item;
  });

  res.status(200).json({
    message: "Edited Successfully",
  });
});

app.delete("/todo/:id", (req, res) => {
  const { id } = req.params;
  todo = todo.filter((item) => item.id !== id);
  res.send({ message: "Deleted Successfully" });
});

app.listen(5000, () => {
  console.log("Server Started at http://localhost:5000");
});
