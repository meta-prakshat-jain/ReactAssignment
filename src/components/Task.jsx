import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { FaEdit, FaTrash } from "react-icons/fa"; // For icons

const getPriorityColor = (priority) => {
  switch (priority) {
    case "High":
      return "#FFD2D2"; // Light Red
    case "Medium":
      return "#FFFACD"; // Lemon Chiffon (Light Yellow)
    case "Low":
      return "#D4EFDF"; // Light Green
    default:
      return "#EAEAEA"; // Default Grey
  }
};

const Container = styled.div`
  border-radius: 10px;
  box-shadow: 3px 3px 5px 1px rgba(0, 0, 0, 0.1);
  padding: 12px;
  color: #333;
  margin-bottom: 10px;
  min-height: 150px; /* Adjusted min-height */
  background-color: ${(props) =>
    props.isDragging ? "lightgreen" : getPriorityColor(props.priority)};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #ccc;
  font-size: 0.9em;
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const TaskId = styled.span`
  font-size: 0.8em;
  color: #555;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 2px 5px;
  border-radius: 3px;
`;

const PriorityBadge = styled.span`
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.75em;
  font-weight: bold;
  color: #fff;
  background-color: ${(props) => {
    if (props.priority === "High") return "#dc3545";
    if (props.priority === "Medium") return "#ffc107";
    if (props.priority === "Low") return "#28a745";
    return "#6c757d";
  }};
`;

const Title = styled.h4`
  margin: 0 0 8px 0;
  font-size: 1.1em;
`;

const Description = styled.p`
  font-size: 0.9em;
  color: #555;
  margin: 0 0 8px 0;
  word-wrap: break-word;
`;

const Dates = styled.div`
  font-size: 0.75em;
  color: #777;
  margin-top: auto; /* Pushes dates to the bottom if content is short */
`;

const Icons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #555;
  font-size: 1em;
  padding: 2px;
  &:hover {
    color: #000;
  }
`;

export default function Task({ task, index, onEdit, onDelete }) {
  if (!task) {
    return null; // Or some placeholder if a task is unexpectedly undefined
  }

  const isCompleted = task.status === "Completed";

  return (
    <Draggable
      draggableId={task.id.toString()}
      index={index}
      isDragDisabled={isCompleted}
    >
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
          priority={task.priority}
        >
          <div>
            <TaskHeader>
              <TaskId>#{task.id.toString().slice(0, 8)}</TaskId>
              <PriorityBadge priority={task.priority}>
                {task.priority}
              </PriorityBadge>
            </TaskHeader>
            <Title>{task.title}</Title>
            {task.description && <Description>{task.description}</Description>}
          </div>
          <Dates>
            <div>
              Created: {new Date(task.creationDate).toLocaleDateString()}
            </div>
            {task.completionDate && (
              <div>
                Completed: {new Date(task.completionDate).toLocaleDateString()}
              </div>
            )}
          </Dates>
          {!isCompleted && (
            <Icons>
              <IconButton onClick={() => onEdit(task)} aria-label="Edit task">
                <FaEdit />
              </IconButton>
              <IconButton
                onClick={() => onDelete(task.id)}
                aria-label="Delete task"
              >
                <FaTrash />
              </IconButton>
            </Icons>
          )}
          {provided.placeholder}
        </Container>
      )}
    </Draggable>
  );
}
