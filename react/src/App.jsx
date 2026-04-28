import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
  useContext,
  createContext
} from "react";
import "./App.css";

const TaskCard = memo(function TaskCard({
  task,
  editId,
  editValue,
  editPriority,
  inputValue,
  search,
  onEdit,
  onDelete,
  onSave,
  setEditValue,
  setEditPriority,
}) {
  return (
    <div
      style={{
        padding: "10px",
        marginBottom: "8px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
 
      { editId === task.id?(
        <>
          <input value={editValue} onChange={(e) => setEditValue(e.target.value)}/>
          <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
             <option value="low">Low</option>
             <option value="Medium">Medium</option>
             <option value="High">High</option>
          </select>

          <button onClick={() => onSave(task.id, editValue, editPriority)}>
            Save </button>
        </>
      ):(
        <>
          <span>{task.title}</span>
          <span style={{ marginLeft: "8px", fontSize: "12px", color: "gray"}}>
            [{ task.priority}]
          </span>
          <button onClick={()=> onEdit(task)}>Edit</button>
        </>
      )}

      <button onClick={() => onDelete(task.id)} style={{marginLeft: "12px", color: "red" }}>
        DELETE
      </button>

    </div>
  );
});

const ThemeContext = createContext();

export function ThemeProvider({children}){
    const [theme, setTheme] = useState("light")

    const toggleTheme = useCallback(()=>{
      setTheme(prev => prev === "light" ? "dark" : "light")
    },[])

    return(
      <ThemeContext.Provider value={{ theme, toggleTheme}}>
          {children}
      </ThemeContext.Provider>
    )
}

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
  }, []);          //local storage

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

  const updateTask = useCallback(
    (id, newTitle, newPriority) => {
      setTasks(
        tasks.map((task) => {
          return task.id === id
            ? { ...task, title: newTitle, priority: newPriority }
            : task;
        }),
      );
    },
    [tasks],
  );

  const [editId, setEditId] = useState();
  const [editValue, setEditValue] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const { theme, toggleTheme} = useContext(ThemeContext);

  const handleEdit = useCallback((task)=>{
    setEditId(task.id);
    setEditValue(task.title);
    setEditPriority(task.priority);
  },[]);

 const handleSave = useCallback((id, newTitle,newPriority)=>{
  updateTask(id, newTitle, newPriority);
  setEditId(null)
 },[updateTask])

  return (
    <>
      <div style={{ padding: "24px",
       fontFamily: "sans-serif",
       minHeight: "100vh",
       background: theme ==="dark"? "#ff1b67" : "#ffffff",
       color: theme === "dark"? "#ffffff" : "#000000" }}>

      
        <h1>⚡Kanban Board</h1>
        <button onClick={toggleTheme}>{ theme === "light" ?"DARK" : "Light" }</button>
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


          { filteredTasks.map((task)=>(
            <TaskCard 
              key={task.id}
              task={task}
              editValue={editValue}
              editId={editId}
              editPriority={editPriority}
              onDelete={deleteTask}
              onEdit={handleEdit}
              onSave={handleSave}
              setEditValue={setEditValue}
              setEditPriority={setEditPriority}
              />
          ))}
      </div>
    </>
  )
}

export default App;
