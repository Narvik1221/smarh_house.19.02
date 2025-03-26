window.isMouseDown = false;
document.addEventListener("mousedown", () => {
  window.isMouseDown = true;
});
document.addEventListener("mouseup", () => {
  window.isMouseDown = false;
});

let changeArduinoSan = {
  //названия этих переменных не менять
  //котельная
  barBake: "",
  timeBake: "",
  temperatureBake: "",

  //батареи
  batteryPump: "",
  batteryRoomTempSelect: "",
  temperatureBatteryContor: "",
  batteryCoefSelect: "",

  //теплый пол
  floorPump: "",
  floorRoomTempSelect: "",
  temperatureFloorContor: "",
  floorCoefSelect: "",

  //гараж
  garagePump: "",
  garageRoomTempSelect: "",
  temperatureGarageContor: "",
  garageCoefSelect: "",

  //горячая вода
  waterPump: "",
  waterRoomTempSelect: "",
  temperatureWaterContor: "",
  waterCoefSelect: "",

  //беседка
  pavilionPump: "",
  pavilionRoomTempSelect: "",
  temperaturePavilionContor: "",
  pavilionCoefSelect: "",
};

//!!! получаем данные с сервера
let currentSection = document;

let Socket;
function init(ip) {
  Socket = new WebSocket("ws://" + ip + ":81/");
  Socket.onmessage = function (event) {
    processReceivedCommand(event);
    // console.log(event);
  };
  Socket.onclose = function () {
    console.log("WebSocket соединение закрыто");
  };

  // Закрываем WebSocket при уходе со страницы
  window.onbeforeunload = function () {
    if (Socket && Socket.readyState === WebSocket.OPEN) {
      Socket.close();
      console.log("WebSocket закрыт при уходе со страницы");
    }
  };
}

function processReceivedCommand(evt) {
  if (window.isMouseDown) {
    console.log("Обновление данных пропущено, мышка зажата");
    return;
  }
  let myData = JSON.parse(evt.data);
  let name;
  let value;
  console.log(evt.data);
  //объект целиком
  //console.log(myData);
  Object.keys(myData).forEach((key) => {
    name = key;
    value = myData[key];
    console.log(name);
    console.log(value);

    if (name.includes("Select")) {
      const selectElement = document.getElementById(name);

      if (selectElement && selectElement.tagName === "SELECT") {
        const optionToSelect = Array.from(selectElement.options).find(
          (option) => option.value === value
        );
        if (optionToSelect) {
          selectElement.value = value;
        } else {
          console.warn(`Опция с value="${value}" не найдена`);
        }
      } else {
        console.warn(`Элемент с id="${id}" не найден или не является select`);
      }
    } else if (name.includes("Bake")) {
      const el = document.getElementById(name);
      if (el) {
        el.textContent = value;
      }
    } else if (name.includes("Contor")) {
      const el = document.getElementById(name);
      if (el) {
        el.textContent = value;
      }
    } else if (name.includes("Pump")) {
      let element = document.getElementById(name);
      if (element) {
        if (value == "0") {
          element.classList.remove("active");
        } else if (value == "1") {
          element.classList.add("active");
        }
      }
    }
  });
}

//!!! работа выключателей
function GetCheck(event) {
  //если кнопка active (зеленая)  то 1
  if (event.target.classList.contains("active")) {
    changeArduinoSan[event.target.id] = "param_save_" + event.target.id + "_0";
  } // иначе 0
  else {
    changeArduinoSan[event.target.id] = "param_save_" + event.target.id + "_1";
  }
  event.target.classList.toggle("active");
  sendText(changeArduinoSan[event.target.id]);
}

function changeSelect(event) {
  console.log(event.target.value);
  changeArduinoSan[event.target.id] =
    "param_save_" + event.target.id + "_" + event.target.value;
  // "param_send_" + event.target.id + "_" + event.target.value;
  sendText(changeArduinoSan[event.target.id]);
}
function sendText(data) {
  console.log(data);
  Socket.send(data);
}

window.onload = function (e) {
  let localIp = localStorage.getItem("ip");
  //console.log(localIp);
  if (!!localIp) {
    init(window.location.hostname);
  }
};
