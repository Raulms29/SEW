class Memoria {
    elements =
        [
            {
                "element": "HTML5",
                "source": "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg"
            },
            {
                "element": "CSS3",
                "source": "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg"
            },
            {
                "element": "JS",
                "source": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg"
            },
            {
                "element": "PHP",
                "source": "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg"
            },
            {
                "element": "SVG",
                "source": "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg"
            },
            {
                "element": "W3C",
                "source": "https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg"
            },
            {
                "element": "HTML5",
                "source": "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg"
            },
            {
                "element": "CSS3",
                "source": "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg"
            },
            {
                "element": "JS",
                "source": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg"
            },
            {
                "element": "PHP",
                "source": "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg"
            },
            {
                "element": "SVG",
                "source": "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg"
            },
            {
                "element": "W3C",
                "source": "https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg"
            },
        ]

    constructor() {
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
        this.shuffleElements();
        this.createElements();
        this.addEventListeners();
    }

    shuffleElements() {
        var array = this.elements
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    unflipCards() {
        this.lockBoard = true;
        var second = this.secondCard;
        var first = this.firstCard;
        setTimeout(() => {
            second.classList.remove('flip');
            first.classList.remove('flip');
        }, 1000);
        setTimeout(() => {
            this.resetBoard();
        }, 1250);
    }

    resetBoard() {
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
    }

    disableCards() {
        this.firstCard.setAttribute("data-state", "revealed")
        this.secondCard.setAttribute("data-state", "revealed")
        this.resetBoard();
    }

    checkForMatch() {
        if (this.firstCard.getAttribute("data-element") == this.secondCard.getAttribute("data-element")) {
            this.disableCards();
        }
        else {
            this.unflipCards();
        }
    }

    createElements() {
        var section = document.querySelector("section")
        for (let i = 0; i < this.elements.length; i++) {
            var newArticle = document.createElement("article");
            var h3 = document.createElement("h3");
            var imagen = document.createElement("img");
            newArticle.setAttribute("data-element", this.elements[i].element);
            newArticle.setAttribute("data-state", "unflipped")

            imagen.setAttribute("src", this.elements[i].source);
            imagen.setAttribute("alt", this.elements[i].element);


            h3.appendChild(document.createTextNode("Memory Card"));

            newArticle.appendChild(h3);

            newArticle.appendChild(imagen);

            section.appendChild(newArticle);
        }
    }

    flipCard(game) {
        if (this.getAttribute("data-state") == "revealed")
            return;
        if (game.lockBoard)
            return;
        if (this == game.firstCard)
            return
        this.setAttribute("data-state", "flip")
        this.classList.add('flip');
        console.log("Flip");
        if (!game.hasFlippedCard) {
            game.hasFlippedCard = true
            game.firstCard = this;
        }
        else {
            game.secondCard = this;
            game.checkForMatch();
        }
    }

    addEventListeners() {
        var cards = document.querySelectorAll("article")
        for (let i = 0; i < cards.length; i++) {
            cards[i].addEventListener("click", this.flipCard.bind(cards[i], this))
        }
    }
}
