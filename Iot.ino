#include "sets.h"

//файловая система https://github.com/renat2985/easy_Iot_file_system
#include <WebSocketsServer.h>  // https://github.com/Links2004/arduinoWebSockets
WebSocketsServer webSocket = WebSocketsServer(81); //объект
#include <AM2302-Sensor.h>  // https://github.com/hasenradball/AM2302-Sensor
std::array<AM2302::AM2302_Sensor, 3> sensor_arr{
  AM2302::AM2302_Sensor{0},
  AM2302::AM2302_Sensor{0},
  AM2302::AM2302_Sensor{0}
};
#include <OneWire.h>
OneWire *oneWire[6]; // ссылается на объект
#include <Wire.h>
#include <DallasTemperature.h>
DallasTemperature sensTemp[6];
#include <Adafruit_MCP23X17.h>
Adafruit_MCP23X17 mcp;
Adafruit_MCP23X17 mcpKbr;
#include <WiFi.h>
#include <WiFiClient.h>
#include <WebServer.h>
#include <eString.h>
#include <ESPmDNS.h>
#include <TickerScheduler.h>         //https://github.com/Toshik/TickerScheduler
enum {tDs, tDht, tSave, tSSDP, tHeating, tNTP, tsWIfi}; // имена для таскеров
TickerScheduler ts(7);  // 7 кол-во счетчиков
// #include <Bounce2.h>        //https://github.com/thomasfredericks/Bounce2
#include <BounceExtended.h>  // Подключаем расширенный класс
#define NUM_BUTTONS 18     // нам нужно 16 кнопок
boolean but[NUM_BUTTONS];
BounceExtended *buttons[NUM_BUTTONS]; // создаем массив объектов
#include <ESP32SSDP.h>        //https://github.com/luc-github/ESP32SSDP
#include <WiFiUdp.h> //для обмена пакетами udp
WiFiUDP udp;
#include <StringCommand.h>  //https://github.com/tretyakovsa/ESP8266-StringCommand
StringCommand sCmd;

#define FILESYSTEM SPIFFS
#define FORMAT_FILESYSTEM false
#define DBG_OUTPUT_PORT Serial

#if FILESYSTEM == FFat
#include <FFat.h>
#endif
#if FILESYSTEM == SPIFFS
#include <SPIFFS.h>
#endif
#if FILESYSTEM == LittleFS
#include <LittleFS.h>
#endif
#if FILESYSTEM == SD
#include "SD.h"
#include "SPI.h"
#endif
bool flag = false;
bool thenOk = false;

const char* host = "esp32fs";
WebServer server(80);
File fsUploadFile;
String com_str;
unsigned long lastDht; //для времени
unsigned long lastUdp; //для времени
eString jsonLive = "{}";      // Основные данные(будут меняться)
eString jsonOptions = "{}";   // Опции
eString jsonConfigs = "{}";   // данные коефигурации
eString jsonSetings = "{}";   // данные настроек
eString jsonModules = "{\"module\":[]}";   // модули
eString ssdpList = "{}"; //для адресов есп
uint32_t mem = 4000;
eString patern;
void setup(void) {
  Serial.begin(115200);
 analogWriteResolution(10); // битность
 analogWriteFrequency(2000); // для частоты шим
  FILESYSTEM.begin();
  
  jsonConfigs = readFile("config.save.json");
  jsonSetings = readFile("config.setings.json");
  jsonLive = jsonSetings;
  
 String ssid = jsonConfigs.jsonRead("ssid");
 String password = jsonConfigs.jsonRead("password");
  byte tries = 10; // колличество попыток подключения
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);

  while (--tries && WiFi.status() != WL_CONNECTED) {
    delay(500);
    DBG_OUTPUT_PORT.print(".");
  }
  if (WiFi.status() != WL_CONNECTED) {
    WiFi.mode(WIFI_AP);
    WiFi.softAP("Dom","12345678"); // имя, пароль (не может быть меньше восьми символов)
    jsonLive.jsonWrite("ip", WiFi.softAPIP().toString()); //ip для чтения данных WebSocketsServer
    ts.add(tsWIfi, 300000, [&](void*) {
    uint8_t n = WiFi.scanNetworks();
     if (n == 0) {
    } else {
         for (int i = 0; i < n; ++i) {
         if(WiFi.SSID(i) == getConfig("ssid")) {
          ESP.restart();
         }
         }
    }  
  }, nullptr, false);
  }else{
    jsonLive.jsonWrite("ip", WiFi.localIP().toString()); //ip для чтения данных WebSocketsServer
    }
  DBG_OUTPUT_PORT.println("");
  DBG_OUTPUT_PORT.print("Connected! IP address: ");
  DBG_OUTPUT_PORT.println(getLive("ip"));

  MDNS.begin(host);
  DBG_OUTPUT_PORT.print("Open http://");
  DBG_OUTPUT_PORT.print(host);
  DBG_OUTPUT_PORT.println(".local/edit to see the file browser");


  webInit();
  initssdp(jsonConfigs.jsonRead("SSDP"));
  server.begin();
  DBG_OUTPUT_PORT.println("HTTP server started");
  initCMD();
  initScenarios();
  initWebSocketsServer();
  String configs = getConfig(configsS);
  goComands("configs/"+configs+".txt");
}

void loop(void) {
  ts.update();
  server.handleClient();
  while (Serial.available() > 0) {
    uint8_t sum = Serial.read();
    com_str += char(sum);
    if (com_str.endsWith("\r\n")) {
      com_str.replace("\r\n", "");
      sCmd.readStr(com_str); //передача (проверка и выполнение)
      com_str = "";
    }
  }
  hendlSSDP();
  handleButtons();  //кнопки
  hendlScenarios();  //сценарии
  webSocket.loop();
}
