class Noticias {
    noticia = this;
    constructor() {
        var isSupported = false;
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            isSupported = true;
        }
        if (isSupported) {
            var input = document.querySelector("input");
            input.addEventListener("change", function () {
                noticia.readInputFile(input.files)
            });
        }
        var button = document.querySelector("button");
        button.addEventListener("click", function () {
            noticia.generateNewFromUser()
        });
    }

    readInputFile(files) {
        var file = files[0];
        var tipoTexto = /text.*/;
        if (file.type.match(tipoTexto)) {
            var lector = new FileReader();
            lector.onload = function (evento) {
                var txt = lector.result;
                noticia.generateNews(txt);
            }
            lector.readAsText(file);
        }
    }


    generateNews(newsTxt) {
        let news = newsTxt.split("\n");
        for (let i = 0; i < news.length; i++) {
            this.generateNew(news[i]);
        }
    }

    generateNew(aNew) {
        let parts = aNew.split("_");
        let article = document.createElement("article")
        let title = parts[0];
        let author = parts[3];
        let subtitle = parts[1];
        let content = parts[2];

        let pTitle = $("<p></p>").text(title);
        let pSubtitle = $("<p></p>").text(subtitle);
        let pAuthor = $("<p></p>").text(author);
        let pContent = $("<p></p>").text(content);

        pTitle.appendTo(article);
        pSubtitle.appendTo(article);
        pAuthor.appendTo(article);
        pContent.appendTo(article);
        document.querySelector("main").append(article);
    }

    generateNewFromUser() {
        let title = $("input:eq(1)").val();
        let author = $("input:eq(3)").val();
        let subtitle = $("input:eq(2)").val();
        let content = $("textarea").val();

        if (title.trim() == "" || author.trim() == "" || subtitle.trim() == "" || content.trim() == "") {
            alert("La noticia no puede tener partes vacías");
            return;
        }
        this.generateNew(title + "_" + subtitle + "_" + content + "_" + author);
    }


}
