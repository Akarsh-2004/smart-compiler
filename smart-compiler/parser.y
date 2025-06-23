%{
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "security.h"
#include "symboltable.h"
#include "deadcode.h"

extern int yylex();
extern int yylineno;
extern char* yytext;
void yyerror(const char* s);

// Global symbol table
SymbolTable* current_symbol_table;

// Security flags
int has_buffer_overflow = 0;
int has_format_string_vulnerability = 0;
int has_integer_overflow = 0;

// Function to check if a variable is initialized before use
void check_initialized(char* name) {
    Symbol* symbol = lookup_symbol(current_symbol_table, name);
    if (symbol != NULL) {
        if (!symbol->initialized) {
            printf("Warning: Variable '%s' used before initialization at line %d\n", name, yylineno);
        }
        mark_symbol_used(current_symbol_table, name);
    }
}

// Function to validate array access
void validate_array_access(char* name, int index) {
    Symbol* symbol = lookup_symbol(current_symbol_table, name);
    if (symbol != NULL) {
        if (index < 0 || index >= symbol->size) {
            printf("Warning: Array index out of bounds for '%s' at line %d\n", name, yylineno);
            has_buffer_overflow = 1;
        }
    }
}

// Function to check for format string vulnerabilities
void check_format_string(char* format) {
    if (strstr(format, "%n") != NULL) {
        printf("Warning: Potentially dangerous format string at line %d\n", yylineno);
        has_format_string_vulnerability = 1;
    }
}
%}

%union {
    int ival;
    float fval;
    char* sval;
    struct {
        char* name;
        int index;
    } array_access;
}

%token <ival> INTEGER
%token <fval> FLOAT
%token <sval> IDENTIFIER STRING
%token INT FLOAT_TYPE CHAR VOID
%token IF ELSE WHILE FOR RETURN
%token PLUS MINUS TIMES DIVIDE
%token ASSIGN EQ NE LT LE GT GE
%token SEMI COMMA LPAREN RPAREN LBRACE RBRACE LBRACKET RBRACKET
%token PRINTF SCANF

%type <ival> type expr
%type <array_access> array_access

%left PLUS MINUS
%left TIMES DIVIDE
%nonassoc UMINUS

%%

program: 
    declarations statements
    ;

declarations:
    declarations declaration
    | /* empty */
    ;

declaration:
    type IDENTIFIER SEMI {
        add_symbol(current_symbol_table, $2, $1, 1);
    }
    | type IDENTIFIER LBRACKET INTEGER RBRACKET SEMI {
        add_symbol(current_symbol_table, $2, $1, $4);
    }
    ;

type:
    INT { $$ = 1; }
    | FLOAT_TYPE { $$ = 2; }
    | CHAR { $$ = 3; }
    | VOID { $$ = 4; }
    ;

statements:
    statements statement
    | /* empty */
    ;

statement:
    assignment_statement
    | if_statement
    | while_statement
    | for_statement
    | return_statement
    | print_statement
    | scan_statement
    | LBRACE statements RBRACE
    ;

assignment_statement:
    IDENTIFIER ASSIGN expr SEMI {
        Symbol* symbol = lookup_symbol(current_symbol_table, $1);
        if (symbol != NULL) {
            mark_symbol_initialized(current_symbol_table, $1);
        } else {
            printf("Error: Undeclared variable '%s' at line %d\n", $1, yylineno);
        }
    }
    | array_access ASSIGN expr SEMI {
        Symbol* symbol = lookup_symbol(current_symbol_table, $1.name);
        if (symbol != NULL) {
            mark_symbol_initialized(current_symbol_table, $1.name);
            validate_array_access($1.name, $1.index);
        } else {
            printf("Error: Undeclared variable '%s' at line %d\n", $1.name, yylineno);
        }
    }
    ;

array_access:
    IDENTIFIER LBRACKET expr RBRACKET {
        $$.name = $1;
        $$.index = $3;
        validate_array_access($1, $3);
    }
    ;

if_statement:
    IF LPAREN expr RPAREN statement
    | IF LPAREN expr RPAREN statement ELSE statement
    ;

while_statement:
    WHILE LPAREN expr RPAREN statement
    ;

for_statement:
    FOR LPAREN assignment_statement expr SEMI expr RPAREN statement
    | FOR LPAREN SEMI expr SEMI expr RPAREN statement  /* For empty initialization */
    ;

return_statement:
    RETURN expr SEMI
    | RETURN SEMI
    ;

print_statement:
    PRINTF LPAREN STRING RPAREN SEMI {
        check_format_string($3);
    }
    | PRINTF LPAREN STRING COMMA expr RPAREN SEMI {
        check_format_string($3);
    }
    ;

scan_statement:
    SCANF LPAREN STRING COMMA IDENTIFIER RPAREN SEMI {
        Symbol* symbol = lookup_symbol(current_symbol_table, $5);
        if (symbol != NULL) {
            mark_symbol_initialized(current_symbol_table, $5);
        } else {
            printf("Error: Undeclared variable '%s' at line %d\n", $5, yylineno);
        }
        check_format_string($3);
    }
    ;

expr:
    INTEGER { 
        $$ = $1;
        // No overflow for single value
    }
    | FLOAT { $$ = 0; }
    | IDENTIFIER { 
        check_initialized($1);
        Symbol* symbol = lookup_symbol(current_symbol_table, $1);
        if (symbol != NULL) {
            $$ = 0; // Placeholder value
        } else {
            printf("Error: Undeclared variable '%s' at line %d\n", $1, yylineno);
            $$ = 0;
        }
    }
    | array_access { $$ = 0; }
    | expr PLUS expr { 
    	check_integer_overflow($1, $3, '+', yylineno);
    	$$ = $1 + $3; 
    }
    | expr MINUS expr { 
        check_integer_overflow($1, $3, '-', yylineno);
        $$ = $1 - $3; 
    }
    | expr TIMES expr { 
        check_integer_overflow($1, $3, '*', yylineno);
        $$ = $1 * $3; 
    }
    | expr DIVIDE expr { 
        if ($3 == 0) {
            printf("Warning: Division by zero at line %d\n", yylineno);
            $$ = 0;
        } else {
            check_integer_overflow($1, $3, '/', yylineno);
            $$ = $1 / $3;
        }
    }
    | expr EQ expr { $$ = $1 == $3; }
    | expr NE expr { $$ = $1 != $3; }
    | expr LT expr { $$ = $1 < $3; }
    | expr LE expr { $$ = $1 <= $3; }
    | expr GT expr { $$ = $1 > $3; }
    | expr GE expr { $$ = $1 >= $3; }
    | MINUS expr %prec UMINUS { $$ = -$2; }
    | LPAREN expr RPAREN { $$ = $2; }
    ;


%%

int main() {
    current_symbol_table = create_symbol_table();
    yyparse();

    printf("\nSecurity and Dead Code Analysis Summary:\n");
    printf("----------------------------------------\n");
    check_unused_variables(current_symbol_table);
    printf("Buffer overflow vulnerabilities: %s\n", has_buffer_overflow ? "DETECTED" : "None detected");
    printf("Format string vulnerabilities: %s\n", has_format_string_vulnerability ? "DETECTED" : "None detected");
    printf("Integer overflow vulnerabilities: %s\n", has_integer_overflow ? "DETECTED" : "None detected");

    return 0;
}

void yyerror(const char* s) {
    fprintf(stderr, "Error: %s at line %d\n", s, yylineno);
}
