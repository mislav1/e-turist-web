const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../../index')
const { ADMIN_AUTH_TOKEN } = process.env
chai.should()

chai.use(chaiHttp);

describe('Admin Destinations API', () => {

    /*
    * Test GET DESTINATIONS
    */

    describe("GET /api/admin/destinations", () => {
        it('It should return first 5 destinations', (done) => {
            chai.request(server)
                .get("/api/admin/destinations")
                .set("token", ADMIN_AUTH_TOKEN)
                .end(async (err, response) => {
                    response.should.have.status(200)
                    response.body.should.be.a('object')
                    response.body.data.destinations.should.be.a('array')
                    response.body.data.should.have.property('allDestinationsCount')
                    done()
                })
        })

        it('It should fail without auth', (done) => {
            chai.request(server)
                .get("/api/admin/destinations")
                .end((err, response) => {
                    response.body.should.have.status(401)
                    done()
                })
        })
    })

    describe("GET /api/admin/destinations/load-by-id", () => {
        it('It should return destination by id', (done) => {
            chai.request(server)
                .get("/api/admin/destinations/load-by-id")
                .query({ id: 1 })
                .set("token", ADMIN_AUTH_TOKEN)
                .end((err, response) => {
                    response.should.have.status(200)
                    response.body.should.be.a('object')
                    response.body.data.should.have.property('destination')
                    response.body.data.destination.id.should.be.eq(1)
                    done()
                })
        })

        it('It should return missing parameters without id in query', (done) => {
            chai.request(server)
                .get("/api/admin/destinations/load-by-id")
                .set("token", ADMIN_AUTH_TOKEN)
                .end((err, response) => {
                    response.body.should.have.status(400)
                    response.body.error.should.be.eq('Pogrešni parametri!')
                    done()
                })
        })
    })
})