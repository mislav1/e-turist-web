const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../../index')
const {getRandomString} = require("../../../lib/utils")
const { ADMIN_AUTH_TOKEN } = process.env
chai.should()

chai.use(chaiHttp);

describe('Admin Cities API', () => {

    /*
    * Test ADMIN login
    */

    describe("POST /api/admin/authentication/login", () => {
        it('It should login admin', (done) => {
            chai.request(server)
                .post("/api/admin/authentication/login")
                .send({username:"testAdmin", password: "12345$"})
                .end((err, response) => {
                    response.body.should.have.status(200)
                    response.body.should.be.a('object')
                    response.body.data.should.be.a('object')  
                    response.body.data.should.have.property('token')
                    response.body.data.token.length.should.be.eq(32)
                    done()
                })
        })

        it('It should fail without right parameters', (done) => {
            chai.request(server)
                .post("/api/admin/authentication/login")
                .send({password: "12345$"})
                .end((err, response) => {
                    response.body.should.have.status(400)
                    done()
                })
        })

        it('It should fail with wrong password ', (done) => {
            chai.request(server)
                .post("/api/admin/authentication/login")
                .send({username:"testAdmin", password: "12345s$"})
                .end((err, response) => {
                    response.body.should.have.status(404)
                    done()
                })
        })
    })


    describe("POST /api/admin/authentication/logout", () => {
        it('It must have access token', (done) => {
            chai.request(server)
                .post("/api/admin/authentication/logout")
                .end((err, response) => {
                    response.body.should.have.status(401)
                    done()
                })
        })
    })
})