// src/components/KanbanBoard.jsx
import React, { useState, useEffect, useCallback } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import Column from "./Column"; // Ensure correct path
import TaskModal from "./TaskModal"; // Ensure correct path
import styled from "styled-components";

const BoardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  gap: 20px;
  flex-wrap: wrap;
`;

const Header = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
`;

const AddTaskButton = styled.button`
  padding: 10px 20px;
  font-size: 1em;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 20px;
  &:hover {
    background-color: #0056b3;
  }
`;

const initialColumns = {
  new: {
    id: "new",
    title: "New",
    status: "New",
  },
  inProgress: {
    id: "inProgress",
    title: "In Progress",
    status: "In Progress",
  },
  completed: {
    id: "completed",
    title: "Completed",
    status: "Completed",
  },
};

export default function KanbanBoard() {
  const [allTasks, setAllTasks] = useState([]); // Initialize as an empty array
  const [columns, setColumns] = useState(initialColumns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const fetchAndSetInitialData = useCallback(() => {
    setIsLoading(true);
    console.log("Fetching initial data from API...");
    fetch("https://jsonplaceholder.typicode.com/todos?_limit=6")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        console.log("API data received:", json);
        const transformedTasks = json.map((apiTask, index) => ({
          id: uuidv4(),
          title: apiTask.title || "Untitled Task",
          description: `Sample description for task (API ID: ${apiTask.id}). Fetched from API.`,
          status: apiTask.completed ? "Completed" : "New",
          creationDate: new Date().toISOString(),
          completionDate: apiTask.completed ? new Date().toISOString() : null,
          priority:
            index % 3 === 0 ? "High" : index % 3 === 1 ? "Medium" : "Low",
        }));
        setAllTasks(transformedTasks || []); // Ensure it's an array
        console.log("Transformed tasks for initial load:", transformedTasks);
      })
      .catch((error) => {
        console.error("Failed to fetch initial tasks from API:", error);
        setAllTasks([]); // Set to empty array on API failure
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    console.log("KanbanBoard mounted. Attempting to load tasks...");
    try {
      const storedTasksString = localStorage.getItem("kanbanTasks");
      if (storedTasksString) {
        console.log("Found tasks in localStorage:", storedTasksString);
        const storedTasks = JSON.parse(storedTasksString);
        if (mounted) {
          // Ensure storedTasks is an array, otherwise default to empty
          setAllTasks(Array.isArray(storedTasks) ? storedTasks : []);
          console.log("Tasks loaded from localStorage:", storedTasks);
        }
      } else {
        console.log("No tasks in localStorage. Fetching from API.");
        fetchAndSetInitialData();
      }
    } catch (error) {
      console.error("Error loading tasks from localStorage:", error);
      localStorage.removeItem("kanbanTasks");
      if (mounted) {
        console.log(
          "Cleared corrupted localStorage. Fetching from API as fallback."
        );
        fetchAndSetInitialData();
      }
    } finally {
      if (mounted) setIsLoading(false);
    }
    return () => {
      mounted = false;
    };
  }, [fetchAndSetInitialData]);

  useEffect(() => {
    // Only save if allTasks is an array and has been initialized (not in loading state if that matters)
    if (Array.isArray(allTasks) && !isLoading) {
      if (allTasks.length > 0) {
        console.log("Saving tasks to localStorage:", allTasks);
        localStorage.setItem("kanbanTasks", JSON.stringify(allTasks));
      } else if (localStorage.getItem("kanbanTasks")) {
        // Only remove if it exists
        console.log("All tasks removed or empty, clearing localStorage.");
        localStorage.removeItem("kanbanTasks");
      }
    }
  }, [allTasks, isLoading]);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    console.log("Drag ended:", result);

    if (!destination) {
      console.log("No destination, drag cancelled.");
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      console.log("Dragged to the same place, no change.");
      return;
    }

    // Ensure allTasks is an array before finding
    const task = Array.isArray(allTasks)
      ? allTasks.find((t) => t.id.toString() === draggableId)
      : undefined;
    if (!task) {
      console.error(
        "Dragged task not found with ID:",
        draggableId,
        "or allTasks is not an array."
      );
      return;
    }

    const newStatus = columns[destination.droppableId]?.status;
    if (!newStatus) {
      console.error("Invalid destination column ID:", destination.droppableId);
      return;
    }

    console.log(
      `Task "${task.title}" moved from "${task.status}" to "${newStatus}"`
    );

    const updatedTask = {
      ...task,
      status: newStatus,
      completionDate:
        newStatus === "Completed"
          ? new Date().toISOString()
          : task.status === "Completed" && newStatus !== "Completed"
          ? null
          : task.completionDate,
    };

    const newAllTasks = allTasks.map(
      (
        t // allTasks should be an array here due to prior checks
      ) => (t.id.toString() === draggableId ? updatedTask : t)
    );
    setAllTasks(newAllTasks);
  };

  const handleOpenModal = (task = null) => {
    console.log("Opening modal for task:", task);
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log("Closing modal.");
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = (taskData) => {
    console.log("Saving task data:", taskData);
    if (editingTask) {
      console.log("Updating existing task:", editingTask.id);
      // Ensure allTasks is an array
      const currentTasks = Array.isArray(allTasks) ? allTasks : [];
      const updatedTasks = currentTasks.map((task) =>
        task.id === editingTask.id ? { ...task, ...taskData } : task
      );
      setAllTasks(updatedTasks);
    } else {
      const newTask = {
        id: uuidv4(),
        ...taskData,
        status: "New",
        creationDate: new Date().toISOString(),
        completionDate: null,
      };
      console.log("Creating new task:", newTask);
      // Ensure allTasks is an array
      setAllTasks((prevTasks) =>
        Array.isArray(prevTasks) ? [newTask, ...prevTasks] : [newTask]
      );
    }
    handleCloseModal();
  };

  const handleDeleteTask = (taskId) => {
    console.log("Attempting to delete task:", taskId);
    if (window.confirm("Are you sure you want to delete this task?")) {
      // Ensure allTasks is an array
      setAllTasks((prevTasks) =>
        Array.isArray(prevTasks)
          ? prevTasks.filter((task) => task.id !== taskId)
          : []
      );
      console.log("Task deleted:", taskId);
    } else {
      console.log("Task deletion cancelled for:", taskId);
    }
  };

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }
  console.log(
    "Rendering KanbanBoard with tasks:",
    Array.isArray(allTasks) ? allTasks.length : "not an array"
  );

  return (
    <>
      <Header>
        <h1 style={{ margin: "20px 0" }}>My Task Manager</h1>
        <AddTaskButton onClick={() => handleOpenModal()}>
          Create New Task
        </AddTaskButton>
      </Header>
      <DragDropContext onDragEnd={handleDragEnd}>
        <BoardContainer>
          {Object.values(columns).map((column) => {
            // CRITICAL FIX: Ensure allTasks is an array before filtering
            const tasksInColumn = Array.isArray(allTasks)
              ? allTasks.filter((task) => task && task.status === column.status) // Add check for task itself
              : [];
            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasksInColumn}
                onEditTask={handleOpenModal}
                onDeleteTask={handleDeleteTask}
              />
            );
          })}
        </BoardContainer>
      </DragDropContext>
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        taskData={editingTask}
      />
    </>
  );
}
