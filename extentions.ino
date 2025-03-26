// ------------------- Инициализация I2C
void initI2C() {
  uint8_t pin1 = readArgsInt(); // первый аргумент pin
  uint8_t pin2 = readArgsInt(); // первый аргумент pin
  String clockFrequency = readArgsString(); // первый аргумент pin
  if (clockFrequency == "") clockFrequency = "100000";
  Wire.setClock(clockFrequency.toInt());
  Wire.begin(pin1, pin2);
  modulesReg("i2c");
  scanI2C();
  sCmd.addCommand("SensorsI2S", initSenors);
  mcp.begin_I2C(0x20, &Wire);
  mcpKbr.begin_I2C(0x21, &Wire);
}


void scanI2C() {
  byte error, address;
  int nDevices;
  nDevices = 0;
  for (address = 1; address < 127; address++ )
  {
    String addr;
    Wire.beginTransmission(address);
    error = Wire.endTransmission();
    if (error == 0)
    {
      addr += "0x";
      if (address < 16) addr += "0";
      addr += String(address, HEX);
      jsonOptions.jsonArrAdd("i2c", addr);
      nDevices++;
    }
    else if (error == 4)
    {
      addr += "0x";
      if (address < 16) addr += "0";
      addr += String(address, HEX);
      jsonOptions.jsonArrAdd("i2cError", addr);
    }
  }
  jsonOptions.jsonWrite("ni2c", nDevices);
}

void initSenors() {
  // SensorsI2S имя тип адрес
  String nameSens = readArgsString();
  if (nameSens == "") return;
  String typeSens = readArgsString();
  if (typeSens == "") return;
  String addressS = readArgsString();
  uint8_t address = 0x44;
  if (addressS != "") {
    if (addressS.startsWith("0x")) {
      address = HEXtoInt(addressS);
    } else
      address =  addressS.toInt();
  }
  if (typeSens == "SHT31") {
    jsonOptions.jsonWrite(nameSens + "Adr", address);
    jsonOptions.jsonWrite(nameSens + "CMD", "0x2C06");
    jsonOptions.jsonWrite(nameSens + "0", "temperatureH");
    jsonOptions.jsonWrite(nameSens + "1", "temperatureL");
    jsonOptions.jsonWrite(nameSens + "2", "HumidityH");
    jsonOptions.jsonWrite(nameSens + "3", "HumidityL");
  }
}
