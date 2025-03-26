//eString jsonLive = "{}";      // Основные данные(будут меняться)
//eString jsonOptions = "{}";   // Опции
//eString jsonConfigs = "{}";   // данные коефигурации

// jsonLive
void setLive(String key, String vol) {
  jsonLive.jsonWrite(key, vol);
}
void setLive(String key, int vol) {
  jsonLive.jsonWrite(key, vol);
}
void setLive(String key, float vol) {
  jsonLive.jsonWrite(key, vol);
}

void setLive(PGM_P key, String vol) {
  setLive(FPSTR(key), vol);
}

void setLive(PGM_P key, int vol) {
  setLive(FPSTR(key), vol);
}
void setLive(PGM_P key, float vol) {
  setLive(FPSTR(key), vol);
}

String getLive(String key) {
  return jsonLive.jsonRead(key);
}
int getLiveInt(String key) {
  return jsonLive.jsonReadToInt(key);
}
float getLiveFloat(String key) {
  return jsonLive.jsonReadToFloat(key);
}

String getLive(PGM_P key) {
  return getLive(FPSTR(key));
}

int getLiveInt(PGM_P key) {
  return getLiveInt(FPSTR(key));
}
float getLiveFloat(PGM_P key) {
  return getLiveFloat(FPSTR(key));
}


//Options
void setOptions(String key, String vol) {
  jsonOptions.jsonWrite(key, vol);
}
void setOptions(String key, int vol) {
  jsonOptions.jsonWrite(key, vol);
}
void setOptions(String key, float vol) {
  jsonOptions.jsonWrite(key, vol);
}

void setOptions(PGM_P key, String vol) {
  setOptions(FPSTR(key), vol);
}

void setOptions(PGM_P key, int vol) {
  setOptions(FPSTR(key), vol);
}
void setOptions(PGM_P key, float vol) {
  setOptions(FPSTR(key), vol);
}

String getOptions(String key) {
  return jsonOptions.jsonRead(key);
}
int getOptionsInt(String key) {
  return jsonOptions.jsonReadToInt(key);
}
float getOptionsFloat(String key) {
  return jsonOptions.jsonReadToFloat(key);
}

String getOptions(PGM_P key) {
  return getOptions(FPSTR(key));
}

int getOptionsInt(PGM_P key) {
  return getOptionsInt(FPSTR(key));
}
float getOptionsFloat(PGM_P key) {
  return getOptionsFloat(FPSTR(key));
}

//Config
void setConfig(String key, String vol) {
  jsonConfigs.jsonWrite(key, vol);
}
void setConfig(String key, int vol) {
  jsonConfigs.jsonWrite(key, vol);
}
void setConfig(String key, float vol) {
  jsonConfigs.jsonWrite(key, vol);
}

String getConfig(String key) {
  return jsonConfigs.jsonRead(key);
}
int getConfigInt(String key) { // отправляю название возвращает число
  return jsonConfigs.jsonReadToInt(key);
}
float getConfigFloat(String key) {
  return jsonConfigs.jsonReadToFloat(key);
}

String getConfig(PGM_P key) {
  return getConfig(FPSTR(key));
}

int getConfigInt(PGM_P key) {
  return getConfigInt(FPSTR(key));
}
float getConfigFloat(PGM_P key) {
  return getConfigFloat(FPSTR(key));
}


//для сохранение настроик
void setSeting(String key, String vol) {
  jsonSetings.jsonWrite(key, vol);
  saveSetings(); //сохраняет в файл config.setings.json через 15 сек
}

void setSeting(String key, int vol) {
  jsonSetings.jsonWrite(key, vol);
  saveSetings();
}
void setSeting(String key, float vol) {
  jsonSetings.jsonWrite(key, vol);
  saveSetings();
}
