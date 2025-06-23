%{
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "parser.tab.h"

extern int yylineno;
%}

%option noyywrap
%option yylineno

%%

[ \t\n]         { /* Ignore whitespace */ }
"//".*          { /* Ignore comments */ }

"int"           { return INT; }
"float"         { return FLOAT_TYPE; }
"char"          { return CHAR; }
"void"          { return VOID; }

"if"            { return IF; }
"else"          { return ELSE; }
"while"         { return WHILE; }
"for"           { return FOR; }
"return"        { return RETURN; }

"printf"        { return PRINTF; }
"scanf"         { return SCANF; }

[a-zA-Z_][a-zA-Z0-9_]*  { 
                    yylval.sval = strdup(yytext);
                    return IDENTIFIER; 
                }

[0-9]+          { 
                    yylval.ival = atoi(yytext);
                    return INTEGER; 
                }

[0-9]+\.[0-9]+  { 
                    yylval.fval = atof(yytext);
                    return FLOAT; 
                }

\"([^\\\"]|\\.)*\"  { 
                    yylval.sval = strdup(yytext);
                    return STRING; 
                }

"+"             { return PLUS; }
"-"             { return MINUS; }
"*"             { return TIMES; }
"/"             { return DIVIDE; }

"="             { return ASSIGN; }
"=="            { return EQ; }
"!="            { return NE; }
"<"             { return LT; }
"<="            { return LE; }
">"             { return GT; }
">="            { return GE; }

";"             { return SEMI; }
","             { return COMMA; }
"("             { return LPAREN; }
")"             { return RPAREN; }
"{"             { return LBRACE; }
"}"             { return RBRACE; }
"["             { return LBRACKET; }
"]"             { return RBRACKET; }

.               { printf("Lexical error: Unknown character %s at line %d\n", yytext, yylineno); }

%%
