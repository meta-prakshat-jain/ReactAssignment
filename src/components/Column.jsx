import React from "react";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import Task from "./Task";

const StyledContainer = styled.div`
  background-color: #f4f5f7;
  border-radius: 5px;
  width: 320px;
  min-height: 500px;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  border: 1px solid #d3d3d3;
  margin: 0 8px;
`;

const Title = styled.h3`
  padding: 12px;
  background-color: #e0e0e0;
  text-align: center;
  margin: 0;
  border-bottom: 1px solid #d3d3d3;
  font-size: 1.1em;
  color: #333;
`;

// Note the $isDraggingOver prop
const TaskList = styled.div`
  padding: 8px;
  transition: background-color 0.2s ease;
  background-color: ${(props) =>
    props.$isDraggingOver ? "#e6f7ff" : "#f4f5f7"}; // Use $isDraggingOver
  flex-grow: 1;
  min-height: 100px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export default function Column({ column, tasks, onEditTask, onDeleteTask }) {
  return (
    <StyledContainer>
      <Title>{column.title}</Title>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <TaskList
            ref={provided.innerRef}
            {...provided.droppableProps}
            // Pass it as $isDraggingOver
            $isDraggingOver={snapshot.isDraggingOver}
          >
            {/* Ensure tasks is an array before mapping */}
            {Array.isArray(tasks) &&
              tasks.map((task, index) => (
                <Task
                  key={task?.id || `task-${index}`} // Add fallback key if task or task.id is undefined
                  task={task}
                  index={index}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              ))}
            {provided.placeholder}
          </TaskList>
        )}
      </Droppable>
    </StyledContainer>
  );
}
