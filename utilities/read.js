const fs = require('fs/promises');

const leerArchivo = async (nombreArchivo) => {
    const resultado = await fs.readFile(nombreArchivo, 'utf-8');
    return resultado;
}

const JsonParse = (string) => {
    return JSON.parse(string)
}

const fileToJSON = async (fileName) => {
    const contentString = await leerArchivo(fileName)
    const jsonContent = JsonParse(contentString)
    return jsonContent;
}

module.exports = {
    fileToJSON,
}