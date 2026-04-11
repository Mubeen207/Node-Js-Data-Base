"use client";
import React, { useEffect, useState } from "react";
import toTitleCase from "@/components/titleCase";
export default function Home() {
  const [todoInput, setTodoInput] = useState("");
  const [edit, isEdit] = useState(false);
  const [todos, setTodos] = useState(null);
  const [isId, setIsID] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("https://ecommercedb-five.vercel.app/api/todos");
      if (!res.ok) throw new Error("Server response issues");
      const data = await res.json();
      setTodos(data.data);
    } catch (error) {
      console.log("Server is not connecting...", error.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (todoInput === "") return alert("Please Enter Todo");
    const response = await fetch("https://ecommercedb-five.vercel.app/api/todo", {
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
    const response = await fetch(`https://ecommercedb-five.vercel.app/api/todo/${isId}`, {
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
    try {
      const response = await fetch(`https://ecommercedb-five.vercel.app/api/todo/${todo._id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      setTodoInput("");
      isEdit(false);
      setIsID("");
      alert(data.message);
      fetchData();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };
  return (
    <>
    
      <title>Todo Application</title>
    
      <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center tracking-tight">
            Todo Application
          </h1>

          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={todoInput}
              onChange={(e) => setTodoInput(toTitleCase(e.target.value))}
              placeholder="What needs to be done?"
              className="flex-1 py-2.5 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium text-gray-700"
            />

            {edit ? (
              <button
                onClick={haldleUpdate}
                className="px-6 py-2.5 text-white font-bold bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all rounded-lg shadow-md  cursor-pointer"
              >
                Update
              </button>
            ) : (
              <button
                onClick={handleAdd}
                className="px-6 py-2.5 text-white font-bold bg-orange-800 hover:bg-orange-900 active:scale-95 transition-all rounded-lg shadow-md  cursor-pointer"
              >
                Add
              </button>
            )}
          </div>

          <ul className="space-y-3">
            {/* Pehle check karein ke data load ho raha hai ya nahi */}
            {!todos ? (
              <p className="text-center text-gray-500 py-4">Loading...</p>
            ) : todos.length > 0 ? (
              /* Agar data hai, to map karein */
              todos.map((todo) => (
                <li
                  key={todo._id}
                  className="group border border-gray-100 p-4 flex items-center justify-between bg-white rounded-lg hover:shadow-md transition-shadow mb-3"
                >
                  <div className="text-gray-800 font-semibold truncate pr-4">
                    {todo.title}
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-bold transition-colors text-sm cursor-pointer"
                      onClick={() => haldleEdit(todo)}
                    >
                      Edit
                    </button>
                    <button
                      className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg font-bold transition-colors text-sm cursor-pointer"
                      onClick={() => handleDelete(todo)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-center text-gray-400 py-4 italic text-sm">
                No tasks found. Add one!
              </p>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
