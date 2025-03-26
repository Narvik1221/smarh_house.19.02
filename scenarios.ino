void initScenarios() {
  sCmd.addCommand("if", ifComand);
  sCmd.addCommand("or", orComand);
  sCmd.addCommand("and", andComand);
  sCmd.addCommand("then", thenComand);
  sCmd.addCommand("end", endComand);
}

void endComand() {}

void ifComand() {
  thenOk = false; //0
  orComand();
}

void orComand() {
  // or имя_параметра операция значение_параметра
  // or tach0 = 1
  String Name = readArgsString();
  String Condition = readArgsString();
  String Volume = readArgsString();
  String test = jsonLive.jsonRead(Name);
  //String test = Name;
  testComand(Volume, Condition, test);

}

void andComand() {
  // and имя_параметра операция значение_параметра
  // and tach0 = 1
  if (thenOk) {
    String Name = readArgsString();
    String Condition = readArgsString();
    String Volume = readArgsString();
    String test = jsonLive.jsonRead(Name);
    //String test = Name;
    thenOk = false; //0
    testComand(Volume, Condition, test);
  }
}

// 1 = 1 , 1 > 1, 1 < 1, 1 >= 1, 1 <= 1, 1 != 1
void testComand(String Volume, String Condition, String test) { // функция для проверки равенств
  if (Condition == "=") {
    if (test == Volume) thenOk = true; //1
  } else if (Condition == ">") {
    if (test.toFloat() > Volume.toFloat()) thenOk = true; //1  перевожу строку в число с плавующей точкой
  } else if (Condition == "<") {
    if (test.toFloat() < Volume.toFloat()) thenOk = true; //1
  } else if (Condition == ">=") {
    if (test.toFloat() >= Volume.toFloat()) thenOk = true; //1
  }  else if (Condition == "<=") {
    if (test.toFloat() <= Volume.toFloat()) thenOk = true; //1
  }  else if (Condition == "!=") {
    if (test != Volume) thenOk = true; //1
  }


}

void thenComand() {
  // then имя_устройства команда_параметр_параметр_параметр
  // then this pinout not 0
  // then room tone 1200 100
  if (thenOk) {
    String ssdp = jsonConfigs.jsonRead("SSDP"); // возмет имя этого устройства
    String test = readArgsString(); // имя устройства на которое отправляем
    String com = readArgsString() + " "; // команда устройству (pinout, tone)
    com.concat(readArgsString() + " "); // concat - складывает строки быстро
    com += readArgsString() + " "; // тоже самое что и выше
    com.concat(readArgsString() + " ");
    com.concat(readArgsString() + " ");
    com.concat(readArgsString() + " ");
    com.concat(readArgsString() + " ");
    com.concat(readArgsString() + " ");
    // Serial.println(ssdp);
    // Serial.println(test);
    //  Serial.println(com);
    sCmd.readStr(com); // выполнить команду в com

  }
}

void hendlScenarios() {
  if (flag) {
    String configs = getConfig(configsS);
    uint64_t er = millis();
    goComands("scenary/" + configs + ".txt");
    uint64_t eer = millis() - er;
    Serial.println(eer);
    webSocket.broadcastTXT(jsonLive); //для отображения одновременно на разных открытых страницах(отправка данных в в вебсокет)
    flag = false;
    //Serial.println("флаг");
  }
}
