import './App.css';
import { useState } from 'react';

function App() {
  const [columns, setColumns] = useState({
    new: {
      name: 'New',
      items: [],
    },
    inProgress: {
      name: 'In Progress',
      items: [],
    },
    completed: {
      name: 'Done',
      items: [],
    },
  });


  const [newTask, setNewTask] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('Medium');
  const [activeColumn, setActiveColumn] = useState('new');
  const [draggedItem, setDraggedItem] = useState(null);

  const addNewTask = () => {
    if (newTask.trim() === '') return;

    const updatedColumns = { ...columns };

    updatedColumns[activeColumn].items.push({
      id: Date.now().toString(),
      content: newTask,
      priority: selectedPriority,
    });

    setColumns(updatedColumns);
    setNewTask('');
  };

  const removeTask = (columnId, taskId) => {
    const updatedColumns = { ...columns };

    updatedColumns[columnId].items = updatedColumns[columnId].items.filter(
      (item) => item.id !== taskId
    );

    setColumns(updatedColumns);
  };
  
 const handleDragStart = (columnId, item) => {
  if (columnId === 'completed') return;
  setDraggedItem({ columnId, item });
};

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { columnId: sourceColumnId, item } = draggedItem;
    if (sourceColumnId === columnId) return;

    const updatedColumns = { ...columns };

    updatedColumns[sourceColumnId].items = updatedColumns[sourceColumnId].items.filter(
      (i) => i.id !== item.id
    );

    updatedColumns[columnId].items.push(item);

    setColumns(updatedColumns);
    setDraggedItem(null);
  };

  const getPriorityColor = (priority) => {
    return priority === 'High'
      ? 'bg-red-400 text-white'
      : priority === 'Medium'
      ? 'bg-yellow-300 text-black'
      : 'bg-green-300 text-black';
  };

  return (
    <>

      <div className="p-6 w-full min-h-screen flex items-center justify-center bg-white">
        <div className="flex items-center justify-center flex-col gap-4 w-full max-w-6xl">
          <h1 className="text-6xl font-bold mb-8 text-black">Task Manager</h1>

          <div className="mb-8 flex w-full max-w-lg shadow-lg rounded-lg overflow-hidden bg-gray-100">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new Task..."
              className="flex-grow p-3 bg-white text-black border border-gray-400"
              onKeyDown={(e) => e.key === 'Enter' && addNewTask()}
            />
         

            <select
              value={activeColumn}
              onChange={(e) => setActiveColumn(e.target.value)}
              className="text-black"
            >
              {Object.keys(columns).map((columnId) => (
                <option value={columnId} key={columnId}>
                  {columns[columnId].name}
                </option>
              ))}
            </select>

            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="text-black "
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
                <button onClick={addNewTask} className="px-8 py-3 text-white cursor-pointer">
              Add
            </button>

           
          </div>

          <div className="flex gap-6 overflow-x-auto pb-6 w-full">
            {Object.keys(columns).map((columnId) => (
              <div
                key={columnId}
                className="flex-shrink-0 w-80 min-h-[500px] bg-gray-300 rounded-lg shadow-xl border-t-4"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, columnId)}
              >

                <div className="p-4 text-black font-bold text-xl rounded-t-md bg-gray-400">
                  {columns[columnId].name}
                </div>

                <div className="p-3 min-h-64">
                  {columns[columnId].items.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 italic text-sm">
                    </div>
                  ) : (
                    columns[columnId].items.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 mb-3 rounded-lg shadow-md cursor-move ${getPriorityColor(item.priority)}`}
                        draggable
                        onDragStart={() => handleDragStart(columnId, item)}
                      >
                        <span className="mr-2">{item.content}</span>
                        <span className="ml-2 px-2 py-1 rounded-full bg-gray-800 text-white text-xs">
                          {item.priority}
                        </span>
                        <button
                          onClick={() => removeTask(columnId, item.id)}
                          // className="ml-auto text-gray-400 hover:text-red-400 transition-colors duration-200 w-6 flex items-center justify-center rounded-full hover:bg-gray-600"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
