import "./reset.css";
import "./style.css";

let data = (localStorage.getItem("todoList")) ? JSON.parse(localStorage.getItem("todoList")) : {
  todo: [],
  completed: [],
};
window.data = data;
const dataObjectUpdated = () => {
  localStorage.setItem("todoList", JSON.stringify(data));
};
function removeItem() {
  let item = this.parentNode.parentNode;
  let parent = item.parentNode;
  let id = parent.id;
  let value = item.innerText;
  if (id === "todo") {
    data.todo.splice(data.todo.indexOf(value), 1);
  } else {
    data.completed.splice(data.completed.indexOf(value), 1);
  }
  parent.removeChild(item);
  dataObjectUpdated();
}
function completeItem() {
  let item = this.parentNode.parentNode;
  let parent = item.parentNode;
  let id = parent.id;
  let target = id === "todo" ? document.getElementById("completed") : document.getElementById("todo");
  let value = item.innerText;
  if (id === "todo") {
    data.todo.splice(data.todo.indexOf(value), 1);
    data.completed.push(value);
  } else {
    data.completed.splice(data.completed.indexOf(value), 1);
    data.todo.push(value);
  }
  parent.removeChild(item);
  target.insertBefore(item, target.childNodes[0]);
  dataObjectUpdated();
}
const addItemTodo = (text, completed) => {
  let list = completed === undefined ? document.getElementById("todo") : document.getElementById("completed");
  let item = document.createElement("li");
  item.innerText = text;
  let buttons = document.createElement("div");
  buttons.classList.add("buttons");
  let remove = document.createElement("button");
  remove.classList.add("remove");
  remove.innerText = "删除";
  remove.addEventListener("click", removeItem);
  let complete = document.createElement("button");
  complete.classList.add("complete");
  complete.innerText = "完成";
  complete.addEventListener("click", completeItem);
  buttons.appendChild(remove);
  buttons.appendChild(complete);
  item.appendChild(buttons);
  list.insertBefore(item, list.childNodes[0]);
};
const startAdd = () => {
  let value = document.getElementById('item').value; 
  if (value) {
    addItemTodo(value);
    data.todo.push(value);
    dataObjectUpdated();
    document.getElementById('item').value = "";
    document.getElementById("item").focus();
  }
};
document.getElementById("add").addEventListener("click", () => {
  startAdd();
});
document.getElementById("item").addEventListener("keypress", (e) => {
  if (e.keyCode === 13) {
    startAdd();
  }
});

const render = () => {
  data.todo.forEach((item) => {
    addItemTodo(item); 
  });
  data.completed.forEach((item) => {
    addItemTodo(item, true); 
  });
};

render();