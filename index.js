const fs = require('fs/promises')
const express = require('express');
const hbs = require('hbs');
const { randomUUID } = require('crypto')
const { fileToJSON } = require('./utilities/read');
const { saveFile } = require('./utilities/write');
const path = require('path')

const file = process.env.FILE || 'anime.json'

//instance express
const app = express();
const port = 8000;

//middleware
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}))

// config HBS
hbs.registerPartials(`${__dirname}/views/partials`, function (err) { });
app.set('view engine', 'hbs');
app.set('views', `${__dirname}/views`)

//Static files
app.use(express.static(path.join(`${__dirname}/public`)));

//Routes
//All elements
app.get('/', async (req, res) => {
    const anime = await fileToJSON(file)

    res.render('index', {
        titulo: 'Animes',
        anime: anime,
        layout: 'main',
    });
});

//One element
app.get('/ver/:id', async (req, res) => {
    const { id } = req.params
    const animes = await fileToJSON(file);

    res.render('anime', {
        titulo: animes[id].nombre,
        anime: { ...animes[id], id },
        found: animes[id] ? true : false,
        layout: 'main',
    });
});

//Delete element
app.delete('/eliminar/:id', async (req, res) => {
    const { id } = req.params
    const anime = await fileToJSON(file);
    delete anime[id]
    await saveFile(file, anime)
    res.status(200).json({
        msg: `Anime con id ${id} eliminado`,
        result: anime[id],
    });
});

//Add element
app.post('/agregar', async (req, res) => {
    const anime = req.body;
    const animesJSON = await fileToJSON(file)
    const id = randomUUID();
    animesJSON[id] = { ...anime }
    await saveFile(file, animesJSON)
    res.status(201).json({
        msg: "Anime agregado",
        id,
    });
})

app.get('/agregar', async (req, res) => {
    res.render('addAnime', {
        layout: 'main',
    })
});

app.get('/edit/:id', async (req, res) => {
    const { id } = req.params
    const animes = await fileToJSON(file);

    res.render('editAnime', {
        titulo: animes[id].nombre,
        anime: { ...animes[id], id },
        layout: 'main'
    })
})

app.put('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const animeEdit = req.body;
    const anime = await fileToJSON(file)
    const newAnime = { ...anime[id], ...animeEdit }
    delete anime[id]
    anime[id] = newAnime
    await saveFile(file, anime)
    res.status(200).json({
        msg: `anime con id ${id} editado`,
    });
})

//Server on
app.listen(port, () => {
    console.log(`Servidor ejecutandose en el puerto ${port}`);
});

module.exports = { app };