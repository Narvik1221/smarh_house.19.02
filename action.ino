void initPinOut() {  // инициализирует
  //PINOUT 22 0 0 0  (пин, № устройства, состояние на старте, инверсия )
  uint8_t pin = readArgsInt();
  String num = readArgsString();
  uint8_t  stat = readArgsInt();
  bool inv = readArgsInt();
  jsonLive.jsonWrite(num, stat);
  jsonOptions.jsonWrite(num+"Pin", pin);
  jsonOptions.jsonWrite(num+"Inv", inv);
  if (pin < 40) {
    pinMode(pin, OUTPUT);
    digitalWrite(pin, stat);
  } else {
    mcp.pinMode(pin - 40, OUTPUT);
    mcp.digitalWrite(pin - 40, stat);
  }
  sCmd.addCommand("pinout", setPin);
  modulesReg("pinout" + num);
}
void setPin() { //управляет
  //pinout on 0 (действие, № устройства)
  //pinout off 0 (действие, № устройства)
  //pinout not 0 (действие, № устройства) инверсия
  //pinout 1 0 (действие, № устройства)
  //pinout 0 0 (действие, № устройства)
  String com = readArgsString();
  String num = readArgsString();
  uint8_t  stat =  jsonLive.jsonReadToInt(num);
  uint8_t pin = jsonOptions.jsonReadToInt(num+"Pin");
  if (com == "on" || com == "1") stat = 1;
  if (com == "off" || com == "0") stat = 0;
  if (com == "not") stat = !stat;
  if (pin < 40) {
    digitalWrite(pin, stat);
  } else {
    mcp.digitalWrite(pin - 40, stat);
  }
  jsonLive.jsonWrite(num, stat);
  flag = true;

}

//Шим Модуль
void initPWM() {
  //PWM 22 0 1023 1  (пин, № устройства, состояние на старте, инверсия )
  uint8_t pin = readArgsInt();
  String num = readArgsString();
  uint16_t  stat = readArgsInt();
  bool inv = readArgsInt();
  jsonLive.jsonWrite(num, stat); // ключ + номер устройства 0-1023
  jsonOptions.jsonWrite(num+"Pin", pin); //устройсвисит на пине такомто
  jsonOptions.jsonWrite(num+"Inv", inv);
  analogWrite(pin, stat);
  sCmd.addCommand("pwm", setShim); // связывает команду shimout с функцией через строку
  modulesReg("pwm" + num);
}

//управляет
void setShim() {
  //pwm on 0 (действие, № устройства) on = 1023  // 255
  //pwm off 0 (действие, № устройства)off = 0
  //pwm 512 0 (значение, № устройства)
  String com = readArgsString();
  String num = readArgsString();
  uint16_t  stat = com.toInt(); // превращаем в число
  uint8_t pin = jsonOptions.jsonReadToInt(num+"Pin");
  if (com == "on") stat = 1023;
  if (com == "off") stat = 0;
  if (stat >= 0 && stat <= 1023) {
    analogWrite(pin, stat);

    jsonLive.jsonWrite(num, stat);
    flag = true;
  }
}
// Пищалка
void initTone() {
  // TONE 22       пин
  uint8_t pin = readArgsInt();
  jsonOptions.jsonWrite("toneoutpin", pin); //устройсвисит на пине такомто
  sCmd.addCommand("tone", setTone); // связывает команду tone с функцией через строку
  modulesReg("tone");
}

//управляет
void setTone() {
  //tone 2400 100  // частота  время
  uint16_t freq = readArgsInt();
  uint16_t durations = readArgsInt();
  uint8_t pin = jsonOptions.jsonReadToInt("toneoutpin");
  tone(pin, freq, durations);

}
