const elForm = document.querySelector(".js-form");
const elInput = document.querySelector(".js-input");
const elRecordBtn = document.querySelector(".js-record-btn");
const elSpinner = document.querySelector(".js-spinner");
const elList = document.querySelector(".js-list");
const elAllTodos = document.querySelector(".js-all-todos");
const elCompletedTodos = document.querySelector(".js-completed-todos");
const elUnCompletedTodos = document.querySelector(".js-uncompleted-todos");
const elClearAllBtn = document.querySelector(".js-clear-all-btn");

let elAllTodosNum = elAllTodos.children[0];
let elCompletedTodosNum = elCompletedTodos.children[0];
let elUnCompletedTodosNum = elUnCompletedTodos.children[0];

let todos = [];
let completedTodo;
let unCompletedTodo = todos;

const renderTodo = (array, node) => {
  node.innerHTML = "";
  array.forEach((item) => {
    const newItem = document.createElement("li");

    const newCheckInput = document.createElement("input");
    const newSpan = document.createElement("span");
    const newEditButton = document.createElement("button");
    const newDeleteButton = document.createElement("button");
    const newTimeSpan = document.createElement("span");

    newItem.appendChild(newCheckInput);
    newItem.appendChild(newSpan);
    newItem.appendChild(newEditButton);
    newItem.appendChild(newDeleteButton);
    newItem.appendChild(newTimeSpan);

    newCheckInput.type = "checkbox";
    newDeleteButton.innerText = "DELETE";
    newEditButton.innerText = "EDIT";
    newTimeSpan.innerText = time();

    newItem.setAttribute("class", "list-group-item d-flex align-items-center");
    newCheckInput.setAttribute("class", "form-check-input m-0 js-check-input");
    newSpan.setAttribute("class", "ms-3 fs-5");
    newEditButton.setAttribute("class", "btn btn-warning ms-auto js-edit-btn");
    newDeleteButton.setAttribute("class", "btn btn-danger ms-2 js-delete-btn");
    newTimeSpan.setAttribute("class", "ms-1 btn btn-secondary");

    newCheckInput.dataset.todoId = item.id;
    newEditButton.dataset.todoId = item.id;
    newDeleteButton.dataset.todoId = item.id;

    if (item.isCompleted) {
      todos.isCompleted = true;
      newSpan.style.textDecoration = "line-through";
      newItem.classList.add("bg-success");
    }

    newSpan.textContent = `${item.id}. ${item.text}`;
    node.appendChild(newItem);
  });
};

function time() {
  var date = new Date();
  var hour = date.getHours();
  var minutes = date.getMinutes();

  if (hour < 10) {
    hour = "0" + hour;
  }

  if (hour > 12) minutes += "PM";
  else minutes += " AM";

  return `${hour}:${minutes}`;
}

let voice = new webkitSpeechRecognition();

voice.lang = "uz-UZ";

elRecordBtn.addEventListener("click", (evt) => {
  elSpinner.classList.remove("d-none");
  voice.start();
});

voice.onend = () => {
  elSpinner.classList.add("d-none");
};

voice.onresult = (evt) => {
  elInput.value = evt.results[0][0].transcript;
};

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  if (elInput.value != "") {
    const newTodo = {
      id: todos.length > 0 ? todos.length + 1 : 1,
      text: elInput.value,
      isCompleted: false,
    };
    elInput.value = "";

    elInput.classList.remove("btn-outline-danger");
    elInput.classList.remove("text-white");

    todos.push(newTodo);
    renderTodo(todos, elList);
    localStorage.setItem("myTodos", JSON.stringify(todos));

    completedTodo = todos.filter((el) => el.isCompleted);
    unCompletedTodo = todos.filter((el) => !el.isCompleted);

    elAllTodosNum.textContent = `(${todos.length})`;
    elCompletedTodosNum.textContent = `(${completedTodo.length})`;
    elUnCompletedTodosNum.textContent = `(${unCompletedTodo.length})`;
  } else {
    elInput.classList.add("text-white");
    elInput.classList.add("btn-outline-danger");
  }
});

elClearAllBtn.addEventListener("click", () => {
  localStorage.removeItem("myTodos");
  todos = [];

  renderTodo(todos, elList);
});

renderTodo(todos, elList);

elAllTodos.addEventListener("click", () => {
  renderTodo(todos, elList);
});

elCompletedTodos.addEventListener("click", () => {
  renderTodo(completedTodo, elList);
});

elUnCompletedTodos.addEventListener("click", () => {
  renderTodo(unCompletedTodo, elList);
});

elList.addEventListener("click", (evt) => {
  evt.preventDefault();

  if (evt.target.matches(".js-delete-btn")) {
    const todoId = +evt.target.dataset.todoId;
    const findedIndex = todos.findIndex((el) => el.id === todoId);
    todos.splice(findedIndex, 1);
    renderTodo(todos, elList);
    localStorage.setItem("myTodos", JSON.stringify(todos));
  }

  if (evt.target.matches(".js-edit-btn")) {
    const todoId = +evt.target.dataset.todoId;
    const findedIndex = todos.findIndex((el) => el.id === todoId);
    const editTodo = prompt("Todo'ni o'zgartiring", todos[findedIndex].text);

    if (
      editTodo !== null &&
      editTodo !== "" &&
      editTodo === todos[findedIndex].text
    ) {
      todos[findedIndex].text = editTodo;
      renderTodo(todos, elList);
      localStorage.setItem("myTodos", JSON.stringify(todos));
    }
  }

  if (evt.target.matches(".js-check-input")) {
    const todoId = +evt.target.dataset.todoId;
    const findedItem = todos.find((el) => el.id === todoId);
    findedItem.isCompleted = !findedItem.isCompleted;

    completedTodo = todos.filter((el) => el.isCompleted);
    unCompletedTodo = todos.filter((el) => !el.isCompleted);

    elAllTodosNum.textContent = `(${todos.length})`;
    elCompletedTodosNum.textContent = `(${completedTodo.length})`;
    elUnCompletedTodosNum.textContent = `(${unCompletedTodo.length})`;
    renderTodo(todos, elList);
    localStorage.setItem("myTodos", JSON.stringify(todos));
  }
});
