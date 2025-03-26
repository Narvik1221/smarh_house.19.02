#include <HTTPUpdateServer.h> // Обнавление с web страницы /update 
HTTPUpdateServer httpUpdater;
#include <time.h>  
#define NTP_MIN_VALID_EPOCH 1533081600
static const char cmdS[] PROGMEM = "cmd";
static const char coreS[] PROGMEM = "core";
static const char spaceDef[] PROGMEM = "home";
static const char fileConfigS[] PROGMEM = "config.save.json";
static const char fileSetingS[] PROGMEM = "setings.save.json";
static const char configsS[] PROGMEM = "configs";
static const char ssdpS[] PROGMEM = "SSDP";
static const char templevelS[] PROGMEM = "templevel";
static const char temperatureS[] PROGMEM = "temperature";
static const char ssidS[] PROGMEM = "ssid";
static const char ssidPassS[] PROGMEM = "ssidPass";
static const char ssidAPS[] PROGMEM = "ssidAP";
static const char ssidApPassS[] PROGMEM = "ssidApPass";
static const char setIndexDef[] PROGMEM = "index.htm";
static const char setIndexS[] PROGMEM = "setIndex";
static const char vccS[] PROGMEM = "vcc";
const String emptyS   =  "";
static const char checkboxIPS[] PROGMEM = "checkboxIP";
static const char ipS[] PROGMEM = "ip";
static const char subnetS[] PROGMEM = "subnet";
static const char getwayS[] PROGMEM = "getway";
static const char macS[] PROGMEM = "mac";
static const char dbmS[] PROGMEM = "dbm";
static const char spaceS[] PROGMEM = "space";
static const char modelURL[] PROGMEM = "http://evoflame.co.uk";
static const char manufacturer[] PROGMEM = "+44 (0) 1789 263868 sales@evonicfires.co.uk";
static const char manufacturerURL[] PROGMEM = "https://evonicfires.co.uk";
static const char ScenaryS[] PROGMEM = "scenary/";
static const char webSocketS[] PROGMEM = "webSocket";
static const char heapS[] PROGMEM = "heap";
static const char ssdpSerch[] PROGMEM =  "M-SEARCH * HTTP/1.1\r\nHost:239.255.255.250:1900\r\nST:upnp:rootdevice\r\nMan:\"ssdp:discover\"\r\nMX:5\r\n\r\n";

const String onS   = "on";
const String offS   = "off";
const String notS   = "not";

static const char PinS[] PROGMEM = "Pin";//Для хранения ножек реле
static const char NotS[] PROGMEM = "Not";// Для хранения признака инверсии
static const char pinOutS[] PROGMEM = "pinout";// Состояние pinout

// -------- buzzer
static const char buzzerPinS[] PROGMEM = "buzzerPin";// Состояние реле
static const char toneS[] PROGMEM = "tone";// Состояние реле

// Уровни
const String highS   = "high";
const String lowS   = "low";
const String alarmS   = "alarm";
const String AlarmS   = "Alarm";
//пульс
#include <Ticker.h> 
#define NUM_PULS 8     
boolean pulsN[NUM_PULS];
Ticker puls[NUM_PULS];
