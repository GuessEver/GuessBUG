all: pdf done view

pdf: GuessBUG.tex
	xelatex GuessBUG.tex
	xelatex GuessBUG.tex

done:	
	rm -f *.toc *.log *.out *.aux

clean:
	rm -f *.toc *.log *.out *.aux *.pdf

view:
	evince GuessBUG.pdf
