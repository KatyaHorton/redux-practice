import React, { Component } from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers } from "redux";
import "./index.css";
import expect from "expect";
import deepFreeze from "deep-freeze";
// import App from "./App";
// import * as serviceWorker from "./serviceWorker";

function counter(state = 0, action) {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }
}

/* -------------------TEST ADDCOUNTER ------------------- */
const addCounter = list => {
  //return list.concat([0]);
  return [...list, 0];
};

const testAddCounter = () => {
  const listBefore = [];
  const listAfter = [0];
  deepFreeze(listBefore);
  expect(addCounter(listBefore)).toEqual(listAfter);
};

/* -------------------TEST REMOVE COUNTER ------------------- */

const testRemoveCounter = () => {
  const listBefore = [0, 10, 20];
  const listAfter = [0, 20];

  deepFreeze(listBefore);
  expect(removeCounter(listBefore, 1)).toEqual(listAfter);
};

const removeCounter = (list, index) => {
  // list.splice(index, 1);
  // return list;
  //return list.slice(0, index).concat(list.slice(index + 1));
  return [...list.slice(0, index), ...list.slice(index + 1)];
};

/* -------------------TEST INCREMENT COUNTER ------------------- */

const testIncrementCounter = () => {
  const listBefore = [0, 10, 20];
  const listAfter = [0, 11, 20];

  deepFreeze(listBefore);

  expect(incrementCounter(listBefore, 1)).toEqual(listAfter);
};

const incrementCounter = (list, index) => {
  // list[index]++;
  // return list;

  return [...list.slice(0, index), list[index] + 1, ...list.slice(index + 1)];
};

/* ------------------- TODO LIST APP ------------------- */

const todo = (state, action) => {
  switch (action.type) {
    case "ADD_TODO":
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case "TOGGLE_TODO":
      if (state.id !== action.id) {
        return state;
      }
      return {
        ...state,
        completed: !state.completed
      };
    default:
      return state;
  }
};

const todos = (state = [], action) => {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, todo(undefined, action)];

    case "TOGGLE_TODO":
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

/* VISIBILITY FILTER */

const visibilityFilter = (state = "SHOW_ALL", action) => {
  switch (action.type) {
    case "SET_VISIBILITY_FILTER":
      return action.filter;
    default:
      return state;
  }
};

/* Reducer composition pattern */

const todoApp = combineReducers({
  todos: todos,
  visibilityFilter: visibilityFilter
});
// const todoApp = (state = {}, action) => {
//   return {
//     todos: todos(state.todos, action),
//     visibilityFilter: visibilityFilter(state.visibilityFilter, action)
//   };
// };

const store = createStore(todoApp);

console.log("Initial state: ", store.getState());
console.log("--------------------------------------");

/* TESTS FOR TODOS APP */

const testAddTodos = () => {
  const stateBefore = [];
  const action = {
    type: "ADD_TODO",
    id: 0,
    text: "Learn Redux"
  };
  const stateAfter = [
    {
      id: 0,
      text: "Learn Redux",
      completed: false
    }
  ];

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(todos(stateBefore, action)).toEqual(stateAfter);
};

const testToggleTodo = () => {
  const stateBefore = [
    {
      id: 0,
      text: "Learn Redux",
      completed: false
    },
    {
      id: 1,
      text: "Implement Redux",
      completed: false
    }
  ];
  const action = {
    type: "TOGGLE_TODO",
    id: 1
  };

  const stateAfter = [
    {
      id: 0,
      text: "Learn Redux",
      completed: false
    },
    {
      id: 1,
      text: "Implement Redux",
      completed: true
    }
  ];

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(todos(stateBefore, action)).toEqual(stateAfter);
};

const toggleTodoPractice = todo => {
  return Object.assign({}, todo, {
    completed: !todo.completed
  });
};

/* ToggleTodo */

const testToggleTodoPractice = () => {
  const todoBefore = {
    id: 0,
    text: "Learn Redux",
    completed: false
  };
  const todoAfter = {
    id: 0,
    text: "Learn Redux",
    completed: true
  };

  expect(toggleTodoPractice(todoBefore)).toEqual(todoAfter);
};

testAddTodos();
testToggleTodo();
testToggleTodoPractice();
testAddCounter();
testRemoveCounter();
testIncrementCounter();
console.log("All tests passed");

const FilterLink = ({ filter, children, currentFilter }) => {
  if (filter === currentFilter) {
    return <span>{children}</span>;
  }
  return (
    <a
      href="#"
      onClick={e => {
        e.preventDefault();
        store.dispatch({
          type: "SET_VISIBILITY_FILTER",
          filter
        });
      }}
    >
      {children}
    </a>
  );
};

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case "SHOW_ALL":
      return todos;
    case "SHOW_ACTIVE":
      return todos.filter(t => !t.completed);
    case "SHOW_COMPLETED":
      return todos.filter(t => t.completed);
    default:
      return todos;
  }
};

let nextTodoId = 0;

class TodoApp extends Component {
  render() {
    const { todos, visibilityFilter } = this.props;

    const visibleTodos = getVisibleTodos(todos, visibilityFilter);

    console.log("visibleTodos", visibleTodos);
    return (
      <div>
        <input
          ref={node => {
            this.input = node;
          }}
        />
        <button
          onClick={() => {
            store.dispatch({
              type: "ADD_TODO",
              text: this.input.value,
              id: nextTodoId++
            });
            this.input.value = "";
            console.log("Current state: ", store.getState());
            console.log("--------------------------------------");
          }}
        >
          Add Todo
        </button>
        <ul>
          {visibleTodos.map(todo => (
            <li
              key={todo.id}
              onClick={() => {
                store.dispatch({
                  type: "TOGGLE_TODO",
                  id: todo.id
                });
                console.log("Clicked item: ", todo.completed);
              }}
              style={{
                color: todo.completed ? "green" : "red"
              }}
            >
              {todo.text}
            </li>
          ))}
        </ul>
        <p>
          Show:{" "}
          <FilterLink filter="SHOW_ALL" currentFilter={visibilityFilter}>
            All
          </FilterLink>{" "}
          <FilterLink filter="SHOW_ACTIVE" currentFilter={visibilityFilter}>
            Active
          </FilterLink>{" "}
          <FilterLink filter="SHOW_COMPLETED" currentFilter={visibilityFilter}>
            Completed
          </FilterLink>
        </p>
      </div>
    );
  }
}

const render = () => {
  ReactDOM.render(
    <TodoApp {...store.getState()} />,
    document.getElementById("root")
  );
};

//ReactDOM.render(<App />, document.getElementById("root"));

store.subscribe(render);
render();
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
