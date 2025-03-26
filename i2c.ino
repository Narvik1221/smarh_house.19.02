/*
#define MCP23017_ADDRESS 0x20 // Измените адрес в зависимости от подключения (0x20 - 0x27)

#define IODIRA 0x00 // Регистры для направления вход/выход
#define IODIRB 0x01
#define GPIOA 0x12 // Регистры для чтения/записи данных
#define GPIOB 0x13

void setupMCP() {
  Wire.begin();
  // Настройка всех пинов порта A как выходы
  writeRegister(IODIRA, 0x00); // Все пины как выходы
  writeRegister(IODIRB, 0x00); // Все пины как выходы
}



// Функция для установки состояния отдельного пина
void setPin(uint8_t pin, bool state) {
  uint8_t currentState = readRegister(GPIOA);
  if (state) {
    currentState |= (1 << pin); // Установить пин в HIGH
  } else {
    currentState &= ~(1 << pin); // Установить пин в LOW
  }
  writeRegister(GPIOA, currentState);
}

// Функция для настройки отдельного пина как входа или выхода
void setPinMode(uint8_t pin, bool mode) {
  uint8_t currentIODir = readRegister(IODIRA); // Чтение текущего состояния IODIRA
  if (mode) {
    currentIODir |= (1 << pin); // Установить пин как INPUT
  } else {
    currentIODir &= ~(1 << pin); // Установить пин как OUTPUT
  }
  writeRegister(IODIRA, currentIODir); // Запись обновленного состояния в IODIRA
}

void writeRegister(uint8_t reg, uint8_t data) {
  Wire.beginTransmission(MCP23017_ADDRESS);
  Wire.write(reg);
  Wire.write(data);
  Wire.endTransmission();
}

uint8_t readRegister(uint8_t reg) {
  Wire.beginTransmission(MCP23017_ADDRESS);
  Wire.write(reg);
  Wire.endTransmission();

  Wire.requestFrom(MCP23017_ADDRESS, 1);
  return Wire.read();
}
*/
