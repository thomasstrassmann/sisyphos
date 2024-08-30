import React, { useRef, useState } from 'react';
import { ListGroup, Form, Button } from 'react-bootstrap';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';

interface TodoItemProps {
  todo: {
    id: number;
    text: string;
    completed: boolean;
    dueDate: Date | null;
  };
  index: number;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, newText: string) => void;
  setDueDate: (id: number, date: Date | null) => void;
  editingId: number | null;
  setEditingId: (id: number | null) => void;
  moveTodo: (dragIndex: number, hoverIndex: number) => void;
}

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  index,
  toggleTodo,
  deleteTodo,
  editTodo,
  setDueDate,
  editingId,
  setEditingId,
  moveTodo
}) => {
  const [editText, setEditText] = useState(todo.text);
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: string | symbol | null }>({
    accept: 'TODO_ITEM',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveTodo(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'TODO_ITEM',
    item: (): DragItem => {
      return { id: todo.id.toString(), index, type: 'TODO_ITEM' };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const isOverdue = todo.dueDate && new Date() > new Date(todo.dueDate);

  return (
    <ListGroup.Item
      as="div"
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      data-handler-id={handlerId}
      className={`d-flex justify-content-between align-items-center ${isOverdue ? 'bg-danger text-white' : ''}`}
    >
      {editingId === todo.id ? (
        <Form onSubmit={(e) => { e.preventDefault(); editTodo(todo.id, editText); }}>
          <Form.Control
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            autoFocus
          />
        </Form>
      ) : (
        <>
          <Form.Check
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
            label={todo.text}
          />
          <div>
            <Form.Control
              type="date"
              value={todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : ''}
              onChange={(e) => setDueDate(todo.id, e.target.value ? new Date(e.target.value) : null)}
            />
            <Button variant="outline-primary" size="sm" onClick={() => setEditingId(todo.id)}>
              Edit
            </Button>
            <Button variant="outline-danger" size="sm" onClick={() => deleteTodo(todo.id)}>
              Delete
            </Button>
          </div>
        </>
      )}
    </ListGroup.Item>
  );
};

export default TodoItem;