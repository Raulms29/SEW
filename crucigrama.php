<!DOCTYPE HTML>
<html lang="es">

<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <meta name="author" content="Raúl Mera Soto" />
    <title>Escritorio Virtual-Juegos-Crucigrama Matemático</title>
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="estilo/crucigrama.css" />
    <link rel="stylesheet" type="text/css" href="estilo/estilo_botonera.css" />
    <link rel="stylesheet" type="text/css" href="estilo/juegos.css" />
    <meta name="description" content="documento para utilizar en otros módulos de la asignatura" />
    <meta name="keywords" content="juegos" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="multimedia/img/favicon.ico">
    <script src="https://code.jquery.com/jquery-3.7.1.min.js" integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    <script src="js/crucigrama.js"></script>
</head>

<body>
    <!-- Datos con el contenido que aparece en el navegador -->
    <header>
        <h1>Escritorio Virtual</h1>
        <nav>
            <a accesskey="I" href="index.html" tabindex=1>Inicio</a>
            <a accesskey="S" href="sobremi.html" tabindex=2>Sobre Mi</a>
            <a accesskey="N" href="noticias.html" tabindex=3>Noticias</a>
            <a accesskey="A" href="agenda.html" tabindex=4>Agenda</a>
            <a accesskey="M" href="meteorologia.html" tabindex=5>Meteorologia</a>
            <a accesskey="V" href="viajes.html" tabindex=6>Viajes</a>
            <a accesskey="J" href="juegos.html" tabindex=7>Juegos</a>
            <a accesskey="T" href="api.html" tabindex=8>Notas</a>
        </nav>
    </header>
    <h2>Juegos</h2>
    <nav>
        <a accesskey="R" href="memoria.html" tabindex=8>Juego de Memoria</a>
        <a accesskey="K" href="sudoku.html" tabindex=9>Sudoku</a>
        <a accesskey="C" href="crucigrama.php" tabindex=10>Crucigrama Matemático</a>
    </nav>

    <script>
        var crucigrama = new Crucigrama();
        window.addEventListener("keydown", (event) => {
            crucigrama.introduceElement(event.key);
        });
    </script>

    <h3>Crucigrama Matemático</h3>

    <section>
        <header>
            <h4>Instrucciones</h4>
        </header>
        <p>Para completar el crucigrama seleccione una casilla haciendo click en ella y luego escriba utilizando el teclado el número que corresponda a dicha casilla.</p>
        <h5>Símbolos</h5>
        <p>Estos son los símbolos usados por el crucigrama matemático para representar operaciones</p>
        <ul>
            <li>Suma: +</li>
            <li>Resta: -</li>
            <li>Multiplicación: *</li>
            <li>División: /</li>
        </ul>
    </section>
    <section>
        <h4>Selección de Dificultad</h4>
        <button onclick="crucigrama.startGame('Fácil')">
            Nivel Fácil
        </button>
        <button onclick="crucigrama.startGame('Medio')">
            Nivel Medio
        </button>
        <button onclick="crucigrama.startGame('Difícil')">
            Nivel Difícil
        </button>
    </section>

    <p name="error">El número u operador introducido en la casilla no es correcto.</p>

    <main>
    </main>

    <section data-type="botonera">
        <h4>Botonera</h4>
        <section>
            <button onclick="crucigrama.introduceElement(1)">1</button>
            <button onclick="crucigrama.introduceElement(2)">2</button>
            <button onclick="crucigrama.introduceElement(3)">3</button>
            <button onclick="crucigrama.introduceElement(4)">4</button>
            <button onclick="crucigrama.introduceElement(5)">5</button>
            <button onclick="crucigrama.introduceElement(6)">6</button>
            <button onclick="crucigrama.introduceElement(7)">7</button>
            <button onclick="crucigrama.introduceElement(8)">8</button>
            <button onclick="crucigrama.introduceElement(9)">9</button>
        </section>
        <section>
            <button onclick="crucigrama.introduceElement('*')">*</button>
            <button onclick="crucigrama.introduceElement('+')">+</button>
            <button onclick="crucigrama.introduceElement('-')">-</button>
            <button onclick="crucigrama.introduceElement('/')">/</button>
        </section>
    </section>
    <?php
    class Record
    {
        private $server;
        private $user;
        private $pass;
        private $dbname;

        private static $RECORD_SIZE = 10;

        private $db;
        public function __construct()
        {
            $this->server = "localhost";
            $this->user = "DBUSER2023";
            $this->pass = "DBPSWD2023";
            $this->dbname = "records";
        }
        public function añadirRecord()
        {
            $name = $_POST["Nombre"];
            $surname = $_POST["Apellidos"];
            $dificulty = $_POST["Dificultad"];
            $time = $_POST["Tiempo"];
            $db = $this->getDB();

            //Comprobar que la entrada no existe en a base de datos
            $query = "SELECT nombre,apellidos,nivel,tiempo from registro  where nombre = ? and apellidos=? and nivel = ? and tiempo = ? ";
            $preparedStatement = $db->prepare($query);
            $preparedStatement->bind_param("sssd", $name, $surname, $dificulty, $time);
            $preparedStatement->execute();
            $result = $preparedStatement->get_result();

            if ($result->num_rows > 0) {
                $this->closeDB(null, $preparedStatement, $result);
                return;
            }

            //Insertar Valores
            $insert = "INSERT INTO registro VALUES(?,?,?,?)";
            $insertPre = $db->prepare($insert);
            $insertPre->bind_param("sssd", $name, $surname, $dificulty, $time);
            $insertPre->execute();

            $this->closeDB($db, $insertPre, null);
        }

        private function closeDB($db, $pre, $res)
        {
            if ($res != null) {
                $res->free();
            }
            if ($pre != null) {
                $pre->close();
            }
            if ($db != null) {
                $db->close();
            }
        }

        private function getDB()
        {
            $db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
            $db->select_db($this->dbname);
            return $db;
        }

        public function mostrarRanking()
        {
            $dificulty = $_POST["Dificultad"];
            $db = $this->getDB();
            $query = "SELECT nombre,apellidos,nivel,tiempo from registro  where nivel = ? ORDER BY tiempo LIMIT ? ";
            $preparedStatement = $db->prepare($query);
            $preparedStatement->bind_param("si", $dificulty, Record::$RECORD_SIZE);
            $preparedStatement->execute();
            $result = $preparedStatement->get_result();
            $result->data_seek(0);

            echo "<section>";
            echo "<h4>Ranking Dificultad " . $dificulty . "</h4>";
            echo "<ol>";
            while ($row = $result->fetch_assoc()) {
                $tiempo = $this->getTime($row["tiempo"]);

                echo "<li>" . $row["nombre"] . " " . $row["apellidos"] . " Tiempo: " . $tiempo . "</li>";
            }
            echo "</ol>";
            echo "</section>";

            $this->closeDB($db, $preparedStatement, $result);
        }

        private function getTime($segundos)
        {
            $segundos = (int)$segundos;
            $minutos = (int)($segundos / 60);
            $horas = (int)($minutos / 60);
            $segundos %= 60;
            $minutos %= 60;

            if ($segundos < 10) {
                $segundos = "0" . $segundos;
            }
            if ($minutos < 10) {
                $minutos = "0" . $minutos;
            }
            if ($horas < 10) {
                $horas = "0" . $horas;
            }

            $tiempo = $horas . ":" . $minutos . ":" . $segundos;
            return $tiempo;
        }
    }

    if (count($_POST) > 0) {
        $rec = new Record();
        if (isset($_POST['boton'])) {
            $rec->añadirRecord();
            $rec->mostrarRanking();
        }
    }

    ?>


</body>

</html>