#include <stdio.h>
#include <stdint.h>
#include <stddef.h>
#include <string.h>
#include "esp_wifi.h"
#include "esp_system.h"
#include "nvs_flash.h"
#include "esp_event.h"
#include "esp_netif.h"
#include "protocol_examples_common.h"

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/semphr.h"
#include "freertos/queue.h"
#include "driver/gpio.h"
#include "esp_log.h"
#include "../components/websocket_driver/websocket_driver.h"
#include "esp_event.h"

#define ID_ESP32 "esp32_test1"
#define MAX_DATA_STRING_LENGTH 80


static const char *TAG = "WEBSOCKET";

esp_websocket_client_handle_t client;


void websocket_send(const char *data) {
    if (esp_websocket_client_is_connected(client)) {
        
        // Asegúrate de tener suficiente espacio para formatear el mensaje
        char message[50];  // Cambia el tamaño según tus necesidades

        // Formatea el mensaje en el búfer 'message'
        int len = sprintf(message, "%s", data);

        // ESP_LOGI(TAG, "Sending %s", message);
        esp_websocket_client_send(client, message, len, portMAX_DELAY);
    }

    vTaskDelay(1000 / portTICK_PERIOD_MS);
}

void send_data_to_server(char *data) {
    char payload[MAX_DATA_STRING_LENGTH];
    const char *src_name = "esp32";  // Usar comillas dobles para cadenas
    snprintf(payload, sizeof(payload), "{\"source\": \"%s\",\"id\": \"%s\",\"message\": \"%s\"}", src_name, ID_ESP32, data);
    websocket_send(payload);
}


// Función para convertir una cadena a booleano
bool str_to_bool(const char* str) {
    ESP_LOGI(TAG, "str_to_bool : %s", str);
    return strcmp(str, "true") == 0 || strcmp(str, "1") == 0;
}

// Supongamos que esta es la función que maneja los mensajes recibidos
void handle_message(const char* message) {
    // Analizar el mensaje JSON
    // Aquí deberías usar tu propia lógica para analizar el mensaje JSON
    
    // Por ejemplo, supongamos que has analizado el mensaje y almacenado el id y el mensaje en variables
    char received_src[20];
    char received_id[20]; // Tamaño suficiente para el id
    char received_message_str[6]; // "true" o "false"
    bool received_message;

    // Simulamos el análisis del mensaje JSON y la extracción de los campos "id" y "message"
    sscanf(message, "{\"src\":\"%[^\"]\",\"id\":\"%[^\"]\",\"message\":\"%[^\"]\"}", received_src, received_id, received_message_str);
    ESP_LOGI(TAG, "received_src: %s, received_id: %s, received_message_str: %s", received_src, received_id, received_message_str);
    // Convertir la cadena a un booleano
    received_message = str_to_bool(received_message_str);


    // Comparar el id recibido con el id del ESP32 en cuestión
    if (strcmp(received_id, ID_ESP32) == 0) {
        // El id recibido corresponde al ESP32 en cuestión
        if (received_message) {
            printf("El switch del ESP32 está encendido.\n");
        } else {
            printf("El switch del ESP32 está apagado.\n");
        }
    } else {
        // El id recibido no corresponde al ESP32 en cuestión
        printf("El id recibido no corresponde al ESP32 en cuestión.\n");
    }
}

static void websocket_event_handler(void *handler_args, esp_event_base_t base, int32_t event_id, void *event_data)
{
    esp_websocket_event_data_t *data = (esp_websocket_event_data_t *)event_data;
    switch (event_id) {
    case WEBSOCKET_EVENT_CONNECTED:
        ESP_LOGI(TAG, "WEBSOCKET_EVENT_CONNECTED");
        
        break;
    case WEBSOCKET_EVENT_DATA:
        if (data->data_len)
        {
            ESP_LOGW(TAG, "Received=%.*s\n", data->data_len, (char *)data->data_ptr);
            handle_message((char *)data->data_ptr);
        }
        
        break;
    }
}




static void websocket_app_start(void)
{
    // Define the websocket connection
    esp_websocket_client_config_t websocket_cfg = {};
    websocket_cfg.uri = "ws://172.30.2.140:8080";
    ESP_LOGI(TAG, "Connecting to %s ...", websocket_cfg.uri);

    // Connect to Websocket Server
    client = esp_websocket_client_init(&websocket_cfg);
    esp_websocket_register_events(client, WEBSOCKET_EVENT_ANY, websocket_event_handler, (void *)client);

    // Send "Hello ..." to Websocket Server
    esp_websocket_client_start(client);
    char data[32];
    if (esp_websocket_client_is_connected(client)) {
        send_data_to_server("Hello");
    }
    vTaskDelay(1000 / portTICK_PERIOD_MS);

    // Stop websocket connection
    //esp_websocket_client_stop(client);
    //ESP_LOGI(TAG, "Websocket Stopped");
    //esp_websocket_client_destroy(client);
}



void app_main(void)
{
    ESP_LOGI(TAG, "[APP] Startup..");
    ESP_LOGI(TAG, "[APP] Free memory: %" PRIu32 " bytes", esp_get_free_heap_size());
    ESP_LOGI(TAG, "[APP] IDF version: %s", esp_get_idf_version());

    esp_log_level_set("*", ESP_LOG_INFO);
    esp_log_level_set("transport_base", ESP_LOG_VERBOSE);
    esp_log_level_set("esp-tls", ESP_LOG_VERBOSE);
    esp_log_level_set("transport", ESP_LOG_VERBOSE);
    esp_log_level_set("outbox", ESP_LOG_VERBOSE);

    ESP_ERROR_CHECK(nvs_flash_init());
    ESP_ERROR_CHECK(esp_netif_init());
    ESP_ERROR_CHECK(esp_event_loop_create_default());

    /* This helper function configures Wi-Fi or Ethernet, as selected in menuconfig.
     * Read "Establishing Wi-Fi or Ethernet Connection" section in
     * examples/protocols/README.md for more information about this function.
     */
    ESP_ERROR_CHECK(example_connect());


    websocket_app_start();
    ESP_LOGI(TAG, "Connection established");
    send_data_to_server("Hello");
    while (true)
    {
        /* code */
        for (size_t i = 0; i < 15; i++)
        {
            /* code */
            char msg[10];
            sprintf(msg, "%d", i);   
            ESP_LOGI(TAG, "%s", msg);
            send_data_to_server(msg);
            vTaskDelay(5000 / portTICK_PERIOD_MS);
        }
        
        
    }
    

    
}
