// import express from "express";
// import cors from "cors";
// const app = express();
// app.use(cors({ origin: "http://localhost:3000" }));
// app.use(express.json());

// let todo = [];

// function generateID(length = 8) {
//   const chars =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   let result = "";
//   for (let i = 0; i < length; i++) {
//     result += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return result;
// }

// app.get("/", (req, res) => {
//   res.send({ message: "Home Page" });
// });

// app.get("/todos", (req, res) => {
//   res.send(todo);
// });

// app.post("/todo", (req, res) => {
//   const getTodo = req.body;
//   const newTodo = { ...getTodo, id: generateID(8) };
//   todo.push(newTodo);
//   res.status(201).json("Added Successfully").send();
// });

// app.put("/todo/:id", (req, res) => {
//   const getTodo = req.body;
//   const { id } = req.params;

//   todo = todo.map((item) => {
//     if (item.id === id) {
//       return { ...item, ...getTodo, id: item.id };
//     }
//     return item;
//   });

//   res.status(200).json({
//     message: "Edited Successfully",
//   });
// });

// app.delete("/todo/:id", (req, res) => {
//   const { id } = req.params;
//   todo = todo.filter((item) => item.id !== id);
//   res.send({ message: "Deleted Successfully" });
// });

// app.listen(5000, () => {
//   console.log("Server Started at http://localhost:5000");
// });
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
const uri = process.env.MONGO_URI;
mongoose
  .connect(uri)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log("Connection Error", err.message));
const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Todo = mongoose.model("Todo", todoSchema);

app.get("/", (req, res) => {
  res.send({ message: "Home Page" });
});

app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/todo", async (req, res) => {
  try {
    const newTodo = new Todo({ title: req.body.title });
    const savedTodo = await newTodo.save();

    res
      .status(201)
      .json({ message: "Todo Added Successfully!", data: savedTodo });
  } catch (error) {
    res.status(400).json({ message: "Error saving todo" });
  }
});

app.put("/todo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTodo = await Todo.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedTodo)
      return res.status(404).json({ message: "Todo not found" });

    res.status(200).json({ message: "Edited Successfully", data: updatedTodo });
  } catch (error) {
    res.status(400).json({ message: "Invalid ID or Data" });
  }
});

app.delete("/todo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    res.send({ message: "Deleted Successfully" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting todo" });
  }
});

app.listen(5000, () => {
  console.log("Server Started at http://localhost:5000");
});
