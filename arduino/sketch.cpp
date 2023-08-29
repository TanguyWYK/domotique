
#include <SPI.h>
#include <Ethernet.h>
#include <DHT.h>


#define nbOfSensor 6
#define ERROR_VALUE -9999

int DHTPIN[nbOfSensor] = {2,3,5,6,7,8}; // broches où sont branchés les capteurs
int DHTTYPE[nbOfSensor] = {DHT22,DHT22,DHT22,DHT22,DHT22,DHT22};
int temperatures[nbOfSensor] = {ERROR_VALUE,ERROR_VALUE,ERROR_VALUE,ERROR_VALUE,ERROR_VALUE,ERROR_VALUE};
int humidities[nbOfSensor] = {ERROR_VALUE,ERROR_VALUE,ERROR_VALUE,ERROR_VALUE,ERROR_VALUE,ERROR_VALUE};
DHT* myDHT[nbOfSensor];

EthernetClient client;
int    HTTP_PORT   = 80;
String HTTP_METHOD = "GET";
//char   HOST_NAME[] = "192.168.1.12"; // change to your PC's IP address
//String PATH_NAME   = "/sites/domotique/save";
char   HOST_NAME[] = "twest.fr";
String PATH_NAME   = "/domotique/save";
byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xAB, 0xED };

void setup(){
  Serial.begin(9600);
  for (int i=0; i<nbOfSensor; i++) {
      myDHT[i]= new DHT(DHTPIN[i], DHTTYPE[i]); //define a new DHT at pin i with type 11;
      myDHT[i]->begin();
  };
  delay(10000);


  // initialize the Ethernet shield using DHCP:
  if (Ethernet.begin(mac) == 0) {
    Serial.println("Failed to obtaining an IP address using DHCP");
    while(true);
  }
};


void loop(){
   float humidity;
   float temperature;

   for(int i=0;i<nbOfSensor;i++){
       humidity = myDHT[i]->readHumidity();//on lit l'hygrometrie
       temperature = myDHT[i]->readTemperature();//on lit la temperature en celsius (par defaut)
       //On verifie si la lecture a echoue, si oui on quitte la boucle pour recommencer.
       if (isnan(humidity) || isnan(temperature) || humidity>100 || humidity<0 || temperature<-40 || temperature>80){
         Serial.println("Failed to read from DHT sensor!");
         temperatures[i] = ERROR_VALUE;
         humidities[i] = ERROR_VALUE;
       } else {
         //Affichages :
        //  Serial.print(i);
        //  Serial.print(" Humidite: ");
        //  Serial.print(humidity);
        //  Serial.print(" %\t");
        //  Serial.print("Temperature: ");
        //  Serial.print(temperature);
        //  Serial.print(" *C ");
        //  Serial.println("");
         temperatures[i] = temperature * 10;
         humidities[i] = humidity * 10;
       }
       delay(3000);
    }
    String queryString = buildQuery(temperatures,humidities);
    Serial.println(queryString);
    sendRequest(queryString);
    delay(300000 - nbOfSensor * 3000);
  Serial.println("---");
}

static String buildQuery(int *temperatures, int *humidities) {
  String temperaturesString = "";
  String humiditiesString = "";
  String comma = ",";
  for(int i=0;i<nbOfSensor;i++){
    if(i == nbOfSensor-1){
      comma = "";
    }
    temperaturesString += String(temperatures[i]) + comma;
    humiditiesString += String(humidities[i]) + comma;
  }
  return "?t="+temperaturesString+"&h="+humiditiesString;
};

static void sendRequest(String queryString){
   if(client.connect(HOST_NAME, HTTP_PORT)) {
      // make a HTTP request:
      // send HTTP header
      client.println(HTTP_METHOD + " " + PATH_NAME + queryString + " HTTP/1.1");
      client.println("Host: " + String(HOST_NAME));
      client.println("Connection: close");
      client.println(); // end HTTP header
      client.stop();
    }else{
      Serial.println("error http request");
      delay(500);
    }
}