import xml.etree.ElementTree as ET

def prologoKML(archivo, nombre):
    """ Escribe en el archivo de salida el prólogo del archivo KML"""

    archivo.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    archivo.write('<kml xmlns="http://www.opengis.net/kml/2.2">\n')
    archivo.write("<Document>\n")
    archivo.write("<Placemark>\n")
    archivo.write("<name>"+nombre+"</name>\n")    
    archivo.write("<LineString>\n")
    #la etiqueta <extrude> extiende la línea hasta el suelo 
    archivo.write("<extrude>1</extrude>\n")
    # La etiqueta <tessellate> descompone la línea en porciones pequeñas
    archivo.write("<tessellate>1</tessellate>\n")
    archivo.write("<coordinates>\n")

def epilogoKML(archivo):
    """ Escribe en el archivo de salida el epílogo del archivo KML"""

    archivo.write("</coordinates>\n")
    archivo.write("<altitudeMode>clampToGround</altitudeMode>\n")
    archivo.write("</LineString>\n")
    archivo.write("<Style> id='lineaRoja'>\n") 
    archivo.write("<LineStyle>\n") 
    archivo.write("<color>#ff0000ff</color>\n")
    archivo.write("<width>5</width>\n")
    archivo.write("</LineStyle>\n")
    archivo.write("</Style>\n")
    archivo.write("</Placemark>\n")
    archivo.write("</Document>\n")
    archivo.write("</kml>\n")
 
def addCoordenadas(coordenadas):
    return coordenadas[1] + "," + coordenadas[0] + "," + "0.0"+"\n"

def main():
    # nombreXml = input("Introduzca el nombre del archivo xml    = ")
    nombreXml = "rutasEsquema.xml"
    try:
        
        arbol = ET.parse(nombreXml)
        
    except IOError:
        print ('No se encuentra el archivo ', nombreXml)
        exit()
        
    except ET.ParseError:
        print("Error procesando en el archivo XML = ", nombreXml)
        exit()
    
    nombreSalida  = input("Introduzca el nombre del archivo generado (*.kml) = ")

    try:
        salida = open(nombreSalida + ".kml",'w')
    except IOError:
        print ('No se puede crear el archivo ', nombreSalida + ".kml")
        exit()

    # Procesamiento y generación del archivo kml

    # Escribe la cabecera del archivo de salida
    prologoKML(salida, nombreXml)

    # Lectura de datos de GPS en formato NMEA
    # while True:
    #     linea = archivo.readline()
    #     if not linea: break
    #     salida.write(decodificaNMEAlonlat(linea))

    numeroRuta = int(input("Introduce el numero de ruta: "))
    expresionCoordenadas = ".//{http://www.uniovi.es}ruta[" + str(numeroRuta)+ "]//{http://www.uniovi.es}coordenadas/*"

    raiz = arbol.getroot()
    i=0
    coordenadas = []
    for hijo in raiz.findall(expresionCoordenadas): # Expresión XPath
            coordenadas.append(hijo.text.strip('\n'))    
            i+=1
            if(i==3):
                i=0
                salida.write(addCoordenadas(coordenadas))
                coordenadas=[]

    epilogoKML(salida)
    salida.close()




if __name__ == "__main__":
    main()
    