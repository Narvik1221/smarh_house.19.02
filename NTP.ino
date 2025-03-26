void initNTP() {
  String ntpTemp = readArgsString();
  if (ntpTemp == "") {
    ntpTemp = "ntp1.vniiftri.ru";
    setOptions("ntp1", ntpTemp);
  }
  ntpTemp = readArgsString();
  if (ntpTemp == "") {
    ntpTemp = "ntp2.vniiftri.ru";
    setOptions("ntp2", ntpTemp);
    timeSynch();
    test1Sec();
  }
}
void timeSynch() {
  uint8_t tZone = getConfigInt("tZone"); //временная зона, передача зоны в тхт конфиг
  String ntp1 = getOptions("ntp1");
  String ntp2 = getOptions("ntp2");
  configTime(tZone * 3600, 0, ntp1.c_str(), ntp2.c_str());
  uint8_t i = 0;
  while ((time(nullptr) < NTP_MIN_VALID_EPOCH) && i < 10) {
    i++;
    delay(1000);
  }
}

String getTime() {
  time_t now = time(nullptr); // получаем время с помощью библиотеки time.h
  String Time; // Строка для результатов времени
  Time += ctime(&now); // Преобразуем время в строку формата Thu Jan 19 00:55:35 2017
  uint8_t one = Time.indexOf(":") - 2;
  uint8_t two = Time.lastIndexOf(":") + 3;
  return Time.substring(one, two);
}

void test1Sec() {
  ts.add(tNTP, 10000, [&](void*) {
    String Time = getTime();
    SoketData ("timeBake", Time, getLive("timeBake"));
    setLive("timeBake", Time);
    uint8_t two = Time.lastIndexOf(":") + 1;
    if (Time.substring(two) == "00") flag = true;
  }, nullptr, true);
}
//"time": "17:20:33",  // "weekday": "Tue", пример посылки
