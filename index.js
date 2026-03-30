import express from "express";
const app = express();
app.use(express.json());

let todo = [];

app.get("/", (req, res) => {
  res.send({ message: "Home Page" });
});

app.get("/todos", (req, res) => {
  res.send(todo);
});

app.post("/todo", (req, res) => {
  const getTodo = req.body;
  todo.push({ ...getTodo, id: generateID(8) });
  res.send("added Sussecfully");
});

app.put("/todo/:id", (req, res) => {
  const getTodo = req.body;
  const { id } = req.params;

  const editedTodo = todo.map((item) => {
    if (item.id == id) {
      return { ...item, ...getTodo, id: item.id };
    }
    return item;
  });
  todo = editedTodo;
  res.status(200).json({
    message: "Edited Successfully",
    data: todo,
  });
});

app.delete("/todo/:id", (req, res) => {
  const { id } = req.params;
  todo = todo.filter((todo) => todo.id !== id);
  console.log(todo, id);

  res.send("Deleted Sussecfully");
});

app.listen(3000, () => {
  console.log("Server Started");
});

function generateID(length = 10) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}
