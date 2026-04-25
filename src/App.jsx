import { useState, useEffect, useRef, useCallback, useMemo, memo } from "react";

import "./App.css";



function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");

  const addTask = useCallback(() => {
    if (!inputValue.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title: inputValue,
        priority: "medium",
      },
    ]);
    setInputValue("");
  }, [tasks, inputValue]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [tasks, search]);

  const deleteTask = useCallback(
    (id) => {
      setTasks(tasks.filter((task) => task.id !== id));
    },
    [tasks],
  );

  const updateTask = useCallback((id, newTitle, newPriority) => {
     setTasks(tasks.map((task)=>{
        return task.id === id?{ ...task, title: newTitle, priority: newPriority } : task
     }))
  },[tasks]);


  const [editId, setEditId] = useState();
  const [editValue,setEditValue] = useState("");
  const [editPriority, setEditPriority] = useState("medium");

  return (
    <>
      <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
        <h1>⚡Kanban Board</h1>

        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          placeholder="Search Texts.."
          style={{ padding: "8px", marginBottom: "16px", display: "block" }}
        />

        <div style={{ marginBottom: "16px" }}>
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter a task.."
            style={{ padding: "8px", marginRight: "8px" }}
          />
          <button onClick={addTask}>ADD TASK</button>
        </div>
           



            {/* search button */}

        {filteredTasks.map((task) => (
          <div
            key={task.id}
            style={{
              padding: "10px",
              marginBottom: "8px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            
            { editId === task.id ?(
              <>
                <input value={editValue} onChange={(e)=> setEditValue(e.target.value)} />
                <select value={editPriority} onChange={(e)=> setEditPriority(e.target.value)}>
                   <option value="low">Low</option>
                   <option value="medium">Medium</option>
                   <option value="high">High</option>
                 </select>
                  <button onClick={()=>{
                    updateTask(task.id, editValue, editPriority)
                    setEditId(null)
                  }}>Save</button>
                  
              </>
            ):(
              <>
                <span>{task.title}</span>
                <button onClick={()=>{
                  setEditId(task.id)
                  setEditValue(task.title)
                  setEditPriority(task.priority)
                }}>Edit</button>
              </>
            )}

            
            <button onClick={() => deleteTask(task.id)}
              style={{ marginLeft: "12px", color: "red" }}
            >
              {" "}
              DELETE
            </button>
          </div>
        ))}

       
      </div>
    </>
  );
}

export default App;
