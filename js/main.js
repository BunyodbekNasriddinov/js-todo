var elForm = document.querySelector(".js-form");
var elInput = document.querySelector(".js-input");
var elForm = document.querySelector(".js-form");
var elList = document.querySelector(".js-list");
var elRecord = document.querySelector(".js-record");
var elRemoveBtn;
var elSpinner = document.querySelector(".js-spinner");
var elSelect = document.querySelector(".js-select");

var voice = new webkitSpeechRecognition();

elRecord.addEventListener("click", () => {
  voice.lang = elSelect.value;

  voice.start();

  elSpinner.classList.remove("d-none");
});

voice.onend = () => {
  elSpinner.classList.add("d-none");
};

voice.onresult = (evt) => {
  elInput.value = evt.results[0][0].transcript;
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

var todos = [];

elForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  var obj = {
    id: todos.length + 1,
    task: elInput.value,
  };

  if (elInput.value === "") {
    elInput.classList.add("border-danger");
    elInput.classList.add("border-5");
    return;
  } else {
    elInput.classList.remove("border-danger");
  }

  todos.push(obj);

  var newTask = document.createElement("li");
  elList.append(newTask);
  newTask.classList.add("list-group-item");
  newTask.classList.add("text-success");
  newTask.classList.add("fw-bold");
  newTask.classList.add("fs-5");
  newTask.classList.add("d-flex");
  newTask.classList.add("justify-content-between");
  newTask.classList.add("align-items-center");

  newTask.innerHTML = `
  ${obj.id}. ${
    obj.task
  } <div><span class="text-primary pt-2">${time()}</span><button class="js-remove btn pt-0" type="button">
    <img
    width="20"
    height="20"
    src="./images/delete.png"
    alt="Delete icon"
    />
    </button></div> `;

  elInput.value = "";

  elRemoveBtn = newTask.querySelectorAll(".js-remove");

  elRemoveBtn.forEach((el) => {
    el.addEventListener("click", () => {
      newTask.remove();
    });
  });
});
