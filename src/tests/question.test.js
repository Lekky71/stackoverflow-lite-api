/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const {expect} = 'chai';
chai.use(chaiHttp);
const apiVersion = '/api/v1';

const user = Math.random().toString(36).substring(2, 5)
  + Math.random().toString(36).substring(2, 7);
const email = Math.random().toString(36).substring(2, 5)
  + Math.random().toString(36).substring(2, 7);
let accessToken = '';
const pass = 'lekeleke';

describe('Testing endpoints', () => {
  it('should create new user', () => {
    chai.request(app)
      .post(`${apiVersion}/auth/signup`)
      .send({
        username: user,
        password: pass,
        email: `${email}@gmail.com`,
        first_name: 'Oluwaleke',
        last_name: 'Fakorede',
      })
      .end((err, res) => {
        expect(res).to.have.status('success');
        expect(res).to.have.property('user');
        expect(res).to.have.property('token');
        accessToken = res.token;
      });
  });

  it('should return signup error', () => {
    chai.request(app)
      .post(`${apiVersion}/auth/signup`)
      .send({
        username: user,
        password: pass,
        email: `${email}@gmail.com`,
        first_name: 'Oluwaleke',
        last_name: 'Fakorede',
      })
      .end((err, res) => {
        expect(res).to.have.status('failure');
        expect(res).to.have.property('error');
      });
  });

  it('should log in the user', () => {
    chai.request(app)
      .post(`${apiVersion}/auth/login`)
      .send({
        username: user,
        password: pass,
      })
      .end((err, res) => {
        expect(res).to.have.status('success');
        expect(res).to.have.property('user');
        expect(res).to.have.property('token');
        accessToken = res.token;
      });
  });

  it('should return login error', () => {
    chai.request(app)
      .post(`${apiVersion}/auth/login`)
      .send({
        username: user,
        password: 'wrong_password',
      })
      .end((err, res) => {
        expect(res).to.have.status('failure');
        expect(res).to.have.property('error');
      });
  });

});
