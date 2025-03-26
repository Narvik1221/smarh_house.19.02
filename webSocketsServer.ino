//определение функцию в определение функцию вставлять нельзя
void initWebSocketsServer() {
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
}
void webSocketEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length) {

  switch (type) {
    case WStype_DISCONNECTED:
      //Serial.printf("[%u] Disconnected!\n", num);
      //setOptions("webSocket", webSocket.connectedClients(false));
      break;
    case WStype_CONNECTED: // при соединении
      {
        IPAddress ip = webSocket.remoteIP(num);
        //setOptions("webSocket", webSocket.connectedClients(false));
        //Serial.printf("[%u] Connected from %d.%d.%d.%d url: %s\n", num, ip[0], ip[1], ip[2], ip[3], payload);

        // send message to client
        webSocket.sendTXT(num, jsonLive); // строка посылает
        
        // send message to client
        // webSocket.sendTXT(num, "message here");

        // send data to all connected clients
        // webSocket.broadcastTXT("message here");

      }
      break;
    case WStype_TEXT: // страница шлет текст
      if (length > 0) {
        String com = String((const char *)payload);
        Serial.println(com);
        uint8_t pozishen = com.indexOf("="); //ищем позицию равно
        String tmp = com.substring(0, pozishen);
        String stateS = com.substring(pozishen + 1);
        tmp.replace("_", " ");
        tmp.replace("xxx", stateS);
        Serial.println(tmp);
        sCmd.readStr(tmp);

      }
      break;
    case WStype_BIN:  // данные в бинарном формате
      break;
    case WStype_ERROR:
    case WStype_FRAGMENT_TEXT_START:
    case WStype_FRAGMENT_BIN_START:
    case WStype_FRAGMENT:
    case WStype_FRAGMENT_FIN:
      break;
  }
}

// Отправка данных в Socket всем получателям
// Параметры: Имя ключа, Данные, Предыдущее значение
template <typename T> // функция для всех типов
bool SoketData(const String& key, const T& value, const T& data_old) {
  if (ESP.getFreeHeap() > mem) {
    if (webSocket.connectedClients(false) > 0) {
      if (data_old != value) {
        eString message = "{}"; // Создаем пустое JSON-сообщение
        message.jsonWrite(key, value); // Используем перегрузку для записи данных
        webSocket.broadcastTXT(message); // Отправляем сообщение
        return true;
      }
    }
  }
  return false;
}
