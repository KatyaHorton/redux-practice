import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
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

const store = createStore(counter);

const Counter = ({ value, onIncrement, onDecrement }) => (
  <div>
    <h1>{value}</h1>
    <button onClick={onIncrement}>+</button>
    <button onClick={onDecrement}>-</button>
  </div>
);

const render = () => {
  ReactDOM.render(
    <Counter
      value={store.getState()}
      onIncrement={() =>
        store.dispatch({
          type: "INCREMENT"
        })
      }
      onDecrement={() =>
        store.dispatch({
          type: "DECREMENT"
        })
      }
    />,
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
