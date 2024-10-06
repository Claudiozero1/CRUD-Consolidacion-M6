const fs = require('fs/promises');

const escribirArchivo = async (nombreArchivo, contenido) => {
    await fs.writeFile(nombreArchivo, contenido, 'utf-8');
    return
}

const jsonToString = (obj) => {
    return JSON.stringify(obj, null, 2)
}

const saveFile = async (fileName, contenido) => {
    const stringContent = jsonToString(contenido)
    escribirArchivo(fileName, stringContent);
    return;
}

module.exports = {
    saveFile
}