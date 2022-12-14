import useResizeObserver from '@react-hook/resize-observer';
import { isSameDay } from 'date-fns/esm';
import { isEqual } from 'lodash';
import { nanoid } from 'nanoid';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ITodo, IUpcomingSection } from '../../helpers/types';
import { IPlaceholderProps } from '../../hooks/useDndPlaceholder';
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect';
import { useToggle } from '../../hooks/useToggle';
import { AddTodo } from '../AddTodo';
import { ChevronIcon, PlusSolidIcon } from '../Icons';
import { TodosList } from '../Lists/TodosList';

interface IUpcomingTodosSection {
  section: IUpcomingSection;
  index: number;
  todos: ITodo[];
  placeholderProps: IPlaceholderProps;
  draggingOverElementId: string | null;
  toggleUpcomingDateList: (upcomingDateId: string) => void;
  setTodos: (todos: ITodo[]) => void;
  addTodo: (todo: ITodo) => void;
  completeTodo: (todo: ITodo) => void;
  editTodo: (todo: ITodo) => void;
  addObservedHeight: (height: number) => void;
  setObservedHeight: (height: number, index: number) => void;
}

export const UpcomingTodosSectionMemoized = (props: IUpcomingTodosSection) => {
  const {
    section,
    todos,
    index,
    placeholderProps,
    draggingOverElementId,
    toggleUpcomingDateList,
    addTodo,
    completeTodo,
    editTodo,
    setObservedHeight,
    addObservedHeight,
  } = props;
  const [todoInputOpenById, setTodoInputOpenById] = useState<string | null>(
    null
  );

  const { t } = useTranslation();

  const notCompleteTodos = todos.filter((todo) => !todo.isCompleted);

  const [isTodosListOpen, setIsTodosListOpen] = useState(true);

  const openTodosList = () => setIsTodosListOpen(true);
  const closeTodosList = () => setIsTodosListOpen(false);

  const thisDateTodos = useMemo(
    () =>
      todos.filter(
        (todo) => !todo.isCompleted && isSameDay(todo.date, section.date)
      ),
    [todos]
  );

  const todoInputId = useRef(nanoid());

  const openAddTodo = () => setTodoInputOpenById(todoInputId.current);
  const closeAddTodo = () => setTodoInputOpenById(null);

  const toggleTodoList = () => {
    if (isTodosListOpen) closeAddTodo();
    isTodosListOpen ? closeTodosList() : openTodosList();
  };

  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return;

    addObservedHeight(ref.current.getBoundingClientRect().height);
  }, [ref]);

  useResizeObserver<HTMLDivElement>(ref, (entry) =>
    setObservedHeight(entry.contentRect.height, index)
  );

  const lastCompletedTodosLength = useRef(todos.length);

  useEffect(() => {
    if (
      lastCompletedTodosLength.current === 0 &&
      notCompleteTodos.length === 1 &&
      !isTodosListOpen
    ) {
      openTodosList();
      lastCompletedTodosLength.current = 1;
    }

    return () => {
      lastCompletedTodosLength.current = notCompleteTodos.length;
    };
  }, [todos, isTodosListOpen, openTodosList]);

  return (
    <div ref={ref} key={section.id} className='flex flex-col h-fit w-full'>
      <div className='sticky top-[147px] z-[2]'>
        <div className='relative flex justify-between items-center w-full text-sm bg-white font-bold h-fit py-1.5 border-b-[1px] border-gray-300'>
          <span
            className={`${
              notCompleteTodos.length > 0 ? 'text-black' : 'text-gray-500'
            }`}
          >
            {section.title}
          </span>

          {/* <span
            onClick={toggleTodoList}
            className='group absolute -left-7 top-[1.5px] cursor-pointer w-6 h-6 rounded-sm z-[2] bg-white hover:bg-gray-200 flex items-center justify-center'
          >
            <ChevronIcon
              className={`${
                isTodosListOpen ? '' : '-rotate-90'
              } w-[20px] h-[20px] stroke-gray-500 group-hover:stroke-gray-600 duration-150 transition-all`}
            />
          </span> */}
        </div>
      </div>

      {isTodosListOpen && (
        <div className='w-full h-fit'>
          <TodosList
            placeholderProps={placeholderProps}
            droppableId={`todos~${section.id}`}
            todos={thisDateTodos}
            draggingOverElementId={draggingOverElementId}
            editTodo={editTodo}
            completeTodo={completeTodo}
            setTodoInputOpenById={setTodoInputOpenById}
            todoInputOpenById={todoInputOpenById}
          />
        </div>
      )}

      <div className='mt-3'>
        {todoInputOpenById === todoInputId.current ? (
          <AddTodo
            date={section.date}
            addTodo={addTodo}
            setTodoInputOpenById={setTodoInputOpenById}
          />
        ) : (
          <div
            onClick={openAddTodo}
            className='group w-full flex items-center gap-2.5 h-fit'
          >
            <span className='group p-0.5 rounded-full bg-white group-hover:bg-blue-600 flex-center'>
              <PlusSolidIcon className='stroke-[1px] fill-blue-600 group-hover:fill-white' />
            </span>
            <span className='font-light text-md text-gray-400 group-hover:text-blue-600'>
              {t('UpcomingTodosSection.addTodo')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const sectionPropsAreEqual = (
  prevProps: Readonly<IUpcomingTodosSection>,
  nextProps: Readonly<IUpcomingTodosSection>
) =>
  isEqual(prevProps.section, nextProps.section) &&
  isEqual(prevProps.todos, nextProps.todos) &&
  isEqual(prevProps.placeholderProps, nextProps.placeholderProps);

export const UpcomingTodosSection = memo(UpcomingTodosSectionMemoized);
