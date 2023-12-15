class Crucigrama {

    constructor() {
        this.rows = 11;
        this.cols = 9;
        this.tablero = [];
        this.init_time = null;
        this.end_time = null;
        this.seleccion = null;
    }

    start(dificultad) {
        switch (dificultad) {
            case "Fácil":
                this.board = "4,*,.,=,12,#,#,#,5,#,#,*,#,/,#,#,#,*,4,- ,.,=,.,#,15,#,.,*,#,=,#,=,#,/,#,=,.,#,3,#,4,*,.,=,20,=,#,#,#,#,#,=,#,#,8,#,9,-,.,=,3,#,.,#,#,- ,#,+,#,#,#,*,6,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,6,#,8,*,.,=,16"
                break;
            case "Medio":
                this.board = "12,*,.,=, 36,#,#,#, 15,#,#,*,#, /,#,#,#,*,.,- ,.,=,.,#,55,#,.,*,#,=,#,=,#,/,#,=,.,#, 15,#, 9,*,.,=, 45,=,#,#,#,#,#,=,#,#, 72,#, 20, -,.,=, 11,#,.,#,#, - ,#, +,#,#,#,*, 56, /,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,12,#,16,*,.,=,32";
                break;
            case "Difícil":
                this.board = "4,.,.,=,36,#,#,#,25,#,#,*,#,.,#,#,#,.,.,- ,.,=,.,#,15,#,.,*,#,=,#,=,#,.,#,=,.,#,18,#,6,*,.,=,30,=,#,#,#,#,#,=,#,#,56,#,9,- ,.,=,3,#,.,#,#,*,#,+,#,#,#,*,20,.,.,=,18,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,18,#,24,.,.,=,72";
        }
        this.dificultad = dificultad;
        var boardArray = this.board.split(",");
        for (let i = 0; i < this.rows; i++) {
            this.tablero[i] = [];
            for (let j = 0; j < this.cols; j++) {
                var value = boardArray[i * this.cols + j];
                if (value == ".")
                    this.tablero[i][j] = 0;
                else if (value == "#")
                    this.tablero[i][j] = -1;
                else if (value >= '0' && value <= '9') {
                    this.tablero[i][j] = parseInt(value, 10);
                }
                else
                    this.tablero[i][j] = value
            }
        }
    }
    startGame(dificultad) {
        this.start(dificultad);
        this.paintMathword();
    }

    paintMathword() {
        var main = document.querySelector("main");
        $("main").empty();
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                var newParagraph = null;
                if (this.tablero[i][j] == 0) {
                    newParagraph = $("<p></p>").text("").attr("data-state", "blank");
                    newParagraph.on('click', this.click.bind(newParagraph, this))
                }
                else if (this.tablero[i][j] == -1) {
                    newParagraph = $("<p></p>").text("").attr("data-state", "empty");
                }
                else {
                    newParagraph = $("<p></p>").text(this.tablero[i][j]).attr("data-state", "blocked");
                }
                newParagraph.appendTo(main);
            }
        }
        this.init_time = new Date();
    }

    click(game) {
        if (game.seleccion != this) {
            this.attr("data-state", "clicked");
            if (game.seleccion != undefined && game.seleccion != null) {
                if (game.seleccion.attr("data-state") != "correct") {
                    game.seleccion.attr("data-state", "blank");
                }
            }
            game.seleccion = this
        }
    }

    check_win_condition() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.tablero[i][j] == 0)
                    return false;
            }
        }
        return true;
    }

    calculate_date_difference() {
        var mil = this.end_time - this.init_time
        this.tiempoSegundos = (this.end_time - this.init_time) / 1000.0;

        var segundos = Math.floor(mil / 1000);
        var minutos = Math.floor(segundos / 60);
        var horas = Math.floor(minutos / 60);
        segundos %= 60;
        minutos %= 60;

        if (segundos < 10) {
            segundos = "0" + segundos;
        }
        if (minutos < 10) {
            minutos = "0" + minutos;
        }
        if (horas < 10) {
            horas = "0" + horas;
        }

        return `${horas}:${minutos}:${segundos}`;
    }

    introduceElement(key) {
        var expression = /^[1-9+\-*/]$/
        if (!(expression.test(key))) {
            return;
        }
        if (this.seleccion == null) {
            alert("Debes pulsar una celda antes de escribir un número");
            return;
        }
        var expression_row = true;
        var expression_col = true;
        var position = this.seleccion.index();
        var row = Math.floor(position / this.cols);
        var col = position % this.cols;
        this.tablero[row][col] = key;
        var posColEqual = 0;
        var posRowEqual = 0;
        var first_number = 0;
        var second_number = 0;
        var expression = 0;
        var result = 0;
        //Horizontal
        if (col + 1 < this.cols) {
            if (!(this.tablero[row][col + 1] == -1)) {
                for (let j = col + 1; j < this.cols; j++) {
                    if (this.tablero[row][j] == "=") {
                        posColEqual = j;
                        break;
                    }
                }
                first_number = this.tablero[row][posColEqual - 3];

                expression = this.tablero[row][posColEqual - 2];

                second_number = this.tablero[row][posColEqual - 1];

                result = this.tablero[row][posColEqual + 1];
            }
        }

        if (first_number != 0 && expression != 0 && second_number != 0 && result != 0) {
            var values = [first_number, second_number];
            var operation = values.join(expression);
            try {
                if (eval(operation) != result) {
                    expression_row = false;
                }
            }
            catch {
                expression_col = false;
            }
        }


        //Vertical
        first_number = 0;
        second_number = 0;
        expression = 0;
        result = 0;
        if (row + 1 < this.rows) {
            if (!(this.tablero[row + 1][col] == -1)) {
                for (let j = row + 1; j < this.rows; j++) {
                    if (this.tablero[j][col] == "=") {
                        posRowEqual = j;
                        break;
                    }
                }
                first_number = this.tablero[posRowEqual - 3][col];

                expression = this.tablero[posRowEqual - 2][col];

                second_number = this.tablero[posRowEqual - 1][col];

                result = this.tablero[posRowEqual + 1][col];
            }
        }

        if (first_number != 0 && expression != 0 && second_number != 0 && result != 0) {
            var values = [first_number, second_number];
            var operation = values.join(expression);
            try {
                if (eval(operation) != result) {
                    expression_col = false;
                }
            }
            catch {
                expression_col = false;
            }
        }

        if (expression_col && expression_row) {
            this.seleccion.text(key);
            this.seleccion.attr("data-state", "correct");
        }
        else {
            this.tablero[row][col] = 0;
            this.seleccion.attr("data-state", "clicked");
            this.showErrorMessage();
        }


        if (this.check_win_condition()) {
            this.end_time = new Date();
            var difference = this.calculate_date_difference();
            alert(`Ha tardado ${difference} en completar el crucigrama`);
            this.createRecordForm();
        }

    }

    showErrorMessage() {
        let parrafo = $("body>p")
        parrafo.attr("data-state", "visible");
        setTimeout(() => {
            parrafo.attr("data-state", "hidden");
        }, 2000);
    }

    createRecordForm() {
        var seccionForm = $("<section>")
        var form = $("<form>").attr("name", "formulario").attr("method", "post").attr("action", "#")
        let nombreTexto = $("<p>").text("Nombre:")
        let nombre = $("<input>").attr("type", "text").attr("name", "Nombre")
        nombreTexto.append(nombre);

        let apellidosTexto = $("<p>").text("Apellidos:")
        let apellidos = $("<input>").attr("type", "text").attr("name", "Apellidos")
        apellidosTexto.append(apellidos);

        let dificultadTexto = $("<p>").text("Dificultad:")
        let dificultad = $("<input>").attr("type", "text").attr("name", "Dificultad").val(this.dificultad).attr("readonly", "");
        dificultadTexto.append(dificultad);

        let tiempoTexto = $("<p>").text("Tiempo Empleado:")
        let tiempo = $("<input>").attr("type", "text").attr("name", "Tiempo").val((this.tiempoSegundos) + " segundos").attr("readonly", "")
        tiempoTexto.append(tiempo)

        seccionForm.append($("<h4>").text("Formulario"))
        form.append(nombreTexto);
        form.append(apellidosTexto);
        form.append(dificultadTexto);
        form.append(tiempoTexto);


        form.append($("<input>").val("Guardar Record").attr("name", "boton").attr("type", "submit"));
        seccionForm.append(form);

        seccionForm.appendTo($("body"));
    }
}