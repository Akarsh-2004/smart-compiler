#include <stdio.h>
#include "deadcode.h"
#include "symboltable.h"

// Function to check for unused variables
void check_unused_variables(SymbolTable* table) {
    int unused_count = 0;
    
    for (int i = 0; i < table->size; i++) {
        Symbol* symbol = &table->symbols[i];
        if (!symbol->used) {
            printf("Warning: Unused variable '%s'\n", symbol->name);
            unused_count++;
        }
    }
    
    if (unused_count > 0) {
        printf("Found %d unused variables (dead code)\n", unused_count);
    } else {
        printf("No unused variables detected\n");
    }
}
