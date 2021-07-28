
#include <SPI.h>
#include <Ethernet.h>
#include <Phpoc.h>
#include <dht_nonblocking.h>
#define LED 8
#define DHT_SENSOR_TYPE DHT_TYPE_11

byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xAB, 0xED };
static const int DHT_SENSOR_PIN = 2;
int led_status = 0;
DHT_nonblocking dht_sensor(DHT_SENSOR_PIN, DHT_SENSOR_TYPE);

EthernetClient client;

int HTTP_PORT = 80;
String HTTP_METHOD = "GET";
char HOST_NAME[] = "192.168.0.13"; // change to your PC's IP address
String PATH_NAME = "/sites/domotique/save";

void setup(){
  Serial.begin(9600);
  pinMode(LED,OUTPUT);
  // initialize the Ethernet shield using DHCP:
  if (Ethernet.begin(mac) == 0) {
    Serial.println("Failed to obtaining an IP address using DHCP");
  }
}

static bool measure_environment(float *temperature, float *humidity) {
  static unsigned long measurement_timestamp = millis();

  /* Measure once every four seconds. */
  if(millis() - measurement_timestamp > 3000ul) {
    if(dht_sensor.measure(temperature, humidity) == true) {
      measurement_timestamp = millis();
      return(true);
    }
  }
  return(false);
}


void loop(){
  float temperature;
  float humidity;
  if(measure_environment(&temperature, &humidity) == true) {
      String queryString = "?id_captor=1&temperature="+String(temperature*100)+"&humidity="+String(humidity*100);
      Serial.println(queryString);
      if(client.connect(HOST_NAME, HTTP_PORT)) {
        client.println(HTTP_METHOD + " " + PATH_NAME + queryString + " HTTP/1.1");
        client.println("Host: " + String(HOST_NAME));
        client.println("Connection: close");
        client.println();
        client.stop();
      } else {
        Serial.println("error http request");
      }
    delay(300000);
  }
}