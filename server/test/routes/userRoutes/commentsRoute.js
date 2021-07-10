const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../../index')
const { USER_AUTH_TOKEN } = process.env
chai.should()

chai.use(chaiHttp);

describe('User Comments API', () => {

    /*
    * Test GET Comments
    */

    describe("GET /api/user/comments", () => {
        it('It should return all comments', (done) => {
            chai.request(server)
                .get("/api/user/comments")
                .set("user-token", USER_AUTH_TOKEN)
                .query({routeId: 1})
                .end((err, response) => {
                    response.should.have.status(200)
                    response.body.should.be.a('object')
                    response.body.data.comments.should.be.a('array')
                    done()
                })
        })

        it('It should fail without auth', (done) => {
            chai.request(server)
                .get("/api/user/comments")
                .end((err, response) => {
                    response.body.should.have.status(401)
                    done()
                })
        })

        it('It should fail without query param', (done) => {
            chai.request(server)
                .get("/api/user/comments")
                .set("user-token", USER_AUTH_TOKEN)
                .end((err, response) => {
                    response.body.should.have.status(400)
                    done()
                })
        })
    })
})