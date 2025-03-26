let changeArduinoSan = {
  //входы
  mainMotion: "",
  mainSpot: "",
  yardMotion: "",
  yardSpot: "",
  //прихожая
  hallwaySpot: "",
  hallwayTrack: "",
  hallwayMotion: "",
  hallwayShim: "",
  hallwaySliderShim: "",
  //лестница
  ladderSpot1: "",
  ladderSpot2: "",
  ladderMotionShim: "",
  ladderShim: "",
  ladderSliderShim: "",
  //кухня
  kitchenSpot: "",
  kitchenLamp: "",
  kitchenTable: "",
  kitchenTableMotion: "",
  kitchenSliderTable: "",
  kitchenShim: "",
  kitchenSliderShim: "",
  //гостиная
  livingRoomSpot: "",
  livingRoomLamp: "",
  livingRoomTrack: "",
  livingRoomBra: "",
  livingRoomSliderCloset: "",
  livingRoomCloset: "",
  livingRoomSliderBedsideTable: "",
  livingRoomBedsideTable: "",
  livingRoomSliderTV: "",
  livingRoomTV: "",
  //санузел 1 этаж
  sanFirstSpot: "",
  sanFirstLight: "",
  sanFirstWall: "",
  sanFirstSliderWall: "",
  sanFirstShim: "",
  sanFirstShimMotion: "",
  sanFirstSliderShim: "",
  sanFirstWind: "",
  sanFirstWindMotion: "",
  sanFirstcheckboxTempHum: "",
  sanFirstsliderMinTemp: "",
  sanFirstsliderMaxTemp: "",
  sanFirstsliderMinHum: "",
  sanFirstsliderMaxHum: "",
};

let arduinoValuesSan = {
  //
  //ПЕРВЫЙ ЭТАЖ
  //
  mainMotion: "&MAIN_MOTION",
  mainSpot: "&MAIN_SPOT",
  yardMotion: "&YARD_MOTION",
  yardSpot: "&YARD_SPOT",
  // прихожая
  hallwaySpot: "&HALLWAY_SPOT",
  hallwayTrack: "&HALLWAY_TRACK",
  hallwayMotion: "&HALLWAY_MOTION",
  hallwayShim: "&HALLWAY_SHIM",
  hallwaySliderShim: "&HALLWAY_SLIDER_SHIM",
  // лестница
  ladderSpot1: "&LADDER_SPOT1",
  ladderSpot2: "&LADDER_SPOT2",
  ladderMotionShim: "&LADDER_MOTION_SHIM",
  ladderShim: "&LADDER_SHIM",
  ladderSliderShim: "&LADDER_SLIDER_SHIM",
  // кухня
  kitchenSpot: "&KITCHEN_SPOT",
  kitchenLamp: "&KITCHEN_LAMP",
  kitchenTable: "&KITCHEN_TABLE",
  kitchenTableMotion: "&KITCHEN_TABLE_MOTION",
  kitchenSliderTable: "&KITCHEN_SLIDER_TABLE",
  kitchenShim: "&KITCHEN_SHIM",
  kitchenSliderShim: "&KITCHEN_SLIDER_SHIM",
  // гостиная
  livingRoomSpot: "&LIVING_ROOM_SPOT",
  livingRoomLamp: "&LIVING_ROOM_LAMP",
  livingRoomTrack: "&LIVING_ROOM_TRACK",
  livingRoomBra: "&LIVING_ROOM_BRA",
  livingRoomSliderCloset: "&LIVING_ROOM_SLIDER_CLOSET",
  livingRoomCloset: "&LIVING_ROOM_CLOSET",
  livingRoomSliderBedsideTable: "&LIVING_ROOM_SLIDER_BEDSIDE_TABLE",
  livingRoomBedsideTable: "&LIVING_ROOM_BEDSIDE_TABLE",
  livingRoomSliderTV: "&LIVING_ROOM_SLIDER_TV",
  livingRoomTV: "&LIVING_ROOM_TV",
  // санузел 1 этаж
  sanFirstSpot: "&SAN_FIRST_SPOT",
  sanFirstLight: "&SAN_FIRST_LIGHT",
  sanFirstWall: "&SAN_FIRST_WALL",
  sanFirstSliderWall: "&SAN_FIRST_SLIDER_WALL",
  sanFirstShim: "&SAN_FIRST_SHIM",
  sanFirstShimMotion: "&SAN_FIRST_SHIM_MOTION",
  sanFirstSliderShim: "&SAN_FIRST_SLIDER_SHIM",
  sanFirstWind: "&SAN_FIRST_WIND",
  sanFirstWindMotion: "&SAN_FIRST_WIND_MOTION",
  sanFirstcheckboxTempHum: "&SAN_FIRST_CHECKBOX_TEMP_HUM",
  sanFirstsliderMinTemp: "&SAN_FIRST_SLIDER_MIN_TEMP",
  sanFirstsliderMaxTemp: "&SAN_FIRST_SLIDER_MAX_TEMP",
  sanFirstsliderMinHum: "&SAN_FIRST_SLIDER_MIN_HUM",
  sanFirstsliderMaxHum: "&SAN_FIRST_SLIDER_MAX_HUM",
};
//!!! получаем данные с сервера
let currentSection = document;

