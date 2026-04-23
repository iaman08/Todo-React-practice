import { useState, useEffect, useRef } from 'react'

import './App.css'

function App() {
  const [tasks, setTasks] = useState(()=>{
    const saved = localStorage.getItem("tasks")
    return saved ? JSON.parse(saved):[]
  })

  const inputRef = useRef(null);

  useEffect(()=>{localStorage.setItem("tasks", JSON.stringify(tasks))},[tasks])
  useEffect(()=>{ inputRef.current.focus()},[]);


  const [inputValue, setInputValue] = useState("");

  function addTask(){
    if(!inputValue.trim()) return 
    setTasks([...tasks, {
    id: Date.now(), title: inputValue, priority:"medium"
      }])
      setInputValue("");
  }
  
  

  function deleteTask(id){
     setTasks(tasks.filter(task => task.id !== id))
  }

  function updateTask(id){
    setTasks(tasks.map({id: Date.now(),title: inputValue, priority:"medium"}))
  }

  return (
    <>
    <div style={{ padding:"24px", fontFamily: "sans-serif"}}>
    <h1>⚡Kanban Board</h1>

    <div style={{ marginBottom: "16px"}}>
      <input ref={inputRef} value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Enter a task.." style={{ padding: "8px", marginRight: "8px"}}/>
      <button onClick={addTask}>ADD TASK</button>

    </div>

    {tasks.map(task => (
       <div key={task.id} style={{
        padding:"10px",
        marginBottom:"8px",
        border:"1px solid #ccc",
        borderRadius:"8px",
      }}>
        <span>{task.title}</span>
        <button onClick={() => deleteTask(task.id)} style={{marginLeft:"12px",color: "red"}}> DELETE
        </button>
        </div>
    ))}
    </div>
    </>
  )
}

export default App
