import { useState } from "react";

export default function DragAndDrop() {
    const [data, setData] = useState({
        "To Do": [],
        "In Progress": [],
        "Completed": [],
    });

    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [status, setStatus] = useState("To Do");
    const [priority, setPriority] = useState("Low");
    const [showForm, setShowForm] = useState(false);

    const addTask = () => {
        if (!taskTitle || !taskDescription) {
            alert("Please fill in all fields before adding a task!");
            return; 
        }

        const newTask = {
            title: taskTitle,
            description: taskDescription,
            status,
            priority,
        };

        setData({
            ...data,
            [status]: [...data[status], newTask],
        });

        setTaskTitle("");
        setTaskDescription("");
        setShowForm(false);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "High": return "#FF69B4"; 
            case "Medium": return "#87CEEB";
            case "Low": return "#00FFFF";
            default: return "#D3D3D3"; 
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            {}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h1 style={{ margin: 0 }}>My Task Manager</h1>
                <button onClick={() => setShowForm(!showForm)} style={{ padding: "10px" }}>
                    {showForm ? "Cancel" : "Add Task"}
                </button>
            </div>

            {}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
                {Object.keys(data).map((category, index) => (
                    <div
                        key={index}
                        style={{
                            background: "#f0f0f0",
                            padding: "1rem",
                            width: "280px",
                            minHeight: "300px",
                            borderRadius: "8px",
                        }}
                    >
                        <h2>{category}</h2>
                        {data[category].map((item, idx) => (
                            <div
                                key={idx}
                                style={{
                                    padding: "12px",
                                    margin: "8px 0",
                                    backgroundColor: getPriorityColor(item.priority),
                                    color: "black",
                                    borderRadius: "8px",
                                    textAlign: "center",
                                }}
                            >
                                <strong style={{ display: "block", textAlign: "center", fontSize: "1.2rem" }}>
                                    {item.title}
                                </strong>
                                <p>{item.description}</p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {}
            {showForm && (
                <div style={{ marginTop: "20px" }}>
                    <input
                        type="text"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder="Task Title"
                        style={{ padding: "8px", width: "250px", marginRight: "10px" }}
                    />
                    <input
                        type="text"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        placeholder="Task Description"
                        style={{ padding: "8px", width: "250px", marginRight: "10px" }}
                    />
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                    <button onClick={addTask} style={{ padding: "8px 12px", marginLeft: "10px" }}>
                        Submit Task
                    </button>
                </div>
            )}
        </div>
    );
}