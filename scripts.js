const datePicker = document.querySelector("#inlineDatePicker");
const taskInput = document.querySelector("#taskInput");
const addTaskButton = document.querySelector("#addTaskButton");
const taskList = document.querySelector("#taskList");

let selectedDate;
const LOCAL_STORAGE_PREFIX = "TASK_LIST";
const LOCAL_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-tasksByDate`;

//1️⃣ selectarea cu Jquery a elementului date picker
$("#inlineDatePicker").datepicker({
  onSelect: function (dateText) {
    selectedDate = dateText;
    loadTodo(); //afiseaza taskurile salvate local
  },
});
////--functia asociata butonului Add Task
addTaskButton.addEventListener("click", () => {
  addTask();
});

//--functia de incarcare a taskurilor
function loadTodo() {
  taskList.innerHTML = "";
  const tasksByDate = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};

  if (tasksByDate[selectedDate]) {
    tasksByDate[selectedDate].forEach((task) => {
      const listItem = createTaskElement(task, selectedDate);
      taskList.appendChild(listItem);
    });
  }
}

//functia createTaskElement care va creea lista de elemente html cu taskuri

function createTaskElement(task, date) {
  const listItem = document.createElement("li");
  const taskSpan = document.createElement("span");
  taskSpan.textContent = `${task} - ${new Date(date).toLocaleDateString()}`;

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.style.marginLeft = "10px";
  editButton.addEventListener("click", () => {
    editTask(task, date, listItem);
  });

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.style.marginLeft = "10px";
  removeButton.addEventListener("click", () => {
    listItem.remove();
    removeTaskFromStorage(task, date);
  });
  listItem.appendChild(taskSpan);
  listItem.appendChild(editButton);
  listItem.appendChild(removeButton);
  return listItem;
}

//--functia addTask
function addTask() {
  const taskInputValue = taskInput.value;
  if (taskInputValue === "" || selectedDate === "") {
    alert("Introdu task!");
    return;
  }

  const listItem = createTaskElement(taskInputValue, selectedDate);
  taskList.appendChild(listItem);
  saveTaskToStorage(taskInputValue, selectedDate);
  taskInput.value = "";
}

function saveTaskToStorage(task, date) {
  const tasksBydate = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
  if (!tasksBydate[date]) {
    tasksBydate[date] = [];
  }
  tasksBydate[date].push(task);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasksBydate));
}
function removeTaskFromStorage(task, date) {
  const tasksByDate = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || {};
  if (tasksByDate[date]) {
    tasksByDate[date] = tasksByDate[date].filter((t) => t !== task);
    if (tasksByDate[date].length === 0) {
      delete tasksByDate[date];
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasksByDate));
  }
}
function editTask(task, date, listItem) {
  const newTask = prompt("Edit Task", task);
  if (newTask === null) {
    return;
  }
  listItem.remove();
  removeTaskFromStorage(task, date);
  const updatedListItem = createTaskElement(newTask, date);
  taskList.appendChild(updatedListItem);

  saveTaskToStorage(newTask, date);
}
