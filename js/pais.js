class Pais {
    rellenarAtributos(gobierno, latitud, longitud, religion) {
        this.gobierno = gobierno;
        this.latitud = latitud;
        this.longitud = longitud;
        this.religion = religion;
    }

    constructor(nombre, capital, poblacion, gobierno, latitud, longitud, religion) {
        this.capital = capital;
        this.nombre = nombre;
        this.poblacion = poblacion;
        this.rellenarAtributos(gobierno, latitud, longitud, religion);
    }



    getCapital() {
        return this.capital;
    }
    getNombre() {
        return this.nombre;
    }
    getPoblacion() {
        return this.poblacion;
    }
    getGobierno() {
        return this.gobierno;
    }
    getLatitud() {
        return this.latitud;
    }

    getLongitud() {
        return this.longitud;
    }
    getReligion() {
        return this.religion;
    }

    getInformacionSecundaria() {
        var res = "<ul>";
        res += "<li>" + "Población: " + this.getPoblacion() + " habitantes</li>";
        res += "<li>" + "Tipo de Gobierno: " + this.getGobierno() + "</li>";
        res += "<li>" + "Religión: " + this.getReligion() + "</li>";
        res += "</ul>";
        return res;
    }

    escribirCoordenadas() {
        document.write(
            "<p> Coordenadas de la capital " + this.getCapital() + "</p>" +
            "<p>Latitud: " + this.getLatitud() + " Longitud: " + this.getLongitud() + "</p>"
        );
    }

    showWeatherForecast() {
        const apiKey = "1de7d98609154432123ea5fb30cf5c5e";
        const units = "metric";
        const lang = "es";
        const openWeatherAPI = `https://api.openweathermap.org/data/2.5/forecast?lat=${this.latitud}&lon=${this.longitud}&appid=${apiKey}&units=${units}&lang=${lang}`;

        var getData = function (datos) {
            var prevDay = "";
            var prevHour = "";
            var data = [];
            for (var i = 0; i < datos.list.length; i++) {
                let day = datos.list[i].dt_txt.split(" ")[0];
                let hour = datos.list[i].dt_txt.split(" ")[1];
                if (i == 0) {
                    prevHour = hour;
                }
                if (day != prevDay && hour == prevHour) {
                    data.push(datos.list[i]);
                    prevDay = day;
                }
            }
            return data;
        }

        $.ajax({
            dataType: "json",
            url: openWeatherAPI,
            method: "GET",
            success: function (datos) {

                var data = getData(datos);
                var dateFormat = { weekday: 'long' };
                for (var i = 0; i < data.length; i++) {
                    let weather = data[i];
                    let maxTemp = weather.main.temp_max;
                    let minTemp = weather.main.temp_min;
                    let humidity = weather.main.humidity;
                    let rainQuantity = "0.00";
                    try {
                        rainQuantity = weather.rain['3h'];
                    } catch (err) {

                    }
                    let iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
                    let section = document.createElement("section");
                    $("body>section").append(section);
                    let fechaYHora = weather.dt_txt.split(" ")
                    let txtFecha = fechaYHora[0];
                    let fecha = new Date(txtFecha);
                    let dayName = fecha.toLocaleDateString('es', dateFormat);
                    dayName = dayName.charAt(0).toUpperCase() + dayName.slice(1);
                    let day = $("<p></p>").text(dayName);
                    day.appendTo(section)
                    let section2 = document.createElement("section");
                    $(`body>section section:nth-of-type(${i + 1})`).append(section2);

                    let txtHora = fechaYHora[1].split(":");
                    let hora = $("<p></p>").text(txtHora[0] + ":" + txtHora[1]);
                    let imagen = $("<img></img>").attr("src", iconUrl).attr("alt", weather.weather[0].description);
                    let maxTempParagraph = $("<p></p>").text("Temperatura Máxima: " + maxTemp + " °C")
                    let minTempParagraph = $("<p></p>").text("Temperatura Mínima: " + minTemp + " °C")
                    let humedadParagraph = $("<p></p>").text("Humedad: " + humidity + "%")
                    let rainQuantityParagraph = $("<p></p>").text("Cantidad de lluvia: " + rainQuantity + " mm")


                    hora.appendTo(section2)
                    imagen.appendTo(section2)
                    maxTempParagraph.appendTo(section2)
                    minTempParagraph.appendTo(section2)
                    humedadParagraph.appendTo(section2)
                    rainQuantityParagraph.appendTo(section2)
                }

            }

        })

    }
}
