class Sudoku {

    constructor() {
        this.stringTablero = "8.4.71.9.976.3....5.196....3.7495...692183...4.5726..92483591..169847...753612984";
        this.rows = 9;
        this.cols = 9;
        this.tablero = [];
        this.seleccion = null;
        this.start();
    }

    start() {
        for (let i = 0; i < this.rows; i++) {
            this.tablero[i] = [];
            for (let j = 0; j < this.cols; j++) {
                var value = this.stringTablero[i * this.rows + j];
                if (value == ".")
                    this.tablero[i][j] = 0;
                else
                    this.tablero[i][j] = parseInt(value, 10);
            }
        }
    }

    createStructure() {
        var main = document.querySelector("main");
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                var newParagraph = document.createElement("p")
                if (this.tablero[i][j] == 0) {
                    newParagraph.addEventListener("click", this.click.bind(newParagraph, this))
                    newParagraph.setAttribute("data-state", "empty")
                }
                else {
                    newParagraph.appendChild(document.createTextNode(this.tablero[i][j]));
                    newParagraph.setAttribute("data-state", "blocked")
                }
                main.appendChild(newParagraph);
            }
        }
    }

    paintSudoku() {
        this.createStructure();
    }

    click(game) {
        this.setAttribute("data-state", "clicked");
        game.seleccion = this
    }


    //Una vex introducido el numero no elimino el eventListener de manera que el usuario pueda cambiar
    // el numero en caso de haber cometido un error
    introduceNumber(numero) {
        var position = Array.from(document.querySelector("main").children).indexOf(this.seleccion);

        var row = Math.floor(position / this.rows);
        var col = position % this.cols;

        for (let i = 0; i < this.rows; i++) {
            if (this.tablero[row][i] == numero) {
                return;
            }
        }

        for (let i = 0; i < this.cols; i++) {
            if (this.tablero[i][col] == numero) {
                return;
            }
        }
        var startRowSquare = Math.floor(row / 3) * 3;
        var startColSquare = Math.floor(col / 3) * 3;


        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.tablero[startRowSquare + i][startColSquare + j] == numero) {
                    return;
                }
            }
        }
        this.tablero[row][col] = numero;

        this.seleccion.setAttribute("data-state", "correct");
        this.seleccion.textContent = numero;
        this.seleccion = null;
        if (this.endOfgame()) {
            alert("Ha completado el sudoku!")
        }
    }

    endOfgame() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.tablero[i][j] == 0) {
                    return false;
                }
            }
        }
        return true;
    }
}