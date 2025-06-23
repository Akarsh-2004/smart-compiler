#ifndef SECURITY_H
#define SECURITY_H

// Security check functions
void check_buffer_overflow(char* array_name, int index, int size);
void check_format_string_vulnerability(char* format);
void check_integer_overflow(int a, int b, char operation, int lineno);


#endif /* SECURITY_H */
