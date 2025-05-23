compiler: parser.tab.c lex.yy.c symboltable.c deadcode.c security.c
	gcc -Wall -o compiler parser.tab.c lex.yy.c symboltable.c deadcode.c security.c -lfl

parser.tab.c parser.tab.h: parser.y
	bison -d parser.y

lex.yy.c: lexer.l parser.tab.h
	flex lexer.l

clean:
	rm -f compiler parser.tab.* lex.yy.c
