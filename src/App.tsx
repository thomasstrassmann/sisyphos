import React, { useState, useCallback, useEffect } from 'react';
import { Container, Row, Col, Form, Button, ListGroup, Dropdown } from 'react-bootstrap';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TodoItem from './components/TodoItem.tsx';
import logo from './images/sisyphos.png';
import general from './styles/general.module.scss';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate: Date | null;
}

const TODO_STORAGE_KEY = 'todos';

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const storedTodos = localStorage.getItem(TODO_STORAGE_KEY);
    return storedTodos ? JSON.parse(storedTodos) : [];
  });

  // START states 
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  // END states


  useEffect(() => {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);
 

  // Start CRUD functions
  const addTodo = useCallback(() => {
    if (newTodo.trim()) {
      setTodos(prevTodos => [
        ...prevTodos,
        { id: Date.now(), text: newTodo.trim(), completed: false, dueDate: null }
      ]);
      setNewTodo('');
    }
  }, [newTodo]);

  const toggleTodo = useCallback((id: number) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  }, []);

  const editTodo = useCallback((id: number, newText: string) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
    setEditingId(null);
  }, []);

  const moveTodo = useCallback((dragIndex: number, hoverIndex: number) => {
    setTodos(prevTodos => {
      const newTodos = [...prevTodos];
      const [reorderedItem] = newTodos.splice(dragIndex, 1);
      newTodos.splice(hoverIndex, 0, reorderedItem);
      return newTodos;
    });
  }, []);

  const setDueDate = useCallback((id: number, date: Date | null) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, dueDate: date } : todo
      )
    );
  }, []);
  // End CRUD functions

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <Container className={`mt-5 ${general.container}`}>
        <img className={`w-50 d-block mx-auto ${general.logo}`} src={logo} alt="Sisyphos Logo"/>
        <h1 className="text-center mb-2">Track your tasks and achieve them!</h1>
        <p className='text-center text-primary bold'><strong>Again and again...</strong></p>
        <Row className="justify-content-center">
          <Col xs={12} md={6} className='mt-3 mb-5'>
            <Form onSubmit={e => { e.preventDefault(); addTodo(); }}>
              <Form.Group className="mb-4 d-flex">
                <Form.Control
                  type="text"
                  value={newTodo}
                  onChange={e => setNewTodo(e.target.value)}
                  placeholder="Enter a new todo"
                  className='rounded-pill border-secondary font-family-base'
                />
                <Button variant="primary" type="submit" className="ms-2">
                  <span className='text-base'>Add</span>
                </Button>
              </Form.Group>
            </Form>
            <Dropdown className="mb-4">
              <Dropdown.Toggle variant="secondary" id="dropdown-filter">
                <span className='text-base'>Filter: {filter}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setFilter('all')}>All</Dropdown.Item>
                <Dropdown.Item onClick={() => setFilter('active')}>Active</Dropdown.Item>
                <Dropdown.Item onClick={() => setFilter('completed')}>Completed</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <ListGroup className={general.itemContainer}>
              {filteredTodos.map((todo, index) => (
                <TodoItem
                  key={todo.id}
                  index={index}
                  todo={todo}
                  toggleTodo={toggleTodo}
                  deleteTodo={deleteTodo}
                  editTodo={editTodo}
                  setDueDate={setDueDate}
                  editingId={editingId}
                  setEditingId={setEditingId}
                  moveTodo={moveTodo}
                />
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </DndProvider>
  );
};

export default App;