const request = require('supertest');
const auth = require('../authController')
const User = require('../models/User')

const URL= 'https://sktst-rental.onrender.com';
describe('GET / (Main page test)', () => {
    it('open main page', (done) => {
        request(URL)
            .get('/')
            .expect(200, done)
    });
});
describe('Login test', () => {
    it('login failure', (done) => {
        request(URL)
            .post("/login")
            .expect(400, done);
    })
    it('login success', (done) => {
        request(URL)
            .post("/login")
            .send({
                username: "ADMIN",
                password: "ADMIN"
            })
            .expect(200, done)
    })
});
describe('Registration test', () => {
    // after(async (done) => {
    //
    // });
    it('regis failure', (done) => {
        request(URL)
            .post("/registration")
            .expect(400, done);
    });

    it('regis with exist username', (done) => {
        request(URL)
            .post("/registration")
            .send({
                username: "ADMIN",
                password: "ADMIN"
            })
            .expect(400)
            .expect({message: "User with this username already exist"}, done);
    });

    // it('regis success', async (done) => {
    //     request(URL)
    //         .post("/registration")
    //         .timeout(5000)
    //         .send({
    //             username: "user123456789",
    //             email: "asdasdasd@asd.com",
    //             name: "Damur",
    //             password: "1234"
    //         })
    //         .expect(200)
    //         .expect({message: "User successfully added"});
    //     await User({username: 'user123456789'})
    //     done();
    // });
});

describe('Equip test', () => {
    it('get equip info with valid id', (done) => {
        request(URL)
            .get("/equip/65b68c89055cd69b070f0644")
            .expect(200, done)
    })
    it('get equip info without valid id', (done) => {
        request(URL)
            .get("/equip/not_valid")
            .expect(404, done)
    })
})
describe('ADMIN access test', () => {
    it('/add-equip without admin access', (done) => {
        request(URL)
            .get("/add-equip")
            .expect(403, done)
    });
    it('/add-category without admin access', (done) => {
        request(URL)
            .get("/add-category")
            .expect(403, done)
    });

})
