import { isEmpty, isEqual } from 'lodash';
import { memo } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { ITodo } from '../../helpers/types';
import { IPlaceholderProps } from '../../hooks/useDndPlaceholder';
import { useUIStore } from '../../zustand';
import { EditTodo } from '../EditTodo';
import { TodoItem } from './../TodoItem';

interface ITodosListProps {
  droppableId: string;
  todos: ITodo[];
  todoInputOpenById: string | null;
  // draggingElementId: string | null;
  draggingOverElementId: string | null;
  placeholderProps: IPlaceholderProps;
  completeTodo: (todo: ITodo) => void;
  editTodo: (todo: ITodo) => void;
  setTodoInputOpenById: (id: string | null) => void;
}

export const TodosListMemoized = ({
  droppableId,
  todos,
  todoInputOpenById,
  // draggingOverElementId,
  placeholderProps,
  completeTodo,
  editTodo,
  setTodoInputOpenById,
}: ITodosListProps) => {
  const {
    setDraggingElementId,
    setDraggingOverElementId,
    draggingOverElementId,
  } = useUIStore();

  console.log(draggingOverElementId);

  return (
    <Droppable droppableId={`${droppableId}`} type='TODOS'>
      {(droppableProvided, droppableSnapshot) => (
        <div
          ref={droppableProvided.innerRef}
          {...droppableProvided.droppableProps}
          className={`
            ${
              todos.length === 0
                ? droppableSnapshot.isDraggingOver
                  ? 'h-16 opacity-100 bg-gray-300/90 rounded-md blur-sm transition-colors ease-out duration-1000'
                  : 'h-[1px] opacity-0 bg-gray-300/90 rounded-md blur-sm transition-colors ease-out duration-1000'
                : ''
            }
          relative flex flex-col`}
        >
          {todos.map((todo, i) => (
            <Draggable key={todo.id} draggableId={todo.id} index={i}>
              {(draggableProvided, draggableSnapshot) => (
                <div
                  ref={draggableProvided.innerRef}
                  {...draggableProvided.draggableProps}
                  style={
                    draggableProvided.draggableProps
                      .style as React.CSSProperties
                  }
                >
                  <TodoItem
                    todo={todo}
                    todoInputOpenById={todoInputOpenById}
                    draggableProvided={draggableProvided}
                    draggableSnapshot={draggableSnapshot}
                    setDraggingOverElementId={setDraggingOverElementId}
                    setDraggingElementId={setDraggingElementId}
                    editTodo={editTodo}
                    completeTodo={completeTodo}
                    setTodoInputOpenById={setTodoInputOpenById}
                  />
                </div>
              )}
            </Draggable>
          ))}
          {droppableProvided.placeholder}
          {!isEmpty(placeholderProps) && droppableSnapshot.isDraggingOver && (
            <div
              className='absolute bg-gray-300/90 rounded-md blur-sm transition-colors ease-out duration-1000'
              style={{
                top: placeholderProps.y,
                left: placeholderProps.x,
                height: placeholderProps.height,
                width: placeholderProps.width,
              }}
            />
          )}
        </div>
      )}
    </Droppable>
  );
};

const todosListAreEqual = (
  prevProps: Readonly<ITodosListProps>,
  nextProps: Readonly<ITodosListProps>
) =>
  isEqual(prevProps.todos, nextProps.todos) &&
  prevProps.todoInputOpenById !== nextProps.todoInputOpenById &&
  prevProps.draggingOverElementId !== prevProps.droppableId &&
  nextProps.draggingOverElementId !== nextProps.droppableId;

export const TodosList = memo(TodosListMemoized, todosListAreEqual);
