import React, { Component } from "react";
// var createStore = Redux.createStore;
// ES6 destructuring syntax: const { createStore } = Redux;
import { createStore } from "redux";
import "./App.css";
import expect from "expect";

function counter(state = 0, action) {
  console.log(action, state);
  switch (action.type) {
    case "INCREMENT":
      console.log("+1");
      return state + 1;
    case "DECREMENT":
      console.log("-1");
      return state - 1;
    default:
      return state;
  }
}

const store = createStore(counter);

// store.dispatch({ type: "INCREMENT" });
//
// console.log(store.getState());
//
// store.dispatch({ type: "INCREMENT" });
//
// console.log(store.getState());
//
// store.dispatch({ type: "INCREMENT" });
//
// console.log(store.getState());

const Counter = ({ value, onIncrement, onDecrement }) => (
  <div>
    <h1>{value}</h1>
    <button onClick={onIncrement}>+</button>
    <button onClick={onDecrement}>-</button>
  </div>
);

// class App extends Component {
const App = () => (
  <div className="App">
    <Counter
      value={store.getState()}
      onIncrement={() => {
        console.log("INCREMENT");
        store.dispatch({
          type: "INCREMENT"
        });
      }}
      onDecrement={() => {
        console.log("DECREMENT");
        store.dispatch({
          type: "DECREMENT"
        });
      }}
    />
  </div>
);
// }
//
export default App;

store.subscribe(App);
