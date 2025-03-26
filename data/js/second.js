window.isMouseDown = false;
document.addEventListener("mousedown", () => {
  window.isMouseDown = true;
});
document.addEventListener("mouseup", () => {
  window.isMouseDown = false;
});

let changeArduinoSan = {
  //санузел
  sanSpot: "",
  sanLight: "",
  sanShim: "",
  sanSliderShim: "",
  sanWindMotion: "",
  sanShimMotion: "",
  checkboxTempHum: "",
  sanWind: "",
  sliderMinTemp: "",
  sliderMaxTemp: "",
  sliderMinHum: "",
  sliderMaxHum: "",

  //спальня
  bedroomSpot: "",
  bedroomTrack: "",
  bedroomShim: "",
  bedroomSliderShim: "",
  bedroomBra: "",
  bedroomLamp: "",
  bedroomCase: "",
  bedroomSliderCase: "",
  //детская
  childrenSpot: "",
  childrenTrack: "",
  childrenShim: "",
  childrenSliderShim: "",
  //офис
  officeBra: "",
  officeRightSpot: "",
  officeLeftSpot: "",
  //прачечная
  sanWindLaundry: "",
  checkboxTempHumLaundry: "",
  sliderMinTempLaundry: "",
  sliderMaxTempLaundry: "",
  sliderMinHumLaundry: "",
  sliderMaxHumLaundry: "",
  laundrySpot: "",
  laundryBra: "",
  laundryMotionBra: "",

  //2 этаж
  temperature2Etaj: "",
  humidity2Etaj: "",
};

let arduinoValuesSan = {
  //санузел
  sanSpot: "pinout_xxx_sanSpot",
  sanLight: "pinout_xxx_sanLight",
  sanShim: "param_save_sanShim_xxx",
  sanWind: "param_save_sanWind_xxx",
  sanSliderShim: "param_save_sanSliderShim_xxx",
  sanWindMotion: "param_save_sanWindMotion_xxx",
  sanShimMotion: "param_save_sanShimMotion_xxx",
  checkboxTempHum: "param_save_checkboxTempHum_xxx",
  sliderMinTemp: "param_save_sliderMinTemp_xxx",
  sliderMaxTemp: "param_save_sliderMaxTemp_xxx",
  sliderMinHum: "param_save_sliderMinHum_xxx",
  sliderMaxHum: "param_save_sliderMaxHum_xxx",
  //спальня
  bedroomSpot: "pinout_xxx_bedroomSpot",
  bedroomTrack: "pinout_xxx_bedroomTrack",
  bedroomShim: "param_send_bedroomShim_xxx",
  bedroomSliderShim: "param_save_bedroomSliderShim_xxx",
  bedroomBra: "pinout_xxx_bedroomBra",
  bedroomLamp: "pinout_xxx_bedroomLamp",
  bedroomCase: "param_send_bedroomCase_xxx",
  bedroomSliderCase: "param_save_bedroomSliderCase_xxx",
  //дедская
  childrenSpot: "pinout_xxx_childrenSpot",
  childrenTrack: "pinout_xxx_childrenTrack",
  childrenShim: "param_send_childrenShim_xxx",
  childrenSliderShim: "param_save_childrenSliderShim_xxx",
  //кабинет
  officeBra: "pinout_xxx_officeBra",
  officeRightSpot: "pinout_xxx_officeRightSpot",
  officeLeftSpot: "pinout_xxx_officeLeftSpot",

  //прачка
  sanWindLaundry: "param_save_sanWindLaundry_xxx",
  checkboxTempHumLaundry: "param_save_checkboxTempHumLaundry_xxx",
  sliderMinTempLaundry: "param_save_sliderMinTempLaundry_xxx",
  sliderMaxTempLaundry: "param_save_sliderMaxTempLaundry_xxx",
  sliderMinHumLaundry: "param_save_sliderMinHumLaundry_xxx",
  sliderMaxHumLaundry: "param_save_sliderMaxHumLaundry_xxx",
  laundrySpot: "pinout_xxx_laundrySpot",
  laundryBra: "pinout_xxx_laundryBra",
  laundryMotionBra: "param_save_laundryMotionBra_xxx",
};
//!!! получаем данные с сервера
let currentSection = document;

var Socket;

