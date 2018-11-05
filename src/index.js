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

testA ddCounter();
testRemoveCounter();
testIncrementCounter();
console.log("All tests passed");
console.log(deepFreeze);

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
