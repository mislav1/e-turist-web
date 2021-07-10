const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../../index')
const { USER_AUTH_TOKEN } = process.env
chai.should()

chai.use(chaiHttp);

describe('User Cities API', () => {

    /*
    * Test GET CITIES
    */

    describe("GET /api/user/cities", () => {
        it('It should return all cities', (done) => {
            chai.request(server)
                .get("/api/user/cities")
                .set("user-token", USER_AUTH_TOKEN)
                .end((err, response) => {
                    response.should.have.status(200)
                    response.body.should.be.a('object')
                    response.body.data.cities.should.be.a('array')
                    done()
                })
        })

        it('It should fail without auth', (done) => {
            chai.request(server)
                .get("/api/user/cities")
                .end((err, response) => {
                    response.body.should.have.status(401)
                    done()
                })
        })
    })
})