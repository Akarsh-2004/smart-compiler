#include <stdio.h>
#include <limits.h>
#include "security.h"

extern int has_integer_overflow;

void check_integer_overflow(int a, int b, char operation, int lineno) {
    int overflow = 0;

    switch (operation) {
        case '+':
            if ((b > 0 && a > INT_MAX - b) || (b < 0 && a < INT_MIN - b))
                overflow = 1;
            break;
        case '-':
            if ((b < 0 && a > INT_MAX + b) || (b > 0 && a < INT_MIN + b))
                overflow = 1;
            break;
        case '*':
            if (a != 0 && (a > INT_MAX / b || a < INT_MIN / b))
                overflow = 1;
            break;
        case '/':
            if (b == 0 || (a == INT_MIN && b == -1))
                overflow = 1;
            break;
    }

    if (overflow) {
        printf("Warning: Potential integer overflow during operation '%c' at line (approx) %d\n", operation, lineno);
        has_integer_overflow = 1;
    }
}
