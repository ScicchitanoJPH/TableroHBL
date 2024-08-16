#include "lcd.h"
#include <string.h>
#include "driver/i2c.h"
#include "esp_log.h"

#define I2C_MASTER_SCL_IO 22               // GPIO number for I2C master clock
#define I2C_MASTER_SDA_IO 21               // GPIO number for I2C master data
#define I2C_MASTER_NUM I2C_NUM_0           // I2C port number for master dev
#define I2C_MASTER_FREQ_HZ 100000          // I2C master clock frequency
#define I2C_MASTER_TX_BUF_DISABLE 0        // I2C master do not need buffer
#define I2C_MASTER_RX_BUF_DISABLE 0        // I2C master do not need buffer
#define LCD_ADDR 0x27                      // Address of PCF8574T

#define ACK_CHECK_EN 0x1                   // I2C master will check ack from slave
#define ACK_CHECK_DIS 0x0                  // I2C master will not check ack from slave
#define ACK_VAL 0x0                        // I2C ack value
#define NACK_VAL 0x1                       // I2C nack value

// Command bytes for the LCD
#define LCD_CMD_CLEAR_DISPLAY 0x01
#define LCD_CMD_RETURN_HOME 0x02
#define LCD_CMD_ENTRY_MODE_SET 0x04
#define LCD_CMD_DISPLAY_CONTROL 0x08
#define LCD_CMD_CURSOR_SHIFT 0x10
#define LCD_CMD_FUNCTION_SET 0x20
#define LCD_CMD_SET_CGRAM_ADDR 0x40
#define LCD_CMD_SET_DDRAM_ADDR 0x80

#define LCD_CMD_FUNCTION_SET_8BIT 0x30     // 8-bit interface
#define LCD_CMD_FUNCTION_SET_4BIT 0x20     // 4-bit interface
#define LCD_CMD_DISPLAY_CONTROL_ON 0x0C    // Display on, cursor off

// Function to write a command to the LCD
void lcd_write_cmd(uint8_t cmd) {
    i2c_cmd_handle_t cmd_handle = i2c_cmd_link_create();
    i2c_master_start(cmd_handle);
    i2c_master_write_byte(cmd_handle, (LCD_ADDR << 1) | I2C_MASTER_WRITE, ACK_CHECK_EN);
    i2c_master_write_byte(cmd_handle, cmd, ACK_CHECK_EN);
    i2c_master_stop(cmd_handle);
    i2c_master_cmd_begin(I2C_MASTER_NUM, cmd_handle, 1000 / portTICK_PERIOD_MS);  // Cambiado a portTICK_PERIOD_MS
    i2c_cmd_link_delete(cmd_handle);
}

// Function to initialize the I2C interface and the LCD
void lcd_init(void) {
    int i2c_master_port = I2C_MASTER_NUM;
    i2c_config_t conf = {
        .mode = I2C_MODE_MASTER,
        .sda_io_num = I2C_MASTER_SDA_IO,
        .sda_pullup_en = GPIO_PULLUP_ENABLE,
        .scl_io_num = I2C_MASTER_SCL_IO,
        .scl_pullup_en = GPIO_PULLUP_ENABLE,
        .master.clk_speed = I2C_MASTER_FREQ_HZ,
        .clk_flags = 0,  // Usar flags predeterminados
    };

    i2c_param_config(i2c_master_port, &conf);
    i2c_driver_install(i2c_master_port, conf.mode, I2C_MASTER_RX_BUF_DISABLE, I2C_MASTER_TX_BUF_DISABLE, 0);

    vTaskDelay(100 / portTICK_PERIOD_MS);  // Cambiado a portTICK_PERIOD_MS

    // Initialize the LCD
    lcd_write_cmd(0x30); // Function set
    vTaskDelay(5 / portTICK_PERIOD_MS);
    lcd_write_cmd(0x30); // Function set
    vTaskDelay(1 / portTICK_PERIOD_MS);
    lcd_write_cmd(0x30); // Function set
    lcd_write_cmd(0x20); // 4-bit mode
    lcd_write_cmd(LCD_CMD_FUNCTION_SET_4BIT | 0x08); // 2 line, 5x8 dots
    lcd_write_cmd(LCD_CMD_DISPLAY_CONTROL | 0x04); // Display on, cursor off
    lcd_write_cmd(LCD_CMD_CLEAR_DISPLAY); // Clear display
    vTaskDelay(2 / portTICK_PERIOD_MS);
    lcd_write_cmd(LCD_CMD_ENTRY_MODE_SET | 0x02); // Increment mode
}

// Function to write a string to the LCD
void lcd_write_string(const char* str, uint8_t row, uint8_t col) {
    uint8_t pos = 0;
    switch(row) {
        case 0: pos = col; break;
        case 1: pos = 0x40 + col; break;
        case 2: pos = 0x14 + col; break;
        case 3: pos = 0x54 + col; break;
        default: return; // Invalid row
    }
    lcd_write_cmd(0x80 | pos);

    for (size_t i = 0; i < strlen(str); ++i) {
        i2c_cmd_handle_t cmd_handle = i2c_cmd_link_create();
        i2c_master_start(cmd_handle);
        i2c_master_write_byte(cmd_handle, (LCD_ADDR << 1) | I2C_MASTER_WRITE, ACK_CHECK_EN);
        i2c_master_write_byte(cmd_handle, str[i], ACK_CHECK_EN);
        i2c_master_stop(cmd_handle);
        i2c_master_cmd_begin(I2C_MASTER_NUM, cmd_handle, 1000 / portTICK_PERIOD_MS);  // Cambiado a portTICK_PERIOD_MS
        i2c_cmd_link_delete(cmd_handle);
    }
}
