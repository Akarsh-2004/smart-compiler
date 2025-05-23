#ifndef SYMBOLTABLE_H
#define SYMBOLTABLE_H

#define INITIAL_TABLE_SIZE 64

// Symbol structure
typedef struct Symbol {
    char* name;       // Name of the symbol
    int type;         // Type of the symbol (1=int, 2=float, 3=char, 4=void)
    int size;         // Size (for arrays)
    int initialized;  // 1 if initialized, 0 otherwise
    int used;         // 1 if used, 0 otherwise
} Symbol;

// Symbol table structure
typedef struct SymbolTable {
    Symbol* symbols;  // Array of symbols
    int size;         // Current number of symbols
    int capacity;     // Maximum capacity
} SymbolTable;

// Symbol table operations
SymbolTable* create_symbol_table();
Symbol* add_symbol(SymbolTable* table, char* name, int type, int size);
Symbol* lookup_symbol(SymbolTable* table, char* name);
void mark_symbol_initialized(SymbolTable* table, char* name);
void mark_symbol_used(SymbolTable* table, char* name);
void free_symbol_table(SymbolTable* table);

#endif /* SYMBOLTABLE_H */
