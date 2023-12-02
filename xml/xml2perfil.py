import xml.etree.ElementTree as ET

def prologoSVG(archivo):
    """ Escribe en el archivo de salida el prólogo del archivo SVG"""

    archivo.write('<?xml version="1.0" encoding="UTF-8" ?>\n')
    archivo.write('<svg xmlns="http://www.w3.org/2000/svg" version="2.0">\n')
    archivo.write("<polyline points=\"")

def epilogoSVG(archivo):
    """ Escribe en el archivo de salida el epílogo del archivo SVG"""
    archivo.write("</svg> \n")
def convertValues(distancias,alturas):
    ancho = 220.0
    alto = 250.0
    nuevasDistancias = []
    nuevasAlturas = []
    for i in range(len(alturas)):
          alturas[i]=(1.0/alturas[i])
    distanciaBase = 20.0
    for i in range(len(distancias)):
          nuevasDistancias.append((distancias[i]-min(distancias)) * ((ancho-0)/(max(distancias)-min(distancias))) + distanciaBase)
          nuevasAlturas.append((alturas[i]-min(alturas)) * ((alto-0)/(max(alturas)-min(alturas))) + 10)
          distanciaBase+=nuevasDistancias[i]
    
    return nuevasDistancias,nuevasAlturas
     
def contenidoSVG(archivo,distancias,alturas,nombresHitos):
    distancias,alturas =  convertValues(distancias,alturas)
    for i in range(len(distancias)):
            archivo.write(str(distancias[i]))
            archivo.write("," + str(alturas[i]) + "\n")
    archivo.write(str(distancias[-1]))
    archivo.write("," + str(max(alturas))+ "\n")
    archivo.write((str(distancias[0])))
    archivo.write("," + str(max(alturas))+ "\n")
    archivo.write((str(distancias[0])))
    archivo.write("," + str(alturas[0])+ "\n")

    archivo.write("\"\n")
    archivo.write("style=\"fill:white;stroke:red;stroke-width:4\" />\n")
    for i in range(len(distancias)):
            archivo.write("<text x = \"")
            archivo.write(str(distancias[i]+10))
            archivo.write("\" y=\"")
            archivo.write(str(max(alturas) + 20) + "\n")
            archivo.write("\" style=\"writing-mode: tb; glyph-orientation-vertical: 0;\">")
            archivo.write(nombresHitos[i])
            archivo.write("</text>\n")

def main():
    # nombreSvg = input("Introduzca el nombre del archivo xml    = ")
    nombreSvg = "rutasEsquema.xml"
    try:
        
        arbol = ET.parse(nombreSvg)
        
    except IOError:
        print ('No se encuentra el archivo ', nombreSvg)
        exit()
        
    except ET.ParseError:
        print("Error procesando en el archivo SVG = ", nombreSvg)
        exit()
    
    nombreSalida  = input("Introduzca el nombre del archivo generado (*.svg) = ")

    try:
        salida = open(nombreSalida + ".svg",'w')
    except IOError:
        print ('No se puede crear el archivo ', nombreSalida + ".svg")
        exit()

    # Procesamiento y generación del archivo svg

    # Escribe la cabecera del archivo de salida
    prologoSVG(salida)

    numeroRuta = int(input("Introduce el numero de ruta: "))
    expresionDistancia = ".//{http://www.uniovi.es}ruta[" + str(numeroRuta)+ "]//{http://www.uniovi.es}distancia"
    expresionAltura =".//{http://www.uniovi.es}ruta[" + str(numeroRuta)+ "]//{http://www.uniovi.es}altitud"
    expresionNombresHitos =".//{http://www.uniovi.es}ruta[" + str(numeroRuta)+ "]//{http://www.uniovi.es}hito"
   
    raiz = arbol.getroot()
    distancias = []
    alturas = []
    nombresHitos = []
    startDistance = 0.5

    distancias.append(startDistance)
    for hijo in raiz.findall(expresionDistancia): # Expresión XPath
            distancias.append(float(hijo.text.strip('\n')))    
    for hijo in raiz.findall(expresionAltura): # Expresión XPath
            alturas.append(float(hijo.text.strip('\n'))) 
    nombresHitos.append("Inicio")
    for hijo in raiz.findall(expresionNombresHitos): # Expresión XPath
            nombresHitos.append(hijo.attrib.get("nombre"))   
    
    contenidoSVG(salida,distancias,alturas,nombresHitos)

    epilogoSVG(salida)
    salida.close()




if __name__ == "__main__":
    main()
    