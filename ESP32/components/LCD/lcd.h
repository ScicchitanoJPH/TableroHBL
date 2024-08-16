#ifndef LCD_H
#define LCD_H

#include <stdint.h>  // Añadido para uint8_t

void lcd_init(void);
void lcd_write_string(const char* str, uint8_t row, uint8_t col);

#endif // LCD_H