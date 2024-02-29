import hh from "hyperscript-helpers";
import { h, diff, patch } from "virtual-dom";
import createElement from "virtual-dom/create-element";

// allows using html tags as functions in javascript
const { div, button, p, h1 } = hh(h);

// A combination of Tailwind classes which represent a (more or less nice) button style
const btnStyle =
  "bg-blue-500 text-white font-bold py-2 px-4 rounded transition-transform hover:-translate-y-1 hover:translate-x-1";


// Messages which can be used to update the model
const MSGS = {
  INCREASE_MODEL: "INCREASE_MODEL",
  DECREASE_MODEL: "DECREASE_MODEL",
  // ... ℹ️ additional messages
};

// View function which represents the UI as HTML-tag functions
function view(dispatch, model) {
  return div({ className: "flex flex-col gap-4 items-center" }, [
    h1({ className: "text-2xl " }, `My Counter`),
    p({ className: "text-2xl" }, `Counter: ${model.counter}`),
    div({ className: "flex flex-row gap-8" }, [
      button(
        {
          className: btnStyle,
          onclick: () => dispatch(MSGS.INCREASE_MODEL),
        },
        "Increase +"
      ),
      button(
        { className: btnStyle, onclick: () => dispatch(MSGS.DECREASE_MODEL) },
        "Decrease -"
      ),
    ]),
  ]);
}

// Update function which takes a message and a model and returns a new/updated model
function update(msg, model) {
  switch (msg) {
    case MSGS.INCREASE_MODEL:
      return { ...model, counter: increaseCounter(model.counter) };

    case MSGS.DECREASE_MODEL:
      return { ...model, counter: decreaseCounter(model.counter) };

    default:
      return model;
  }
}

// Function to increase the counter value by 1
function increaseCounter(counter) {
  return counter + 1;
}

// Function to decrease the counter value by 1
function decreaseCounter(counter) {
  return counter - 1;
}

// ⚠️ Impure code below (not avoidable but controllable)
function app(initModel, update, view, node) {
  let model = initModel;
  let currentView = view(dispatch, model);
  let rootNode = createElement(currentView);
  node.appendChild(rootNode);
  function dispatch(msg) {
    model = update(msg, model);
    const updatedView = view(dispatch, model);
    const patches = diff(currentView, updatedView);
    rootNode = patch(rootNode, patches);
    currentView = updatedView;
  }
}

// The initial model when the app starts
const initModel = {
  counter: 0,
};

// The root node of the app (the div with id="app" in index.html)
const rootNode = document.getElementById("app");

// Start the app
app(initModel, update, view, rootNode);