let tempContainer = currentSection.querySelector("#temp-range");
let humContainer = currentSection.querySelector("#hum-range");
let Socket;
function init(ip) {
  Socket = new WebSocket("ws://" + ip + ":81/");
  Socket.onmessage = function (event) {
    processReceivedCommand(event);
    console.log(event);
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
  let myData = JSON.parse(evt.data);
  let name;
  let value;
  //объект целиком
  console.log(myData);
  Object.keys(myData).forEach((key) => {
    name = key;
    value = myData[key];
    console.log(name);
    console.log(value);

    // Проверка для датчиков движения (motion)
    if (name.includes("Motion")) {
      let element = document.getElementById(name);
      if (element) {
        if (value === "0") {
          element.checked = true;
          element.value = 0;
        } else if (value === "1") {
          element.checked = false;
          element.value = 1;
        }
      }
    } else if (name === "sanFirstcheckboxTempHum") {
      // Проверка наличия элементов и изменение состояний
      const checkboxTempHum1 = document.querySelector(".checkboxTempHum1");
      const checkboxTempHum2 = document.querySelector(".checkboxTempHum2");
      if (
        !checkboxTempHum1 ||
        !checkboxTempHum2 ||
        !tempContainer ||
        !humContainer
      ) {
        return;
      }

      if (value === "0") {
        // включаем градусы
        checkboxTempHum1.checked = false;
        checkboxTempHum2.checked = true;
        isGradus = true;
        tempContainer.classList.remove("none");
        humContainer.classList.add("none");
      } else if (value === "1") {
        // включаем проценты
        checkboxTempHum2.checked = false;
        checkboxTempHum1.checked = true;
        tempContainer.classList.add("none");
        humContainer.classList.remove("none");
        isGradus = false;
      }
    } else if (name === "sanFirstsliderMinTemp") {
      // левый ползунок
      let sliderMinel = document.getElementById("sanFirstsliderMinTemp");
      if (sliderMinel) {
        sliderMinel.value = value;
        if (typeof slideOneTemp === "function") {
          slideOneTemp(false);
        }
      }
    } else if (name === "sanFirstsliderMaxTemp") {
      // правый ползунок
      let sliderMaxel = document.getElementById("sanFirstsliderMaxTemp");
      if (sliderMaxel) {
        sliderMaxel.value = value;
        if (typeof slideTwoTemp === "function") {
          slideTwoTemp(false);
        }
      }
    } else if (name === "sanFirstsliderMinHum") {
      // левый ползунок
      let sliderMinel = document.getElementById("sanFirstsliderMinHum");
      if (sliderMinel) {
        sliderMinel.value = value;
        if (typeof slideOneHum === "function") {
          slideOneHum(false);
        }
      }
    } else if (name === "sanFirstsliderMaxHum") {
      // правый ползунок
      let sliderMax = document.getElementById("sanFirstsliderMaxHum");
      if (sliderMax) {
        sliderMax.value = value;
        if (typeof slideTwoHum === "function") {
          slideTwoHum(false);
        }
      }
    } else if (name.includes("sanFirstslider")) {
      // Общий случай для ползунков
      let element = document.getElementById(name);
      if (element) {
        element.value = value;
        if (typeof range === "function") {
          range(element.id, false); // предполагается, что range — это функция, обновляющая интерфейс ползунков
        }
      }
    } else {
      // Общий случай для остальных полей
      let element = document.getElementById(name);
      if (element) {
        if (value === "0") {
          element.classList.remove("active");
        } else if (value === "1") {
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
    changeArduinoSan[event.target.id] =
      arduinoValuesSan[[event.target.id]] + "=1";
  } // иначе 0
  else {
    changeArduinoSan[event.target.id] =
      arduinoValuesSan[[event.target.id]] + "=0";
  }
  event.target.classList.toggle("active");
  sendText(changeArduinoSan[event.target.id]);
}

const increaseRange = (id, val) => {
  let r = currentSection.querySelector(`#${id}`);
  if (val) {
    ++r.value;
  } else {
    --r.value;
  }
  changeArduinoSan[id] = arduinoValuesSan[id] + "=" + r.value;
  let parent = r.parentElement;
  let sliderValue = parent.querySelector(".value");
  sliderValue.textContent = r.value;
  let progress = (r.value / r.max) * 100;
  r.style.background = `linear-gradient(to right,rgb(41, 158, 86)  ${progress}%, #ccc ${progress}%)`;
  sendText(changeArduinoSan[id]);
};
//меняем состояние  ползунка дд

const range = (id, isSend = true) => {
  let sliderBed = currentSection.querySelector(`#${id}`);
  if (sliderBed) {
    let tempSliderValue = sliderBed.value;
    changeArduinoSan[id] = arduinoValuesSan[id] + "=" + tempSliderValue;
    fillColor(`#${id}`);
    if (isSend) {
      sendText(changeArduinoSan[id]);
    }
  }
};
function fillColor(id) {
  let slider = currentSection.querySelector(id);
  let parent = slider.parentElement;
  let sliderValue = parent.querySelector(".value");
  sliderValue.textContent = slider.value;
  let progress = (slider.value / slider.max) * 100;
  slider.style.background = `linear-gradient(to right,rgb(41, 158, 86)  ${progress}%, #ccc ${progress}%)`;
}

let isGradus = false;
//меняем проценты на градусы
const changeRadio = (event) => {
  if (event.target.value == 0) {
    changeArduinoSan[event.target.name] =
      arduinoValuesSan[[event.target.name]] + "=0";

    tempContainer.classList.remove("none");
    humContainer.classList.add("none");
  } else {
    changeArduinoSan[event.target.name] =
      arduinoValuesSan[[event.target.name]] + "=1";
    tempContainer.classList.add("none");
    humContainer.classList.remove("none");
  }
  console.log("change radio");
  sendText(changeArduinoSan[event.target.name]);
};
const changeCheckBox = (event) => {
  if (event.target.checked) {
    changeArduinoSan[event.target.id] =
      arduinoValuesSan[[event.target.id]] + "=1";
  } else {
    changeArduinoSan[event.target.id] =
      arduinoValuesSan[[event.target.id]] + "=0";
  }
  sendText(changeArduinoSan[event.target.id]);
};

let minGap = 0;
let sliderMaxValue = currentSection.querySelector(
  "#sanFirstsliderMinTemp"
)?.max;
//левый двойной ползунок

document.addEventListener("DOMContentLoaded", () => {
  let bedroomSliderShim = currentSection.querySelector("#bedroomSliderShim");
  let bedroomSliderCase = currentSection.querySelector("#bedroomSliderCase");
  if (bedroomSliderShim)
    bedroomSliderShim.addEventListener("input", () =>
      fillColor("#bedroomSliderShim")
    );
  if (bedroomSliderCase)
    bedroomSliderCase.addEventListener("input", () =>
      fillColor("#bedroomSliderCase")
    );

  let sliderMinHum = currentSection.querySelector("#sanFirstsliderMinHum");
  let sliderMaxHum = currentSection.querySelector("#sanFirstsliderMaxHum");
  let sliderMinTemp = currentSection.querySelector("#sanFirstsliderMinTemp");
  let sliderMaxTemp = currentSection.querySelector("#sanFirstsliderMaxTemp");

  // Обработка события, когда ползунок отпускают

  if (sliderMinHum)
    sliderMinHum.addEventListener("change", () => slideOneHum());
  if (sliderMaxHum)
    sliderMaxHum.addEventListener("change", () => slideTwoHum());
  if (sliderMinHum)
    sliderMaxHum.addEventListener("input", () => fillColorHum());
  if (sliderMinHum)
    sliderMaxHum.addEventListener("input", () => fillColorHum());
  if (sliderMinTemp)
    sliderMinTemp.addEventListener("change", () => slideOneTemp());
  if (sliderMaxTemp)
    sliderMaxTemp.addEventListener("change", () => slideTwoTemp());
  if (sliderMinTemp)
    sliderMinTemp.addEventListener("input", () => fillColorTemp());
  if (sliderMaxTemp)
    sliderMaxTemp.addEventListener("input", () => fillColorTemp());
});

function slideOneHum(isSendText = true) {
  let sliderMinHum = currentSection.querySelector("#sanFirstsliderMinHum");
  let sliderMaxHum = currentSection.querySelector("#sanFirstsliderMaxHum");

  field = "sanFirstsliderMinHum";
  if (parseInt(sliderMaxHum.value) - parseInt(sliderMinHum.value) <= minGap) {
    sliderMinHum.value = parseInt(sliderMaxHum.value) - minGap;
  }

  changeArduinoSan[field] = arduinoValuesSan[field] + "=" + sliderMinHum.value;

  fillColorHum();
  if (isSendText) {
    sendText(changeArduinoSan[field]);
  }
}
//правый двойной ползунок
function slideTwoHum(isSendText = true) {
  let sliderMinHum = currentSection.querySelector("#sanFirstsliderMinHum");
  let sliderMaxHum = currentSection.querySelector("#sanFirstsliderMaxHum");

  let field;
  field = "sanFirstsliderMaxHum";
  if (parseInt(sliderMaxHum.value) - parseInt(sliderMinHum.value) <= minGap) {
    sliderMaxHum.value = parseInt(sliderMinHum.value) + minGap;
  }

  changeArduinoSan[field] = arduinoValuesSan[field] + "=" + sliderMaxHum.value;

  fillColorHum();
  if (isSendText) {
    sendText(changeArduinoSan[field]);
  }
}
//зеленая полоса ползунка
function fillColorHum() {
  let sliderMinHum = currentSection.querySelector("#sanFirstsliderMinHum");
  let sliderMaxHum = currentSection.querySelector("#sanFirstsliderMaxHum");
  let sliderTrack = currentSection.querySelector("#slider-track-hum");
  let sliderMaxValue = humContainer.querySelector("#sanFirstsliderMinHum").max;

  let displayValTwo = humContainer.querySelector("#range2");
  let displayValOne = humContainer.querySelector("#range1");
  displayValTwo.textContent = sliderMaxHum.value;
  displayValOne.textContent = sliderMinHum.value;
  let percent1 = (sliderMinHum.value / sliderMaxValue) * 100;
  let percent2 = (sliderMaxHum.value / sliderMaxValue) * 100;
  sliderTrack.style.background = `linear-gradient(to right, #ccc ${percent1}% , rgb(41, 158, 86) ${percent1}% ,rgb(41, 158, 86) ${percent2}%, #ccc ${percent2}%)`;
}

function slideOneTemp(isSendText = true) {
  let sliderMinTemp = currentSection.querySelector("#sanFirstsliderMinTemp");
  let sliderMaxTemp = currentSection.querySelector("#sanFirstsliderMaxTemp");

  field = "sanFirstsliderMinTemp";
  if (parseInt(sliderMaxTemp.value) - parseInt(sliderMinTemp.value) <= minGap) {
    sliderMinTemp.value = parseInt(sliderMaxTemp.value) - minGap;
  }

  changeArduinoSan[field] = arduinoValuesSan[field] + "=" + sliderMinTemp.value;

  fillColorTemp();
  if (isSendText) {
    sendText(changeArduinoSan[field]);
  }
}
//правый двойной ползунок
function slideTwoTemp(isSendText = true) {
  let sliderMinTemp = currentSection.querySelector("#sanFirstsliderMinTemp");
  let sliderMaxTemp = currentSection.querySelector("#sanFirstsliderMaxTemp");

  let field;

  field = "sanFirstsliderMaxTemp";

  if (parseInt(sliderMaxTemp.value) - parseInt(sliderMinTemp.value) <= minGap) {
    sliderMaxTemp.value = parseInt(sliderMinTemp.value) + minGap;
  }

  changeArduinoSan[field] = arduinoValuesSan[field] + "=" + sliderMaxTemp.value;

  fillColorTemp();
  if (isSendText) {
    sendText(changeArduinoSan[field]);
  }
}
//зеленая полоса ползунка
function fillColorTemp() {
  let sliderMinTemp = currentSection.querySelector("#sanFirstsliderMinTemp");
  let sliderMaxTemp = currentSection.querySelector("#sanFirstsliderMaxTemp");
  let sliderTrack = currentSection.querySelector("#slider-track-temp");
  let sliderMaxValue = tempContainer.querySelector(
    "#sanFirstsliderMinTemp"
  ).max;

  let displayValOne = tempContainer.querySelector("#range1");
  let displayValTwo = tempContainer.querySelector("#range2");
  displayValOne.textContent = sliderMinTemp.value;
  displayValTwo.textContent = sliderMaxTemp.value;
  let percent1 = (sliderMinTemp.value / sliderMaxValue) * 100;
  let percent2 = (sliderMaxTemp.value / sliderMaxValue) * 100;
  sliderTrack.style.background = `linear-gradient(to right, #ccc ${percent1}% , rgb(41, 158, 86) ${percent1}% ,rgb(41, 158, 86) ${percent2}%, #ccc ${percent2}%)`;
}
//кнопки + и - на двойном ползунке

const increaseDoubleRangeHum = (val) => {
  let displayValTwo = humContainer.querySelector("#range2");
  let displayValOne = humContainer.querySelector("#range1");
  let sliderMinHum = currentSection.querySelector("#sanFirstsliderMinHum");
  let slidermaxHum = currentSection.querySelector("#sanFirstsliderMaxHum");
  if (val == true) {
    field = "sanFirstsliderMinHum";

    sliderMinHum.value--;
    displayValOne.textContent = sliderMinHum.value / 1;
    changeArduinoSan[field] =
      arduinoValuesSan[field] + "=" + sliderMinHum.value / 1;
  } else if (val == false) {
    field = "sanFirstsliderMaxHum";

    slidermaxHum.value++;
    displayValTwo.textContent = slidermaxHum.value / 1;

    changeArduinoSan[field] =
      arduinoValuesSan[field] + "=" + slidermaxHum.value / 1;
  }
  fillColorHum();
  sendText(changeArduinoSan[field]);
};

const increaseDoubleRangeTemp = (val) => {
  let displayValTwo = tempContainer.querySelector("#range2");
  let displayValOne = tempContainer.querySelector("#range1");
  let sliderMinTemp = currentSection.querySelector("#sanFirstsliderMinTemp");
  let slidermaxTemp = currentSection.querySelector("#sanFirstsliderMaxTemp");
  if (val == true) {
    field = "sanFirstsliderMinTemp";

    sliderMinTemp.value--;
    displayValOne.textContent = sliderMinTemp.value / 1;
    changeArduinoSan[field] =
      arduinoValuesSan[field] + "=" + sliderMinTemp.value / 1;
  } else if (val == false) {
    field = "sanFirstsliderMaxTemp";

    slidermaxTemp.value++;
    displayValTwo.textContent = slidermaxTemp.value / 1;

    changeArduinoSan[field] =
      arduinoValuesSan[field] + "=" + slidermaxTemp.value / 1;
  }
  fillColorTemp();
  sendText(changeArduinoSan[field]);
};

function sendText(data) {
  console.log(data);
  Socket.send(data);
}

window.onload = function (e) {
  let localIp = localStorage.getItem("ip");
  console.log(localIp);
  if (!!localIp) {
    init(window.location.hostname);
  }
};
