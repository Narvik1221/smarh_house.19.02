eString readFile(String fileName) {
  File ftmp = FILESYSTEM.open("/" + fileName, "r");
  if (!ftmp) {
    return "failed";
  }
  eString tmp = ftmp.readString();
  ftmp.close(); // одновременное открытие 5 файлов допустимо (в целях экономии памяти)
  return tmp;
}

eString saveFile(String fileName, eString str) {
  File ftmp = FILESYSTEM.open("/" + fileName, "w");
  if (!ftmp) {
    return "failed";
  }
  ftmp.print(str);
  ftmp.close();
  return "ok";
}

//сохранит через время установки
void saveSetings() {
  ts.remove(tSave);
  ts.add(tSave, 5000, [&](void*) { // сохранить setings через 5 секунд повторный вызов сбрасывает время на 5 секунд.
    saveFile("config.setings.json", jsonSetings);
    ts.remove(tSave);
  }, nullptr, false);  //nullptr спец команда библиотеки
}

//сохранить конфигурацию
void saveConfig() {
    saveFile("config.save.json", jsonConfigs);
}

// читает из строки команду за командой и выполняет
void doComandsString(eString str) {
  if (str == "")return;
  str.replace("\r", "");
  do {
    String tmp = str.getOneToMarker("\n");
    getParams(tmp);
    sCmd.readStr(tmp);
  } while (str != "");
}

// читает из файла команду за командой и выполняет
String goComands(String fileName) { // тип стринг и имя файла
  File ftmp = FILESYSTEM.open("/" + fileName, "r");
  if (!ftmp) {
    return "failed";
  }
  String tmp;
  while (ftmp.size() != ftmp.position()) { // размер файла != текущей позиции чтения (метод и функция закончи скобками)
    tmp = ftmp.readStringUntil('\n');  //чтение из файла до /n (readStringUntil()берет байты по очереди до символа )
    tmp.replace("\r", "");
    getParams(tmp);
    // Serial.println(tmp);
    //uint64_t er = millis();
    sCmd.readStr(tmp); //sCmd.readStr("PINOUT 22 0 0 0") вставляет новую строку по очереди
    //uint64_t eer = millis()- er;
   //Serial.println(eer);
    yield();
  }
  ftmp.close();
  return "ok";
}
void getParams(String & str) {
  //then this shimout {{backlightVol}} 0
  if (str.indexOf("{{") == -1) return; // ищет ковычки если их нет заканчивает
  eString tmp = str;
  // получаем значение параметра
  do {
    tmp.getOneToMarker("{{"); // выкидываем все до {{ (останется) backlightVol}} 0
    String param = tmp.getOneToMarker("}}"); // получили имя параметра - получаем все до }} получили backlightVol
    String paramVol = jsonLive.jsonRead(param);
    // заменяем ключ его значением в переменной str
    str.replace("{{" + param + "}}", paramVol);
    yield();  //если цикл зависает на долго возвращает обращение к wi fi модулю
  } while (tmp.indexOf("{{") != -1);
  //then this shimout 435 0

}
// -------------- Регистрация модуля
// {"module":["temp","hum"]}
void modulesReg(String modName) {
  jsonModules.jsonArrAdd("module", modName);
}
void modReg() {
  // mADD имямодуля
  String Name = readArgsString();
  // есле name не равно пустой строке регистрируем модуль
  if (Name != "")modulesReg(Name);
}

// -------------- Удаление модуля
void modulesUnreg(String modName) {
  // {"module":["temp","hum"]}
  jsonModules.replace("\"" + modName + "\"", ""); // замена первого на второе
  // {"module":[,"hum"]}
  jsonModules.replace("[,", "[");
  // {"module":[["hum"]}
  jsonModules.replace(",]", "]");
  jsonModules.replace(",,", ",");
}
void modUnreg() {
  // mADD имямодуля
  String Name = readArgsString();
  // есле name не равно пустой строке регистрируем модуль
  if (Name != "")modulesUnreg(Name);
}
//       com key  value
// param add fire 0
// param send fire 1
// param save fire 2
// param on fire
// param off fire
// param not fire
// param + fire 1
// param - fire 1
// param | fire |  // | модуль
void Param() {
  String com = readArgsString();
  String key = readArgsString();
  String value = readArgsString();  // новое значение
  int valueInt = value.toInt();

  if (key != "") {
    String oldValue =   jsonLive.jsonRead(key);  //читаем jsonLive 
    int oldValueInt = oldValue.toInt();
    if (com == "add" )  {
      jsonLive.jsonWrite(key, value);
    } else {
      if (com == "save" )  {
        jsonLive.jsonWrite(key, value);
        jsonSetings.jsonWrite(key, value);
        saveSetings();
        flag = true;
      } else if (com == "send" ) {
        jsonLive.jsonWrite(key, value);
        flag = true;
      } else if (com == "on" ) {
        jsonLive.jsonWrite(key, 1);
        flag = true;
      } else if (com == "off" ) {
        jsonLive.jsonWrite(key, 0);
        flag = true;
      } else if (com == "not" ) {
        jsonLive.jsonWrite(key, !oldValueInt);  // инвертируем число в строку
        flag = true;
      } else if (com == "+" ) {
        jsonLive.jsonWrite(key, oldValueInt + valueInt);
        flag = true;
      } else if (com == "-" ) {
        jsonLive.jsonWrite(key, oldValueInt - valueInt);
        flag = true;
      } else if (com == "|" ) {
        jsonLive.jsonWrite(key, abs(jsonLive.jsonReadToInt(key))); // модуль числа
        flag = true;
      }
    }
  }
}
String chipIdString() {
#if defined(ESP8266)
  return String( ESP.getChipId() ) + "-" + String( ESP.getFlashChipId() );
#else
  uint32_t chipId32 = 0;
  for (int i = 0; i < 17; i = i + 8) {
    chipId32 |= ((ESP.getEfuseMac() >> (40 - i)) & 0xff) << i;
  }
  return String(chipId32);
#endif
}

