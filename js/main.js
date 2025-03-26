const getServers = async () => {
  try {
    let url = `http://${window.location.hostname}/ssdp.list.json`;
    const response = await fetch(url);
    let text = await response.text();
    text = text.replace(/[\x00-\x1F\x7F]/g, "");
    let servers = JSON.parse(text);

    return servers;
  } catch (error) {
    console.error("Ошибка при парсинге JSON:", error);
  }
};
document.addEventListener("DOMContentLoaded", async () => {
  const toggleButton = document.getElementById("toggleButton");
  const toggleBlock = document.getElementById("toggleBlock");

  toggleButton.addEventListener("click", function () {
    if (toggleBlock.classList.contains("open")) {
      toggleBlock.classList.remove("open");
    } else {
      toggleBlock.classList.add("open");
    }
  });

  let levels = document.querySelectorAll(".levels");
  let servers = await getServers();
  console.log(servers);
  console.log(levels);
  levels.forEach((i) => {
    let level = i.name;
    if (servers[level] == undefined) {
      i.classList.add("error");
    } else {
      i.classList.remove("error");
    }
    i.addEventListener("click", async (event) => {
      console.log(servers);
      let level = event.currentTarget.name;
      console.log("level", level);
      const pageName = i.getAttribute("data-link");
      urlObject = new URL(window.location.href);
      console.log(servers[level]);
      urlObject.hostname = servers[level];
      if (servers[level] != undefined) {
        localStorage.setItem("ip", urlObject.hostname);
        urlObject.pathname = pageName;
        console.log(urlObject.href);
        window.location.assign(urlObject.href);
      }
    });
  });
  let localIp = localStorage.getItem("ip");
  console.log(localIp);
  if (!!localIp) {
    init(localIp);
  }
  function init(ip) {
    Socket = new WebSocket("ws://" + ip + ":81/");
    Socket.onmessage = function (event) {
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
  function sendText(data) {
    console.log(data);
    Socket.send(JSON.stringify(data));
  }

  const wifiBtn = document.getElementById("wifi-btn");
  // Функция для обработки данных формы
  wifiBtn.addEventListener("click", handleFormSubmit);
  function handleFormSubmit(event) {
    event.preventDefault(); // Предотвращаем стандартное поведение формы

    // Получаем значения полей формы
    const networkName = document.getElementById("networkName").value;
    const password = document.getElementById("password").value;

    // Выводим данные в консоль или обрабатываем их
    console.log("Имя сети:", networkName);
    console.log("Пароль:", password);
    const data = {
      networkName: networkName,
      password: password,
    };
    sendText(data);
  }
});
