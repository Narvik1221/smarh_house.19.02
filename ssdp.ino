void initssdp(String nameSsdp ) {
  unsigned int localPort = 1901;
  udp.begin(localPort);
  ssdpList.jsonWrite(nameSsdp, jsonLive.jsonRead("ip"));
  jsonModules.jsonWrite("SSDP", nameSsdp);
  server.on("/description.xml", HTTP_GET, []() {
    SSDP.schema(server.client());
  });
  //set device type
  //"urn:schemas-upnp-org:device:Basic:1" if not set
  SSDP.setDeviceType("rootdevice"); //to appear as root device, other examples: MediaRenderer, MediaServer ..
  //set schema xml url, nees to match http handler
  //"ssdp/schema.xml" if not set
  SSDP.setSchemaURL("description.xml");
  //set schema xml url, nees to match http handler
  //"ssdp/schema.xml" if not set
  SSDP.setSchemaURL("description.xml");
  //set device name
  //Null string if not set
  SSDP.setName(nameSsdp);
  //set Serial Number
  //Null string if not set
  SSDP.setSerialNumber(chipIdString());
  //set device url
  //Null string if not set
  SSDP.setURL("/");
  //set model name
  //Null string if not set
  SSDP.setModelName("test");
  //set model number
  //Null string if not set
  SSDP.setModelNumber(chipIdString() + "/" + nameSsdp);
  //set model url
  //Null string if not set
  SSDP.setModelURL("http://www.meethue.com");
  //set model manufacturer name
  //Null string if not set
  SSDP.setManufacturer("VIZIT");
  //set model manufacturer url
  //Null string if not set
  SSDP.setManufacturerURL("http://www.philips.com");
  //Set icons list, NB: optional, this is ignored under windows
  SSDP.setIcons(  "<icon>"
                  "<mimetype>image/png</mimetype>"
                  "<height>48</height>"
                  "<width>48</width>"
                  "<depth>24</depth>"
                  "<url>icon48.png</url>"
                  "</icon>");
  SSDP.begin();
    ts.add(tSSDP, 10000, [&](void*) { // вызов поиска других модулей
 requestSSDP();
  }, nullptr, false);  //nullptr спец команда библиотеки
}

void hendlSSDP() {
  if (WiFi.status() == WL_CONNECTED) {
    char buferUDP[1501];
    int buferSIZE = udp.parsePacket();
    if (buferSIZE) {
      int len = udp.read(buferUDP, 1500);
      if (len > 0) buferUDP[len] = 0;
      eString inputUDP = String(buferUDP);
      readSSDP(inputUDP);
    }
  }else{Serial.println("Error reading UDP packet");}
}

void requestSSDP() {
  if (WiFi.status() == WL_CONNECTED) {
    //Serial.println(FPSTR(ssdpSerch));
    udpSend("239.255.255.250", 1900, ssdpSerch );
  }
}

void udpSend(eString ip, uint32_t portUdp, PGM_P masage) {
  udpSend(ip, portUdp, FPSTR(masage));
}

void udpSend(eString ip, uint32_t portUdp, String masage) {
  IPAddress ssdpAdress(ip.getOneToMarker(".").toInt(), ip.getOneToMarker(".").toInt(), ip.getOneToMarker(".").toInt(), ip.toInt());
  //Serial.println(ssdpAdress);
  udp.beginPacket(ssdpAdress, portUdp);
#if defined(ESP8266) // директива компеляции
  udp.write(masage.c_str()); //для есп8266
#else
  udp.print(masage); //для есп32
#endif
  udp.endPacket();
}

void readSSDP(eString & str) {
  Serial.println(str);
  eString chipIDremote = str.deleteBeforeDelimiter("SERVER: ");
  if (chipIDremote.indexOf("Arduino") == 0) { //вернет 0 возвращает позицию начало строки или -1
    eString nameDevice = chipIDremote.selectToMarker("\n");
    nameDevice = nameDevice.selectToMarkerLast("/"); //взяли имя с конца до черты
    eString IPremote = str.deleteBeforeDelimiter("LOCATION: ");
    IPremote = IPremote.deleteBeforeDelimiter("//");
    IPremote = IPremote.selectToMarker("/");
     IPremote = IPremote.selectToMarker(":");
    nameDevice.replace("\r", ""); // уберает все \r из строки (\r - перенос строки)
    ssdpList.jsonWrite(nameDevice,IPremote);
  }
}
