/* Symbol table implementation for the smart compiler */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "symboltable.h"

// Create a new symbol table
SymbolTable* create_symbol_table() {
    SymbolTable* table = (SymbolTable*)malloc(sizeof(SymbolTable));
    if (table == NULL) {
        fprintf(stderr, "Memory allocation failed for symbol table\n");
        exit(1);
    }
    table->size = 0;
    table->capacity = INITIAL_TABLE_SIZE;
    table->symbols = (Symbol*)malloc(sizeof(Symbol) * table->capacity);
    if (table->symbols == NULL) {
        fprintf(stderr, "Memory allocation failed for symbols array\n");
        free(table);
        exit(1);
    }
    return table;
}

// Add a symbol to the symbol table
Symbol* add_symbol(SymbolTable* table, char* name, int type, int size) {
    // Check if symbol already exists
    Symbol* existing = lookup_symbol(table, name);
    if (existing != NULL) {
        fprintf(stderr, "Error: Symbol '%s' already defined\n", name);
        return existing;
    }
    
    // Resize table if needed
    if (table->size >= table->capacity) {
        table->capacity *= 2;
        table->symbols = (Symbol*)realloc(table->symbols, sizeof(Symbol) * table->capacity);
        if (table->symbols == NULL) {
            fprintf(stderr, "Memory reallocation failed for symbols array\n");
            exit(1);
        }
    }
    
    // Add the new symbol
    Symbol* symbol = &table->symbols[table->size++];
    symbol->name = strdup(name);
    symbol->type = type;
    symbol->size = size;
    symbol->initialized = 0;
    symbol->used = 0;
    
    return symbol;
}

// Look up a symbol in the symbol table
Symbol* lookup_symbol(SymbolTable* table, char* name) {
    for (int i = 0; i < table->size; i++) {
        if (strcmp(table->symbols[i].name, name) == 0) {
            return &table->symbols[i];
        }
    }
    return NULL;
}

// Mark a symbol as initialized
void mark_symbol_initialized(SymbolTable* table, char* name) {
    Symbol* symbol = lookup_symbol(table, name);
    if (symbol != NULL) {
        symbol->initialized = 1;
    }
}

// Mark a symbol as used
void mark_symbol_used(SymbolTable* table, char* name) {
    Symbol* symbol = lookup_symbol(table, name);
    if (symbol != NULL) {
        symbol->used = 1;
    }
}

// Free the memory used by the symbol table
void free_symbol_table(SymbolTable* table) {
    if (table == NULL) return;
    
    for (int i = 0; i < table->size; i++) {
        free(table->symbols[i].name);
    }
    
    free(table->symbols);
    free(table);
}
