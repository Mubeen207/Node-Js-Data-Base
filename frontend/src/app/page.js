"use client";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [todoInput, setTodoInput] = useState("");
  const [edit, isEdit] = useState(false);
  const [todos, setTodos] = useState([]);
  const [isId, setIsID] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/todos");
      if (!res.ok) throw new Error("Server response issues");
      const data = await res.json();
      setTodos(data);
    } catch (error) {
      console.log("Server is not connecting...", error.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (todoInput === "") return alert("Please Enter Todo");
    const response = await fetch("http://localhost:5000/todo", {
      method: "POST",
      body: JSON.stringify({
        title: todoInput,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    alert(data.message);
    setTodoInput("");
    isEdit(false);
    setIsID("");
    fetchData();
  };
  const haldleUpdate = async () => {
    if (todoInput === "") return alert("Please Enter Todo");
    const response = await fetch(`http://localhost:5000/todo/${isId}`, {
      method: "PUT",
      body: JSON.stringify({ title: todoInput }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    alert(data.message);
    setTodoInput("");
    isEdit(false);
    setIsID("");
    fetchData();
  };
  const haldleEdit = (todo) => {
    isEdit(true);
    setTodoInput(todo.title);
    setIsID(todo._id);
  };
  const handleDelete = async (todo) => {
    const response = await fetch(`http://localhost:5000/todo/${todo._id}`, {
      method: "DELETE",
      params: JSON.stringify({
        id: isId,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    alert(data.message);
    setTodoInput("");
    isEdit(false);
    setIsID("");
    fetchData();
  };
  return (
    <>
      <div>Todo Application</div>
      <input
        type="text"
        value={todoInput}
        onChange={(e) => setTodoInput(e.target.value)}
        placeholder="Enter Todo"
      />
      {edit ? (
        <button onClick={haldleUpdate}>Update</button>
      ) : (
        <button onClick={handleAdd}>Add</button>
      )}
      <ul>
        {todos.map((todo) => {
          return (
            <li key={todo._id}>
              <div>{todo.title}</div>
              <button onClick={() => haldleEdit(todo)}>Edit</button>
              <button onClick={() => handleDelete(todo)}>Delete</button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
