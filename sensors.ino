
void initTach() {  //функция
  // TACH 22 0 20 1 (пин, прифекс кнопки(№),время касания, инверсия)
  uint8_t numTach = getOptionsInt("numTach");
  if (numTach <= NUM_BUTTONS) {
    uint8_t pin = readArgsInt();
    String nameTach = readArgsString();
    uint16_t bDelay = readArgsInt();
    // ++numTach;
    jsonOptions.jsonWrite("numTach", numTach + 1);
    jsonOptions.jsonWrite("in" + String(numTach), nameTach);
    // buttons[numTach].attach(pin, INPUT_PULLUP); //элементу массива buttons под номером num преобразую строку в число и испо метод из buttons(привязывает )
    //(обьект нум обращаюсь к встроенному методу и преобразую в число)
    buttons[numTach] = new BounceExtended(mcpKbr, pin);
    buttons[numTach]->interval(bDelay);
    but[numTach] = true;   // истина
    bool inv = readArgsInt();   //читаем число функцией
    jsonOptions.jsonWrite(nameTach + "Inv", inv);
    jsonLive.jsonWrite(nameTach, 0); //тач с номером значение 0 (объект с методом в методе параметры)
    modulesReg("tach" + String(numTach));
  }
}
void handleButtons() {
  static uint8_t num = 0; //статик запоминает последнее значение
  String numS = String(num, DEC); //спомощю функции String() преобразования в строку преобразует к десятичному формату
  if (but[num]) {
    String nameTach = jsonOptions.jsonRead("in" + numS);
    buttons[num]->update();;  // элемент массива объектов обновляется
    if ( buttons[num]->fell()) { //если кнопка нажата
      jsonLive.jsonWrite(nameTach, 1);
      jsonLive.jsonWrite(nameTach + "Fell", 1);
      flag = true;
    }
    if ( buttons[num]->rose()) { //если кнопка отжата
      jsonLive.jsonWrite(nameTach, 0);
      jsonLive.jsonWrite(nameTach + "Rose", 1);
      flag = true;
    }
  }
  num++;
  if (num == NUM_BUTTONS) num = 0;
}



void initOneWire() {
  //DS  33 name
  //DS  пин имя
  uint8_t pin = readArgsInt();
  uint8_t num = getOptionsInt("dsNum");
  String sNum = String(num); // преобраз в строку
  String namE = readArgsString();
  setOptions("dsName" + sNum, namE);
  oneWire[num] = new OneWire(pin);
  sensTemp[num].setOneWire(oneWire[num]); // объект sensTemp связываем с шиной OneWire по методу setOneWire (команда(метод) для библиотеки)
  sensTemp[num].setResolution(10);  // 10 бит влияет на точность измерения
  sensTemp[num].begin();
  sensTemp[num].requestTemperatures(); //запуск первого измерения температуры
  setOptions("dsNum", num + 1);
  sensTemp[num].requestTemperatures();
  float tempC = sensTemp[num].getTempCByIndex(0);
  tempC = tempC * 10;
  tempC = round(tempC);
  tempC = tempC / 10;
  setLive("temperature" + namE, tempC);
  ts.add(tDs, 1000, [&](void*) { // Включить чтение датчика с интервалом t (ts.add... рбъекту добавить задачу)
    readDs();
  }, nullptr, true);
  modulesReg("temperature");
}

void readDs() {
  static uint8_t num = 0;
  while (num < getOptionsInt("dsNum")) {
    String namE = getOptions("dsName" + String(num));
    String keyTemp = "temperature" + namE; //temperatureDht
    sensTemp[num].setWaitForConversion(false);  // makes it async
    sensTemp[num].requestTemperatures();
    sensTemp[num].setWaitForConversion(true);
    float tempC = sensTemp[num].getTempCByIndex(0);
    if(tempC == -127.00){tempC = getLiveFloat(keyTemp);
    } else {
    tempC = tempC * 10;
    tempC = round(tempC);
    tempC = tempC / 10;
    }
    SoketData (keyTemp, tempC, getLiveFloat(keyTemp));
    setLive(keyTemp, tempC);
    num++;
  }
  //if (num != 0) flag = true;
  num = 0;
}

void initDht() {  // датчик температуры влажностиDHT
  // DHT 30 0 San
  // DHT пин; НОМЕР имя
  uint8_t pin = readArgsInt();
  uint8_t num = getOptionsInt("dhtNum");
  // uint8_t num = readArgsInt();
  String sNum = String(num); // преобраз в строку
  String namE = readArgsString();
  setOptions("dhtname" + sNum, namE);
  sensor_arr[num].setPin(pin);
  sensor_arr[num].begin();
  setOptions("dhtname", num + 1);
  uint8_t zero = 0;

  jsonLive.jsonWrite("humidity" + namE, zero); //влажность
  jsonLive.jsonWrite("temperature" + namE, zero); // температура
  setOptions("dhtNum", getOptionsInt("dhtNum") + 1); // достанит числ из dhtNum + 1 и отправит в dhtNum
  ts.add(tDht, 4000, [&](void*) { // Включить чтение датчика с интервалом t (ts.add... рбъекту добавить задачу)
    readDht1();
  }, nullptr, false);
  modulesReg("humidity" + namE); //humidityDht
  modulesReg("temperature" + namE); //temperatureDht
  //}
}

void readDht1() {
  static uint8_t num = 0;
  while (num < getOptionsInt("dhtNum")) {
    String namE = getOptions("dhtname" + String(num));
    String keyTemp = "temperature" + namE; //temperatureDht
    String keyHum = "humidity" + namE; //humidityDht
    if (sensor_arr[num].read() == 0) {
      float dhH = sensor_arr[num].get_Humidity();
      dhH = round(dhH);
      SoketData (keyHum, dhH, getLiveFloat(keyHum));
      jsonLive.jsonWrite(keyHum, dhH);
      // flag = true;
      float tempC = sensor_arr[num].get_Temperature();
      tempC = tempC * 10;
      tempC = round(tempC);
      tempC = tempC / 10;
      SoketData (keyTemp, tempC, getLiveFloat(keyTemp));
      jsonLive.jsonWrite(keyTemp, tempC);
    }
    num++;
  }
  if (num != 0) flag = true;
  num = 0;
}
