"use strict";
const form = document.querySelector("#form");
const btnCreate = document.querySelector(".btn-create-item");
const btnItem = document.querySelector(".item-btn");
const textField = document.querySelector(".text-field");
const itemsList = document.querySelector(".items");
const themeSwitch = document.querySelector(".theme-switch");
const numberOfTasks = document.querySelector(".number-left");
const radioBtns = document.querySelectorAll(".check");
const all = document.getElementById("all");
const active = document.getElementById("active");
const completed = document.getElementById("completed");
const filterForm = document.querySelector(".filter-form");
let counter = 0;
let draggedItem;
numberOfTasks.textContent = counter;
form.addEventListener("submit", (e) => {
  e.preventDefault();
  counter = Number(numberOfTasks.textContent);

  if (textField.value == "") {
    btnCreate.disabled = true;
  }
  textField.addEventListener("input", (e) => {
    btnCreate.disabled = false;
  });
  if (textField.value !== "") {
    btnCreate.disabled = false;
    createItem(textField.value);
    counter = counter + 1;
  }

  numberOfTasks.textContent = counter;
});

function createItem(itemContent) {
  let uniqueID = new Date().valueOf();
  itemsList.insertAdjacentHTML(
    "beforeend",
    `<li id=${uniqueID} draggable="true"  ondragstart="drag(event)" class="item">
  <button onclick="checkItem(this)" class="btn item-btn"></button>
  <p class="task-text">${itemContent}</p>
</li>`
  );

  btnCreate.disabled = false;
  textField.value = "";
  textField.focus();
}
//
function checkItem(taskBtn) {
  let sibling = taskBtn.nextElementSibling;
  taskBtn.classList.toggle("completed");
  sibling.classList.toggle("completed");
}

/******************* clear completed tasks ****************/

document.querySelector(".clear-completed").addEventListener("click", () => {
  let list = document.querySelectorAll(".item");
  let result = 0;
  let totalCounter = 0;

  counter = Number(numberOfTasks.textContent);

  [...new Set(list)].forEach((el) => {
    if (el.childNodes[1].classList.contains("completed")) {
      el.remove();
      totalCounter = totalCounter + 1;
    }

    result = counter - totalCounter;
    numberOfTasks.textContent = result;
  });
});

/*************************** Switch Theme ***********************/
themeSwitch.addEventListener("change", switchTheme);

function switchTheme(e) {
  console.log(e.target.checked);
  e.preventDefault();

  if (e.target.checked) {
    document.documentElement.setAttribute("data-them", "dark");
    document.querySelector(".toggle-img").src = "images/icon-sun.svg";
  } else {
    document.documentElement.setAttribute("data-them", "light");
    document.querySelector(".toggle-img").src = "images/icon-moon.svg";
  }
}

/********************* check/uncheck filter buttons *************/
filterForm.addEventListener("click", (e) => {
  const clicked = e.target.closest(".check");
  console.log(clicked);
  radioBtns.forEach((el) => {
    if (!clicked) {
      el.checked = false;
    }
  });
});

//filter completed
completed.addEventListener("click", filterCompleted);
function filterCompleted() {
  let list = document.querySelectorAll(".item");
  [...new Set(list)].forEach((el) => {
    if (el.childNodes[1].classList.contains("completed")) {
      console.log(el);
      el.style.display = "";
    } else {
      el.style.display = "none";
    }
  });
}

//filter active
active.addEventListener("click", filterActive);
function filterActive() {
  let list = document.querySelectorAll(".item");
  [...new Set(list)].forEach((el) => {
    if (el.childNodes[1].classList.contains("completed")) {
      console.log(el);
      el.style.display = "none";
    } else {
      el.style.display = "";
    }
  });
}

//display all
all.addEventListener("click", displayAll);
function displayAll() {
  let list = document.querySelectorAll(".item");
  [...new Set(list)].forEach((el) => {
    el.style.display = "";
  });
}

/********************* DRAG AND DROP *********************/
//when item starts dragging
function drag(e) {
  draggedItem = e.target;
}
function allowDrop(e) {
  e.preventDefault();
}

//drop
function drop(e) {
  e.preventDefault();
  const afterElement = getDragAfter(e.clientY);
  if (afterElement == null) {
    itemsList.appendChild(draggedItem);
  } else {
    itemsList.insertBefore(draggedItem, afterElement);
  }
}

function getDragAfter(y) {
  let list = document.querySelectorAll(".item");
  return [...new Set(list)].reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}
