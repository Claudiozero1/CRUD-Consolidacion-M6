process.env.FILE = 'anime.test.json';
const chai = require('chai');
const chaiHttp = require('chai-http')

const { app } = require('../index');
const { text } = require('express');

chai.use(chaiHttp)

let idAnime;

describe("POST /agregar", () => {
    it("Add element", (done) => {
        chai.request(app)
            .post("/agregar")
            .send({
                nombre: "Slam Dunk",
                genero: "Spokon",
                año: 1993,
                autor: "Takehiko Inoue",
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(201);
                chai.expect(res.text).to.include('Anime agregado');
                idAnime = res.body.id
            });
        done()
    });
});


describe('GET /', () => {
    it('Get all animes', (done) => {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                chai.expect(res).to.have.status(200)
                done();
            });
    });
    it('Respond object', (done) => {
        chai.request(app)
            .get('/')
            .end((err, res) => {
                chai.expect(res).to.be.a('object');
                done();
            })
    });
})


describe("DELETE /eliminar/:id", () => {
    it("Should respond 404", (done) => {
        chai.request(app)
            .delete("/eliminar/asdfsdaf")
            .end((err, res) => {
                chai.expect(res).to.have.status(404);
                done();
            });
    });
    it("Delete anime", (done) => {
        chai.request(app)
            .delete(`/eliminar/${idAnime}`)
            .end((err, res) => {
                chai.expect(res).to.have.status(200);
                done();
            });
    });
});