int HEXtoInt(String hex) {
  if (hex.startsWith("0x")) {
    return strtol(hex.c_str(), NULL, 0);
  } else
    return strtol(("0x" + hex).c_str(), NULL, 0);
}

int stringToMs(String times) {
  // 1s 30s 40m 2h 235h 1000
  int timei = times.toInt();
  String unit;
  uint8_t p = times.length();
  unit = times.substring(p - 1, p);
  if (unit == "s") {
    timei = timei * 1000;
  } else if (unit == "m") {
    timei *= 60000;
  } else if (unit == "h") {
    timei *= 3600000;
  }
  return timei;
}
//пульс
//puls on name 100
//puls on name 1s
//puls on name 1m
//puls on name 1h
//puls on name 300 500 100i
//puls on name 100 200
//puls on name 100 200 4000
//puls off name
void startPuls() {
  String com = readArgsString();
  String namePuls = readArgsString();
  String onTime = readArgsString();
  String offTime = readArgsString();
  int onTimei = stringToMs(onTime);
  int offTimei = stringToMs(offTime);
  if (com == "on") {
    for (uint8_t i = 0; i < NUM_PULS; i++) {
      if (pulsN[i] && getOptions("puls" + String(i)) == namePuls) {
       // Serial.println("repeed");
        return; // если задача существует то сразу выйти
      }
    } // если не существует создадим задачу
    for (uint8_t i = 0; i < NUM_PULS; i++) {
      if (!pulsN[i]) { //ищу свободный объект puls
        pulsN[i] = true;
        setOptions(namePuls + "N", i);
        setOptions("puls" + String(i), namePuls);
        setOptions("onTpuls" + String(i), onTimei);
        setOptions("offTpuls" + String(i), offTimei);
        imPuls(i);
        return;
      }
    }
  } else if (com == "off") {
    for (uint8_t i = 0; i < NUM_PULS; i++) {
      if (pulsN[i] && getOptions("puls" + String(i)) == namePuls) {
       // Serial.println("del ok");
        // выключение таймера
        com = "pinout off " + namePuls;
        sCmd.readStr(com); // исполнит команду
        delPuls(getOptionsInt(namePuls + "N"));
      }
    }
  }
}
void imPuls(uint8_t tasc) {
  String sTasc = String(tasc);
  String com;
  String namePuls = getOptions("puls" + sTasc);
  if (!getLiveInt(namePuls)) { // если состояние 0
    com = "pinout on " + namePuls; //Приготовим команду включить
    sCmd.readStr(com);
   // Serial.print(" импульс "); Serial.println(com); Serial.println(" ");
    puls[tasc].attach_ms(getOptionsInt("onTpuls" + sTasc), imPuls, tasc); // Вызовим эту же функцию через время хранящеесе в options onTpuls + задача
  } else { // если состояние 1
    com = "pinout off " + namePuls; // приготовим команду на выключение
    sCmd.readStr(com);
   // Serial.print(" импульс "); Serial.println(com); Serial.println(" ");
    if (getOptionsInt("offTpuls" + sTasc) == 0) { // если время хранящееся в options "offTpuls" + sTasc равно 0
      delPuls(tasc); // удалим задачу и все переменные в options
     // Serial.println("время хранения = 0 ");
    } else {puls[tasc].attach_ms(getOptionsInt("offTpuls" + sTasc), imPuls, tasc); // Вызовим эту же функцию через время хранящеесе в options offTpuls + задача
 // Serial.println("вызов функции через время хранения в options ");
  }
  }
  //Serial.print("импульс "); Serial.println(com); Serial.println(" ");
}

void delPuls(uint8_t tasc) {
  String sTasc = String(tasc);
  puls[tasc].detach();
  jsonOptions.jsonDel(getOptions("puls" + sTasc) + "N");
  jsonOptions.jsonDel("puls" + sTasc);
  jsonOptions.jsonDel("onTpuls" + sTasc);
  jsonOptions.jsonDel("offTpuls" + sTasc);
  pulsN[tasc] = false;
}
