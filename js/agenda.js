class Agenda {

    constructor() {
        this.carrerasURL = "https://ergast.com/api/f1/current";
        this.last_api_call = null;
        this.last_api_result = null;
    }


    anotherRequest() {
        var currentDate = new Date();
        if (this.last_api_call == null)
            return true
        if (currentDate - last_api_call >= 1000 * 60 * 10) { //10 minutes
            return true;
        }
        return false;
    }

    updateSeasonData() {
        var agenda = this;
        if (this.last_api_result == null || this.anotherRequest()) {
            $.ajax({
                dataType: "xml",
                url: this.carrerasURL,
                method: "GET",
                success: function (data) {
                    var races = $('Race', data)
                    agenda.addRacesToHTML(races);
                    agenda.last_api_result = races;
                    agenda.last_api_call = new Date();
                }
            })
        }
        else {
            this.addRacesToHTML(this.last_api_result);
        }
    }

    addRacesToHTML(res) {
        $("body>section").empty();
        $("body>section").append("<header><h3>Fórmula 1</h3></header>");
        for (var i = 0; i < res.length; i++) {
            let race = res[i];
            let raceName = $('RaceName', race).text();
            let circuitName = $('CircuitName', race).text();
            let lat = $('Location', race).attr("lat")
            let long = $('Location', race).attr("long")
            let date = $('Date:first', race).text();
            let time = $('Time:first', race).text().substring(0, 5);
            let section = document.createElement("section");
            $("body>section").append(section);
            let timeSection = document.createElement("section");
            let infoSection = document.createElement("section");

            let fecha = $("<p></p>").text("Fecha: " + date);
            let hora = $("<p></p>").text("Hora: " + time);


            let nombre = $("<p></p>").text(raceName);
            let circuito = $("<p></p>").text(circuitName);
            let latitud = $("<p></p>").text("Latitud: " + lat);
            let longitud = $("<p></p>").text("Longitud: " + long);

            nombre.appendTo(timeSection);
            fecha.appendTo(timeSection);
            hora.appendTo(timeSection);

            circuito.appendTo(infoSection);
            latitud.appendTo(infoSection);
            longitud.appendTo(infoSection);

            section.appendChild(timeSection);
            section.appendChild(infoSection);
        }
    }
}


