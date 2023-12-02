class Viajes {
    constructor() {
        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));
    }


    getPosicion(posicion) {
        this.longitud = posicion.coords.longitude;
        this.latitud = posicion.coords.latitude;
        this.apiKey = "pk.eyJ1IjoicmF1bG1zMjkiLCJhIjoiY2xwazBqamQ3MDVkOTJpcXY5c2w2NThzMCJ9.ql_7LdwmvZHFlEwBlkud-w"
        this.obtenerMapaEstatico();
        this.obtenerMapaDinamico(this.longitud, this.latitud);
    }

    verErrores(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                this.mensaje = "La página solo podra cargar si permite el acceso a su ubicación"
                break;
            case error.POSITION_UNAVAILABLE:
                this.mensaje = "No se ha podido acceder a su ubicación"
                break;
            case error.TIMEOUT:
                this.mensaje = "La petición de su ubicación ha caducado"
                break;
            case error.UNKNOWN_ERROR:
                this.mensaje = "Se ha producido un error desconocido"
                break;
        }
        var main = document.querySelector("section");
        var parrafo = document.createElement("p");
        parrafo.appendChild(document.createTextNode(this.mensaje));
        main.append(parrafo);
    }

    obtenerMapaEstatico() {
        var imageUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+ff0000(${this.longitud},${this.latitud})/${this.longitud},${this.latitud},14,0,0/800x400?access_token=${this.apiKey}`;
        var map = $("#mapa")
        var h3 = $("<h3></h3>").text("Tu ubicación")
        var h4 = $("<h4></h4>").text("Mapa Estático")
        var img = $("<img/>").attr("src", imageUrl).attr("alt", "Mapa en el que se muestra tu ubicación");
        map.before(h3);
        map.before(h4);
        map.before(img);
    }

    obtenerMapaDinamico(longitud, latitud) {
        var mapa = $("#mapa")
        mapboxgl.accessToken = this.apiKey;
        var map = new mapboxgl.Map({
            container: 'mapa',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [longitud, latitud],
            zoom: 13.75
        });
        map.on('idle', function () {
            map.resize()
        })

        var h4 = $("<h4></h4>").text("Mapa Dinámico")
        mapa.before(h4);
        new mapboxgl.Marker().setLngLat([longitud, latitud]).addTo(map);
    }

    leerXML(files) {
        let viajes = this;
        var archivo = files[0];
        var tipoTexto = /text.xml/;
        if (archivo.type.match(tipoTexto)) {
            var lector = new FileReader();
            lector.onload = function (evento) {
                let xml = evento.target.result;
                viajes.generateXML(xml);
            }
            lector.readAsText(archivo);
        }
    }
    generateXML(xml) {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");
        let rutas = xmlDoc.querySelectorAll("ruta")
        for (let i = 0; i < rutas.length; i++) {
            var seccionRuta = $("<section>")
            let ruta = rutas[i];
            let nombre = ruta.getAttribute("nombre");
            let tipo = ruta.getAttribute("tipo");
            let transporte = ruta.getAttribute("medio_transporte");
            let agencia = ruta.getAttribute("agencia");
            let adecuado = ruta.getAttribute("personas_adecuadas");
            let inicio = ruta.getAttribute("lugar_inicio");
            let direccion = ruta.getAttribute("direccion");
            let duracion = this.getDuracion(ruta.querySelector("duracion").textContent);
            let recomendacion = ruta.querySelector("recomendacion").textContent
            let descripcion = ruta.querySelector("descripcion").textContent
            var coordenadas = ruta.querySelector("coordenadas");
            let latitud = coordenadas.querySelector("latitud").textContent;
            let longitud = coordenadas.querySelector("longitud").textContent;
            var alt = coordenadas.querySelector("altitud")
            let altitud = alt.textContent + " " + alt.getAttribute("unidades");
            var referencias = ruta.querySelector("referencias")
            var hitos = ruta.querySelector("hitos");

            seccionRuta.append($("<h4>").text(`Ruta ${i + 1} - ${nombre}`));
            var seccionRutaInfo = $("<section>");

            seccionRutaInfo.append($("<h5>").text(`Información`))
            seccionRutaInfo.append($("<p>").text(`Tipo: ${tipo}`));
            seccionRutaInfo.append($("<p>").text(`Transporte: ${transporte}`));
            seccionRutaInfo.append($("<p>").text(`Agencia: ${agencia}`));
            seccionRutaInfo.append($("<p>").text(`Experiencia Requerida: ${adecuado}`));
            seccionRutaInfo.append($("<p>").text(`Duración: ${duracion}`));
            seccionRutaInfo.append($("<p>").text(`Recomendación: ${recomendacion.trim()}/10`));
            seccionRutaInfo.append($("<p>").text(`Descripción: ${descripcion}`));

            var sectionLugar = $("<section>")
            sectionLugar.append($("<h6>").text(`Lugar`));
            sectionLugar.append($("<p>").text(`Lugar de Inicio: ${inicio}`));
            sectionLugar.append($("<p>").text(`Dirección: ${direccion}`));
            sectionLugar.append($("<p>").text(`Latitud: ${latitud}`));
            sectionLugar.append($("<p>").text(`Longitud: ${longitud}`));
            sectionLugar.append($("<p>").text(`Altitud: ${altitud}`));
            sectionLugar.appendTo(seccionRutaInfo);

            var seccionRutaReferencias = $("<section>");

            this.añadirReferencias(referencias, seccionRutaReferencias);
            var seccionHitos = $("<section>");
            this.añadirHitos(hitos, seccionHitos);

            seccionRutaInfo.appendTo(seccionRuta);
            seccionRutaReferencias.appendTo(seccionRuta);
            seccionHitos.appendTo(seccionRuta);
            seccionRuta.appendTo($("section:eq(1)"));
        }
    }

    añadirReferencias(referencias, seccionRutaReferencias) {
        var ref = referencias.querySelectorAll("referencia")
        seccionRutaReferencias.append($("<h5>").text("Referencias"));
        for (let k = 0; k < ref.length; k++) {
            let parrrafoReferencia = $("<p>")
            parrrafoReferencia.append($("<a>").text(`Referencia ${k + 1}`).attr("href", ref[k].textContent))
            seccionRutaReferencias.append(parrrafoReferencia);
        }

    }

    añadirHitos(hitos, seccionHitos) {
        seccionHitos.append($("<h5>").text("Hitos"))
        var hitosArray = hitos.querySelectorAll("hito");
        for (let j = 0; j < hitosArray.length; j++) {
            let seccionHito = $("<section>");
            var hito = hitosArray[j];
            let nombre = hito.getAttribute("nombre")
            let descripcion = hito.getAttribute("descripcion")
            var coordenadas = hito.querySelector("coordenadas");
            let latitud = coordenadas.querySelector("latitud").textContent;
            let longitud = coordenadas.querySelector("longitud").textContent;
            var alt = coordenadas.querySelector("altitud")
            let altitud = alt.textContent + " " + alt.getAttribute("unidades");
            var dist = hito.querySelector("distancia")
            let distancia = dist.textContent + " " + dist.getAttribute("unidades");
            let fotos = hito.querySelector("galeria_fotos")

            seccionHito.append($("<h6>").text(`Hito ${j + 1} - ${nombre}`))
            seccionHito.append($("<p>").text(`Descripcion: ${descripcion}`))
            if (j == 0) {
                seccionHito.append($("<p>").text(`Distancia desde el Inicio: ${distancia}`))
            }
            else {
                seccionHito.append($("<p>").text(`Distancia desde el Hito anterior: ${distancia}`))
            }
            var seccionCoordenadas = $("<section>")
            var headerCoords = $("<header>")
            headerCoords.append($("<p>").text(`Coordenadas`))
            seccionCoordenadas.append(headerCoords);
            seccionCoordenadas.append($("<p>").text(`Latitud: ${latitud}`));
            seccionCoordenadas.append($("<p>").text(`Longitud: ${longitud}`));
            seccionCoordenadas.append($("<p>").text(`Altitud: ${altitud}`));
            seccionCoordenadas.appendTo(seccionHito);
            var seccionGaleria = $("<section>")
            var headerGal = $("<header>")
            headerGal.append($("<p>").text(`Galería`))
            seccionGaleria.append(headerGal);

            if (fotos != null) {
                this.añadirFotos(fotos, seccionGaleria);
            }
            let videos = hito.querySelector("galeria_videos")
            if (videos != null) {
                this.añadirVideos(videos, seccionGaleria);
            }
            seccionGaleria.appendTo(seccionHito);
            seccionHito.appendTo(seccionHitos);
        }
    }

    añadirFotos(fotos, seccionHitos) {
        var fotosArray = fotos.querySelectorAll("fotografia")
        for (let p = 0; p < fotosArray.length; p++) {
            let photoURL = `multimedia/img/rutas/${fotosArray[p].textContent.trim()}.jpg`
            seccionHitos.append($("<img>").attr("alt", fotosArray[p].textContent).attr("src", photoURL))
        }
    }

    añadirVideos(videos, seccionHitos) {
        var videosArray = videos.querySelectorAll("video")
        for (let p = 0; p < videosArray.length; p++) {
            let videoURL = `multimedia/video/rutas/${videosArray[p].textContent.trim()}.mp4`
            seccionHitos.append($("<video>").attr("preload", "auto").attr("src", videoURL).attr("controls", ""))
        }
    }



    // Usé duration como el tipo par la duracion de la ruta en mi XML
    // No encontré una forma sencilla de obtener una representacion, de modo que lo hice de esta manera
    getDuracion(duracion) {
        let expresion = /P(\d+D)?T?(\d+H)?(\d+M)?(\d+S)?/;
        let resultadoExpresion = duracion.match(expresion);
        let dias = parseInt(resultadoExpresion[1]) || "";
        let horas = parseInt(resultadoExpresion[2]) || "";
        let minutos = parseInt(resultadoExpresion[3]) || "";
        let segundos = parseInt(resultadoExpresion[4]) || "";
        let result = ""
        if (!(dias == ""))
            result += `${dias} días `
        if (!(horas == ""))
            result += `${horas} horas `
        if (!(minutos == ""))
            result += `${minutos} minutos `
        if (!(segundos == ""))
            result += `${segundos} segundos `

        return result;
    }

    leerKMLs(files) {
        $("section[data-type=MapasKML] section").empty();
        for (let i = 0; i < files.length; i++) {
            var article = $("<article>").attr("id", `mapaKML${i + 1}`)
            var paragraph = $("<h4>").text(`Ruta ${i + 1}`)
            paragraph.appendTo($("section[data-type=MapasKML] section"));
            article.appendTo($("section[data-type=MapasKML] section"))
            var archivo = files[i];
            var viaje = this;
            var lector = new FileReader();
            var tipoTexto = /\.kml$/;
            if (tipoTexto.test(archivo.name)) {
                lector.onload = function (evento) {
                    let kmlText = evento.target.result
                    var coords = viaje.getCoordinates(kmlText);

                    var map = new mapboxgl.Map({
                        container: `mapaKML${i + 1}`,
                        style: 'mapbox://styles/mapbox/streets-v11',
                        center: coords[1],
                        zoom: 13
                    });

                    map.on('load', function () {
                        map.addSource('route', {
                            type: 'geojson',
                            'data': {
                                'type': 'Feature',
                                'properties': {},
                                'geometry': {
                                    'type': 'LineString',
                                    'coordinates': coords

                                }
                            }
                        });


                        map.addLayer({
                            id: 'route',
                            type: 'line',
                            source: 'route',
                            layout: {
                                'line-join': 'round',
                                'line-cap': 'round'
                            },
                            paint: {
                                'line-color': '#FF0000',
                                'line-width': 4
                            }
                        });
                    });
                }
                lector.readAsText(files[i]);
            }
        }
    }

    getCoordinates(text) {
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(text, "text/xml");
        var coordinates = xmlDoc.querySelector('coordinates').textContent.split("\n");
        var newCoords = coordinates.filter(function (element) {
            return element != '';
        });
        var finalCoords = [];
        newCoords.forEach(coord => {
            let theCoord = [];
            theCoord[0] = coord.split(",")[0]
            theCoord[1] = coord.split(",")[1]
            finalCoords.push(theCoord);
        })

        return finalCoords;
    }


    leerSVGs(files) {
        $("section[data-type=SVG] section").empty();
        for (let i = 0; i < files.length; i++) {
            var archivo = files[i];
            var lector = new FileReader();
            var tipoTexto = /\.svg$/;
            if (tipoTexto.test(archivo.name)) {
                lector.onload = function (evento) {
                    let svgText = evento.target.result
                    svgText = svgText.split("?>")[1]
                    var paragraph = $("<h4>").text(`Perfil ${i + 1}`)
                    paragraph.appendTo($("section[data-type=SVG] section"));
                    $("section[data-type=SVG] section").append(svgText)
                }
                lector.readAsText(files[i]);
            }
        }
    }



}