let tempContainer = currentSection.querySelector("#temp-range");
let humContainer = currentSection.querySelector("#hum-range");
function init(ip) {
  Socket = new WebSocket("ws://" + ip + ":81/");
  Socket.onmessage = function (event) {
    processReceivedCommand(event);
    //console.log(event);
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
  //объект целиком
  console.log(evt.data);
  Object.keys(myData).forEach((key) => {
    name = key;
    value = myData[key];

    if (name.includes("Motion")) {
      let element = document.getElementById(name);

      if (element) {
        if (value == "0") {
          element.checked = false;
          element.value = 0;
        } else if (value == "1") {
          element.checked = true;
          element.value = 1;
        }
      }
    } else if (name == "sanSliderShim") {
      // ползунок ДД подсветки
      let sanSliderShimel = document.getElementById("sanSliderShim");
      if (sanSliderShimel) {
        sanSliderShimel.value = value;
        range(sanSliderShimel.id, false);
      }
    } else if (name == "checkboxTempHum") {
      // ДД %/градусы
      let checkbox1 = document.querySelector(".checkboxTempHum1");
      let checkbox2 = document.querySelector(".checkboxTempHum2");
      if (checkbox1 && checkbox2) {
        if (value == "0") {
          checkbox1.checked = false;
          checkbox2.checked = true;
          isGradus = true;
          tempContainer.classList.remove("none");
          humContainer.classList.add("none");
        } else if (value == "1") {
          checkbox1.checked = true;
          checkbox2.checked = false;
          tempContainer.classList.add("none");
          humContainer.classList.remove("none");
          isGradus = false;
        }
      }
    } else if (name == "sliderMinTemp") {
      //левый ползунок
      let sliderMinel = document.getElementById("sliderMinTemp");
      if (sliderMinel) {
        sliderMinel.value = value;

        slideOneTemp(false);
      }
    } else if (name == "sliderMaxTemp") {
      //правый ползунок
      let sliderMaxel = document.getElementById("sliderMaxTemp");
      if (sliderMaxel) {
        sliderMaxel.value = value;
        slideTwoTemp(false);
      }
    } else if (name == "sliderMinHum") {
      //левый ползунок
      let sliderMinel = document.getElementById("sliderMinHum");
      if (sliderMinel) {
        sliderMinel.value = value;

        slideOneHum(false);
      }
    } else if (name == "sliderMaxHum") {
      //правый ползунок
      let sliderMax = document.getElementById("sliderMaxHum");
      if (sliderMax) {
        sliderMax.value = value;
        slideTwoHum(false);
      }
    } else if (name == "humiditySan") {
      // получаем с сервера проценты
      let element = document.getElementById("humiditySan");
      if (element) {
        element.textContent = value;
      }
    } else if (name == "temperatureSan") {
      // получаем с сервера градусы
      let element = document.getElementById("temperatureSan");
      if (element) {
        element.textContent = value;
      }
    } else if (name == "temperature2Etaj") {
      // получаем с сервера проценты
      let element = document.getElementById("temperature2Etaj");
      if (element) {
        element.textContent = value;
      }
    } else if (name == "humidity2Etaj") {
      // получаем с сервера градусы
      let element = document.getElementById("humidity2Etaj");
      if (element) {
        element.textContent = value;
      }
    } else if (name == "bedroomSliderShim") {
      // ползунок ДД подсветки
      let bedroomSliderShimel = document.getElementById("bedroomSliderShim");
      if (bedroomSliderShimel) {
        bedroomSliderShimel.value = value;
        range(bedroomSliderShimel.id, false);
      }
    } else if (name == "bedroomSliderCase") {
      // ползунок ДД подсветки
      let bedroomSliderCaseel = document.getElementById("bedroomSliderCase");
      if (bedroomSliderCaseel) {
        bedroomSliderCaseel.value = value;
        range(bedroomSliderCaseel.id, false);
      }
    } else if (name == "childrenSliderShim") {
      // ползунок ДД подсветки
      let childrenSliderShimel = document.getElementById("childrenSliderShim");
      if (childrenSliderShimel) {
        childrenSliderShimel.value = value;
        range(childrenSliderShimel.id, false);
      }
    } else if (name == "checkboxTempHumLaundry") {
      // ДД %/градусы
      let checkbox1 = document.querySelector(".checkboxTempHumLaundry1");
      let checkbox2 = document.querySelector(".checkboxTempHumLaundry2");
      if (checkbox1 && checkbox2) {
        if (value == "0") {
          checkbox1.checked = false;
          checkbox2.checked = true;
          isGradus = true;
          tempContainer.classList.remove("none");
          humContainer.classList.add("none");
        } else if (value == "1") {
          checkbox1.checked = true;
          checkbox2.checked = false;
          tempContainer.classList.add("none");
          humContainer.classList.remove("none");
          isGradus = false;
        }
      }
    } else if (name == "sliderMinTempLaundry") {
      //левый ползунок
      let sliderMinel = document.getElementById("sliderMinTempLaundry");
      if (sliderMinel) {
        sliderMinel.value = value;

        slideOneTempLaundry(false);
      }
    } else if (name == "sliderMaxTempLaundry") {
      //правый ползунок
      let sliderMaxel = document.getElementById("sliderMaxTempLaundry");
      if (sliderMaxel) {
        sliderMaxel.value = value;

        slideTwoTempLaundry(false);
      }
    } else if (name == "sliderMinHumLaundry") {
      //левый ползунок
      let sliderMinel = document.getElementById("sliderMinHumLaundry");
      if (sliderMinel) {
        sliderMinel.value = value;

        slideOneHumLaundry(false);
      }
    } else if (name == "sliderMaxHumLaundry") {
      //правый ползунок
      let sliderMax = document.getElementById("sliderMaxHumLaundry");
      if (sliderMax) {
        sliderMax.value = value;

        slideTwoHumLaundry(false);
      }
    } else if (name == "humidityPr") {
      //  получаем с сервера  проценты для прачки
      let el = document.getElementById("humidityPr");
      if (el) el.textContent = value;
    } else if (name == "temperaturePr") {
      console.log("temperaturePr получен");
      let el = document.getElementById("temperaturePr");
      if (el) el.textContent = value;
    } else {
      // Общий случай для остальных полей
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
    changeArduinoSan[event.target.id] =
      arduinoValuesSan[[event.target.id]] + "=0";
  } // иначе 0
  else {
    changeArduinoSan[event.target.id] =
      arduinoValuesSan[[event.target.id]] + "=1";
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
let sliderMaxValue = currentSection.querySelector("#sliderMinTempLaundry")?.max;
//левый двойной ползунок

document.addEventListener("DOMContentLoaded", () => {
  //сан
  let sliderMinHum = currentSection.querySelector("#sliderMinHum");
  let sliderMaxHum = currentSection.querySelector("#sliderMaxHum");
  let sliderMinTemp = currentSection.querySelector("#sliderMinTemp");
  let sliderMaxTemp = currentSection.querySelector("#sliderMaxTemp");
  // Обработка события, когда ползунок отпускают

  if (sliderMinHum)
    sliderMinHum.addEventListener("change", () => slideOneHum());
  if (sliderMaxHum)
    sliderMaxHum.addEventListener("change", () => slideTwoHum());
  if (sliderMaxHum)
    sliderMaxHum.addEventListener("input", () => fillColorHum());
  if (sliderMinHum)
    sliderMinHum.addEventListener("input", () => fillColorHum());
  if (sliderMinTemp)
    sliderMinTemp.addEventListener("change", () => slideOneTemp());
  if (sliderMaxTemp)
    sliderMaxTemp.addEventListener("change", () => slideTwoTemp());
  if (sliderMinTemp)
    sliderMinTemp.addEventListener("input", () => fillColorTemp());
  if (sliderMaxTemp)
    sliderMaxTemp.addEventListener("input", () => fillColorTemp());
  //прачка
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

  let sliderMinHumLaundry = currentSection.querySelector(
    "#sliderMinHumLaundry"
  );
  let sliderMaxHumLaundry = currentSection.querySelector(
    "#sliderMaxHumLaundry"
  );
  let sliderMinTempLaundry = currentSection.querySelector(
    "#sliderMinTempLaundry"
  );
  let sliderMaxTempLaundry = currentSection.querySelector(
    "#sliderMaxTempLaundry"
  );

  if (sliderMinHumLaundry)
    sliderMinHumLaundry.addEventListener("change", () => slideOneHumLaundry());
  if (sliderMaxHumLaundry)
    sliderMaxHumLaundry.addEventListener("change", () => slideTwoHumLaundry());
  if (sliderMaxHumLaundry)
    sliderMaxHumLaundry.addEventListener("input", () => fillColorHumLaundry());
  if (sliderMinHumLaundry)
    sliderMinHumLaundry.addEventListener("input", () => fillColorHumLaundry());
  if (sliderMinTempLaundry)
    sliderMinTempLaundry.addEventListener("change", () =>
      slideOneTempLaundry()
    );
  if (sliderMaxTempLaundry)
    sliderMaxTempLaundry.addEventListener("change", () =>
      slideTwoTempLaundry()
    );
  if (sliderMinTempLaundry)
    sliderMinTempLaundry.addEventListener("input", () =>
      fillColorTempLaundry()
    );
  if (sliderMaxTempLaundry)
    sliderMaxTempLaundry.addEventListener("input", () =>
      fillColorTempLaundry()
    );
  let sliderSan = currentSection.querySelector("#sanSliderShim");
  if (sliderSan) {
    sliderSan.addEventListener("change", () => {
      sendText(changeArduinoSan.sanSliderShim);
      range();
    });
    sliderSan.addEventListener("input", () => fillColor("#sanSliderShim"));
  }
  let childSan = currentSection.querySelector("#childrenSliderShim");
  if (childSan) {
    childSan.addEventListener("change", () => {
      sendText(changeArduinoSan.childrenSliderShim);
      range();
    });
    childSan.addEventListener("input", () => fillColor("#childrenSliderShim"));
  }
});
//санузел
function slideOneHum(isSendText = true) {
  let sliderMinHum = currentSection.querySelector("#sliderMinHum");
  let sliderMaxHum = currentSection.querySelector("#sliderMaxHum");

  field = "sliderMinHum";
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
  let sliderMinHum = currentSection.querySelector("#sliderMinHum");
  let sliderMaxHum = currentSection.querySelector("#sliderMaxHum");

  let field;
  field = "sliderMaxHum";
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
  let sliderMinHum = currentSection.querySelector("#sliderMinHum");
  let sliderMaxHum = currentSection.querySelector("#sliderMaxHum");
  let sliderTrack = currentSection.querySelector("#slider-track-hum");
  let sliderMaxValue = humContainer.querySelector("#sliderMinHum").max;

  let displayValTwo = humContainer.querySelector("#range2");
  let displayValOne = humContainer.querySelector("#range1");
  displayValTwo.textContent = sliderMaxHum.value;
  displayValOne.textContent = sliderMinHum.value;
  let percent1 = (sliderMinHum.value / sliderMaxValue) * 100;
  let percent2 = (sliderMaxHum.value / sliderMaxValue) * 100;
  sliderTrack.style.background = `linear-gradient(to right, #ccc ${percent1}% , rgb(41, 158, 86) ${percent1}% ,rgb(41, 158, 86) ${percent2}%, #ccc ${percent2}%)`;
}

function fillColorTemp() {
  let sliderMinTemp = currentSection.querySelector("#sliderMinTemp");
  let sliderMaxTemp = currentSection.querySelector("#sliderMaxTemp");
  let sliderTrack = currentSection.querySelector("#slider-track-temp");
  let sliderMaxValue = tempContainer.querySelector("#sliderMinTemp").max;

  let displayValOne = tempContainer.querySelector("#range1");
  let displayValTwo = tempContainer.querySelector("#range2");
  displayValOne.textContent = sliderMinTemp.value;
  displayValTwo.textContent = sliderMaxTemp.value;
  let percent1 = (sliderMinTemp.value / sliderMaxValue) * 100;
  let percent2 = (sliderMaxTemp.value / sliderMaxValue) * 100;
  sliderTrack.style.background = `linear-gradient(to right, #ccc ${percent1}% , rgb(41, 158, 86) ${percent1}% ,rgb(41, 158, 86) ${percent2}%, #ccc ${percent2}%)`;
}

function slideOneTemp(isSendText = true) {
  let sliderMinTemp = currentSection.querySelector("#sliderMinTemp");
  let sliderMaxTemp = currentSection.querySelector("#sliderMaxTemp");

  field = "sliderMinTemp";
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
  let sliderMinTemp = currentSection.querySelector("#sliderMinTemp");
  let sliderMaxTemp = currentSection.querySelector("#sliderMaxTemp");

  let field;

  field = "sliderMaxTemp";

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

//кнопки + и - на двойном ползунке

const increaseDoubleRangeHum = (val) => {
  let displayValTwo = humContainer.querySelector("#range2");
  let displayValOne = humContainer.querySelector("#range1");
  let sliderMinHum = currentSection.querySelector("#sliderMinHum");
  let slidermaxHum = currentSection.querySelector("#sliderMaxHum");
  if (val == true) {
    field = "sliderMinHum";

    sliderMinHum.value--;
    displayValOne.textContent = sliderMinHum.value / 1;
    changeArduinoSan[field] =
      arduinoValuesSan[field] + "=" + sliderMinHum.value / 1;
  } else if (val == false) {
    field = "sliderMaxHum";

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
  let sliderMinTemp = currentSection.querySelector("#sliderMinTemp");
  let slidermaxTemp = currentSection.querySelector("#sliderMaxTemp");
  if (val == true) {
    field = "sliderMinTemp";

    sliderMinTemp.value--;
    displayValOne.textContent = sliderMinTemp.value / 1;
    changeArduinoSan[field] =
      arduinoValuesSan[field] + "=" + sliderMinTemp.value / 1;
  } else if (val == false) {
    field = "sliderMaxTemp";

    slidermaxTemp.value++;
    displayValTwo.textContent = slidermaxTemp.value / 1;

    changeArduinoSan[field] =
      arduinoValuesSan[field] + "=" + slidermaxTemp.value / 1;
  }
  fillColorTemp();
  sendText(changeArduinoSan[field]);
};
//прачка
function slideOneHumLaundry(isSendText = true) {
  let sliderMinHumLaundry = currentSection.querySelector(
    "#sliderMinHumLaundry"
  );
  let sliderMaxHumLaundry = currentSection.querySelector(
    "#sliderMaxHumLaundry"
  );

  field = "sliderMinHumLaundry";
  if (
    parseInt(sliderMaxHumLaundry.value) - parseInt(sliderMinHumLaundry.value) <=
    minGap
  ) {
    sliderMinHumLaundry.value = parseInt(sliderMaxHumLaundry.value) - minGap;
  }

  changeArduinoSan[field] =
    arduinoValuesSan[field] + "=" + sliderMinHumLaundry.value;

  fillColorHumLaundry();
  if (isSendText) {
    sendText(changeArduinoSan[field]);
  }
}
//правый двойной ползунок
function slideTwoHumLaundry(isSendText = true) {
  let sliderMinHumLaundry = currentSection.querySelector(
    "#sliderMinHumLaundry"
  );
  let sliderMaxHumLaundry = currentSection.querySelector(
    "#sliderMaxHumLaundry"
  );

  let field;
  field = "sliderMaxHumLaundry";
  if (
    parseInt(sliderMaxHumLaundry.value) - parseInt(sliderMinHumLaundry.value) <=
    minGap
  ) {
    sliderMaxHumLaundry.value = parseInt(sliderMinHumLaundry.value) + minGap;
  }

  changeArduinoSan[field] =
    arduinoValuesSan[field] + "=" + sliderMaxHumLaundry.value;

  fillColorHumLaundry();
  if (isSendText) {
    sendText(changeArduinoSan[field]);
  }
}
//зеленая полоса ползунка
function fillColorHumLaundry() {
  let sliderMinHumLaundry = currentSection.querySelector(
    "#sliderMinHumLaundry"
  );
  let sliderMaxHumLaundry = currentSection.querySelector(
    "#sliderMaxHumLaundry"
  );
  let sliderTrack = currentSection.querySelector("#slider-track-hum");
  let sliderMaxValue = humContainer.querySelector("#sliderMinHumLaundry").max;

  let displayValTwo = humContainer.querySelector("#range2");
  let displayValOne = humContainer.querySelector("#range1");
  displayValTwo.textContent = sliderMaxHumLaundry.value;
  displayValOne.textContent = sliderMinHumLaundry.value;
  let percent1 = (sliderMinHumLaundry.value / sliderMaxValue) * 100;
  let percent2 = (sliderMaxHumLaundry.value / sliderMaxValue) * 100;
  sliderTrack.style.background = `linear-gradient(to right, #ccc ${percent1}% , rgb(41, 158, 86) ${percent1}% ,rgb(41, 158, 86) ${percent2}%, #ccc ${percent2}%)`;
}

function fillColorTempLaundry() {
  let sliderMinTempLaundry = currentSection.querySelector(
    "#sliderMinTempLaundry"
  );
  let sliderMaxTempLaundry = currentSection.querySelector(
    "#sliderMaxTempLaundry"
  );
  let sliderTrack = currentSection.querySelector("#slider-track-temp");
  let sliderMaxValue = tempContainer.querySelector("#sliderMinTempLaundry").max;

  let displayValOne = tempContainer.querySelector("#range1");
  let displayValTwo = tempContainer.querySelector("#range2");
  displayValOne.textContent = sliderMinTempLaundry.value;
  displayValTwo.textContent = sliderMaxTempLaundry.value;
  let percent1 = (sliderMinTempLaundry.value / sliderMaxValue) * 100;
  let percent2 = (sliderMaxTempLaundry.value / sliderMaxValue) * 100;
  sliderTrack.style.background = `linear-gradient(to right, #ccc ${percent1}% , rgb(41, 158, 86) ${percent1}% ,rgb(41, 158, 86) ${percent2}%, #ccc ${percent2}%)`;
}

function slideOneTempLaundry(isSendText = true) {
  let sliderMinTempLaundry = currentSection.querySelector(
    "#sliderMinTempLaundry"
  );
  let sliderMaxTempLaundry = currentSection.querySelector(
    "#sliderMaxTempLaundry"
  );

  field = "sliderMinTempLaundry";
  if (
    parseInt(sliderMaxTempLaundry.value) -
      parseInt(sliderMinTempLaundry.value) <=
    minGap
  ) {
    sliderMinTempLaundry.value = parseInt(sliderMaxTempLaundry.value) - minGap;
  }

  changeArduinoSan[field] =
    arduinoValuesSan[field] + "=" + sliderMinTempLaundry.value;

  fillColorTempLaundry();
  if (isSendText) {
    sendText(changeArduinoSan[field]);
  }
}
//правый двойной ползунок
function slideTwoTempLaundry(isSendText = true) {
  let sliderMinTempLaundry = currentSection.querySelector(
    "#sliderMinTempLaundry"
  );
  let sliderMaxTempLaundry = currentSection.querySelector(
    "#sliderMaxTempLaundry"
  );

  let field;

  field = "sliderMaxTempLaundry";

  if (
    parseInt(sliderMaxTempLaundry.value) -
      parseInt(sliderMinTempLaundry.value) <=
    minGap
  ) {
    sliderMaxTempLaundry.value = parseInt(sliderMinTempLaundry.value) + minGap;
  }

  changeArduinoSan[field] =
    arduinoValuesSan[field] + "=" + sliderMaxTempLaundry.value;

  fillColorTempLaundry();
  if (isSendText) {
    sendText(changeArduinoSan[field]);
  }
}
//зеленая полоса ползунка

//кнопки + и - на двойном ползунке

const increaseDoubleRangeHumLaundry = (val) => {
  let displayValTwo = humContainer.querySelector("#range2");
  let displayValOne = humContainer.querySelector("#range1");
  let sliderMinHumLaundry = currentSection.querySelector(
    "#sliderMinHumLaundry"
  );
  let slidermaxHumLaundry = currentSection.querySelector(
    "#sliderMaxHumLaundry"
  );
  if (val == true) {
    field = "sliderMinHumLaundry";

    sliderMinHumLaundry.value--;
    displayValOne.textContent = sliderMinHumLaundry.value / 1;
    changeArduinoSan[field] =
      arduinoValuesSan[field] + "=" + sliderMinHumLaundry.value / 1;
  } else if (val == false) {
    field = "sliderMaxHumLaundry";

    slidermaxHumLaundry.value++;
    displayValTwo.textContent = slidermaxHumLaundry.value / 1;

    changeArduinoSan[field] =
      arduinoValuesSan[field] + "=" + slidermaxHumLaundry.value / 1;
  }
  fillColorHumLaundry();
  sendText(changeArduinoSan[field]);
};

const increaseDoubleRangeTempLaundry = (val) => {
  let displayValTwo = tempContainer.querySelector("#range2");
  let displayValOne = tempContainer.querySelector("#range1");
  let sliderMinTempLaundry = currentSection.querySelector(
    "#sliderMinTempLaundry"
  );
  let slidermaxTempLaundry = currentSection.querySelector(
    "#sliderMaxTempLaundry"
  );
  if (val == true) {
    field = "sliderMinTempLaundry";

    sliderMinTempLaundry.value--;
    displayValOne.textContent = sliderMinTempLaundry.value / 1;
    changeArduinoSan[field] =
      arduinoValuesSan[field] + "=" + sliderMinTempLaundry.value / 1;
  } else if (val == false) {
    field = "sliderMaxTempLaundry";

    slidermaxTempLaundry.value++;
    displayValTwo.textContent = slidermaxTempLaundry.value / 1;

    changeArduinoSan[field] =
      arduinoValuesSan[field] + "=" + slidermaxTempLaundry.value / 1;
  }
  fillColorTempLaundry();
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
