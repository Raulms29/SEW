class BlocNotas {
    constructor() {
        let bloc = this;
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            var input = document.querySelector("input[type=file]");
            input.addEventListener("change", function () {
                bloc.readInputFile(input.files)
            });
        }
        this.notas = this.getNotesFromStorage();
        this.addNotesToHTMLFromStorage();
        let button = document.querySelector("button");
        button.addEventListener("click", function () {
            bloc.generateNoteFromUser()
        });
    }

    addNotesToHTMLFromStorage() {
        Object.entries(this.notas).forEach(([titulo, nota]) => {
            this.addNoteToHTML(titulo, nota.contenido)
        });
    }

    getNotesFromStorage() {
        let notasString = localStorage.getItem("notas");
        let notas = JSON.parse(notasString);
        if (notas == null)
            return {};
        return notas;
    }

    generateNoteFromUser() {
        let titleElement = $("input[type=text]");
        let contentElement = $("textarea");

        if (titleElement.val().trim() == "" || contentElement.val().trim() == "") {
            alert("La nota no puede tener partes vacías");
            return;
        }
        this.generateNote(titleElement.val(), contentElement.val());
        titleElement.val('');
        contentElement.val('');
    }

    generateNote(title, content) {
        this.addNoteToHTML(title, content);
        this.saveNote(title, content);
    }

    addNoteToHTML(title, content) {
        let bloc = this;
        let main = $("main")
        let seccionNota = $("<article>")
        let seccionBotones = $("<section>")
        let tituloNota = $("<h3>").text(title)
        let contenido = $("<p>").text(content)
        let copia = $("<button>").text("Copiar al Portapapeles").on("click", function () {
            let boton = this;
            let nota = boton.parentNode.parentNode;
            navigator.clipboard.writeText(nota.querySelector("p").textContent);
        });
        let eliminar = $("<button>").text("X").attr("title", "Eliminar Nota").on("click", function () {
            let boton = this;
            let nota = boton.parentNode.parentNode;
            let titulo = nota.querySelector("h3").textContent;
            delete bloc.notas[titulo];
            bloc.updateStorage();
            nota.remove();
        });
        seccionNota.append(tituloNota);
        seccionNota.append(contenido);
        seccionBotones.append($("<h4></h4>").text("Opciones: "));
        seccionBotones.append(copia);
        seccionBotones.append(eliminar);
        seccionNota.append(seccionBotones);
        main.append(seccionNota);
    }
    updateStorage() {
        var stringNotes = JSON.stringify(this.notas);
        localStorage.setItem("notas", stringNotes)
    }

    saveNote(title, content) {
        let nota = { titulo: title, contenido: content }
        this.notas[title] = nota;
        this.updateStorage();
    }

    readInputFile(files) {
        let bloc = this;
        var file = files[0];
        var tipoTexto = /text.*/;
        if (file.type.match(tipoTexto)) {
            var lector = new FileReader();
            lector.onload = function (evento) {
                var txt = evento.target.result;
                bloc.generateNotesFromFile(txt);
            }
            lector.readAsText(file);
        }
    }

    generateNotesFromFile(txt) {
        let notes = txt.split("\n");
        for (let i = 0; i < notes.length; i++) {
            this.generateNoteFromFile(notes[i]);
        }
    }

    generateNoteFromFile(note) {
        let parts = note.split(";");
        this.generateNote(parts[0], parts[1]);
    }
}