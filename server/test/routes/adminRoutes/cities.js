const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../../index')
const {getRandomString} = require("../../../lib/utils")
const { ADMIN_AUTH_TOKEN } = process.env
chai.should()

chai.use(chaiHttp);

describe('Admin Cities API', () => {

    /*
    * Test UPDATE CITIES
    */

    describe("PUT /api/admin/cities/update-by-id", () => {
        it('It should update the name of a city', (done) => {
            chai.request(server)
                .put("/api/admin/cities/update-by-id")
                .set("token", ADMIN_AUTH_TOKEN)
                .send({id: 1, name: "Zagreb"})
                .end(async (err, response) => {
                    response.body.should.have.status(200)
                    response.body.should.be.a('object')
                    response.body.data.should.be.a('object')  
                    done()
                })
        })

        it('It should return missing params without id', (done) => {
            chai.request(server)
                .put("/api/admin/cities/update-by-id")
                .set("token", ADMIN_AUTH_TOKEN)
                .end(async (err, response) => {
                    response.body.should.have.status(400)
                    done()
                })
        })

    })

    /*
    * Test ADD NEW City
    */

    describe("POST /api/admin/cities/add-new", () => {

        it('It should return missing parameters without name', (done) => {
            chai.request(server)
                .post("/api/admin/cities/add-new")
                .set("token", ADMIN_AUTH_TOKEN)
                .send({identifier:getRandomString()})
                .end(async (err, response) => {
                    response.body.should.have.status(400)
                    response.body.error.should.be.eq('Pogrešni parametri!')
                    done()
                })
        })

    })
})