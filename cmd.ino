void initCMD() { //создание команд
  // PINOUT 22 0  (пин и состояние)
  sCmd.addCommand("PINOUT", initPinOut);
  sCmd.addCommand("print", printTEST);
  sCmd.addCommand("TACH", initTach);
  sCmd.addCommand("PWM", initPWM);
  sCmd.addCommand("DS", initOneWire);
  sCmd.addCommand("//", alarmCommOff);
  sCmd.addCommand("#", alarmCommOff);
  sCmd.setDefaultHandler(unrecognized);
  sCmd.addCommand("I2C", initI2C);
  sCmd.addCommand("DHT", initDht);
  sCmd.addCommand("mADD", modReg);
  sCmd.addCommand("mDEL", modUnreg);
  sCmd.addCommand("param", Param);
  sCmd.addCommand("UART", uart);
  sCmd.addCommand("map", comMap);
  sCmd.addCommand("calctk", heating);
  sCmd.addCommand("TK", setHeating);
  sCmd.addCommand("puls", startPuls);
  sCmd.addCommand("CALC", calcHeating);
  sCmd.addCommand("NTP", initNTP);
  sCmd.addCommand("TONE", initTone);
   sCmd.addCommand("wifi", wifiSave);
}

void wifiSave(){
  //wifi ssid password
  setConfig("ssid",readArgsString());
  setConfig("password",readArgsString());
  saveConfig();
  }

void uart() {
  int speedUart = readArgsInt();
  if (speedUart == 0) return;
  Serial.end();
  Serial.begin(speedUart);
}

void comMap() {
  String key = readArgsString();
  // speed = map(hum, humMin, humMax, 0, 255);
  int daTa = readArgsInt(); // Serial.print("daTa "); Serial.println(daTa);
  int mIn = readArgsInt(); // Serial.print("mIn "); Serial.println(mIn);
  int mAx = readArgsInt(); // Serial.print("mAx "); Serial.println(mAx);
  int tmp = map(daTa, mIn, mAx, 0, 1023); // Serial.print("tmp "); Serial.println(tmp);Serial.println(" ");
  setLive(key , tmp);
}

void setHeating() {
  String com = "calctk"; // вызывает heating()
  for (int i = 1; i < 10; i++ ) {
    com += " " + readArgsString();
  }
  com.trim(); // отбрасывает пробелы в конце и начале строки
  com += "\r\n";
  patern += com;
}

void calcHeating() {
  ts.add(tHeating, 45000, [&](void*) {
    // Serial.println(patern);
    doComandsString(patern);
  }, nullptr, true);
}

void heating() {
  String nameKontur = readArgsString();
  float tyliza = getLiveFloat(readArgsString());
  float tkomnata  = getLiveFloat(readArgsString());
  float kofizent = getLiveFloat(readArgsString());
  String nameTempKontur = readArgsString();
  String deltaS = readArgsString();
  float tKontyr = getLiveFloat(nameTempKontur);
  float delta = deltaS.toFloat(); // гестерезис
  float tmp = (tkomnata - tyliza) * kofizent + tkomnata;
  int16_t tmpTime = round(tmp - tKontyr); //время работы нагрева или охлаждения
  if (tKontyr > tmp + delta || tKontyr < tmp - delta) {
    setLive(nameKontur , tmpTime);
    flag = true;
  }
}
void printTEST() {
  // PRINT ПРИВЕТ МИР  --передать слова
  for (int i = 0 ; i < 10 ; i++) {
    Serial.print(readArgsString()); Serial.print(" ");
  }
  Serial.println();
}
// Читает аргументы из команд каждый слежующий вызов читает следующий аргумент возвращает Int
int readArgsInt() {
  char *arg;
  arg = sCmd.next();
  if (arg != NULL) {
    return atoi(arg);
  }
  else {
    return 0;
  }
}

// Читает аргументы из команд каждый следующий вызов читает следующий аргумент возвращает String
String readArgsString() {
  String arg;
  arg = sCmd.next();
  if (arg == "") arg = "";
  return arg;
}
// Читает аргументы из команд каждый следующий вызов читает следующий аргумент возвращает int
String readArg(String argS) {
  if (server.hasArg(argS)) {
    return server.arg(argS);
  } else return "";
}

void alarmCommOff() {
}

void unrecognized(const char *command) {
}
