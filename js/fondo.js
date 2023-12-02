class Fondo {

    constructor(nombreP, capital, latitud, longitud) {
        this.nombrePais = nombreP;
        this.capital = capital;
        this.latitud = latitud;
        this.longitud = longitud;
    }

    getBackgroundImage() {
        const apiKey = '67eded22ea4bc804781a1f8570d6e519';
        const latitude = this.latitud;
        const longitude = this.longitud;
        const imageSize = 'url_o';
        const imgNumber = 50;
        const flickrAPI = `https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${apiKey}&lat=${latitude}&lon=${longitude}&extras=${imageSize}&per_page=${imgNumber}&format=json&nojsoncallback=1`;

        $.getJSON(flickrAPI)
            .done(function (data) {
                const min = 0;
                const max = imgNumber;
                const randomImage = Math.floor(min + Math.random() * (max - min));
                var img = data.photos.photo[randomImage];
                var imgurl = img[imageSize];
                imgurl = "url(" + imgurl + ")";
                $('body').css("background-image", imgurl).css("background-size", "cover");
            });
    }

}

