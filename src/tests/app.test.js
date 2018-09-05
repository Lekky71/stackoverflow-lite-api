/* eslint-disable no-undef */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { expect } = 'chai';
chai.use(chaiHttp);
const apiVersion = '/api/v1';
const qstPath = '/api/v1/questions';

const user = Math.random().toString(36).substring(2, 5)
  + Math.random().toString(36).substring(2, 7);
const email = Math.random().toString(36).substring(2, 5)
  + Math.random().toString(36).substring(2, 7);
let accessToken = '';
let questionId = '';
let answerId = '';
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

  it('should create a new question', () => {
    chai.request(app)
      .post(`${qstPath}/`)
      .set('x-access-token', accessToken)
      .send({
        category: user,
        title: 'How to install android studio?',
        content: 'How do I install android studio on my windows 10 ?',
      })
      .end((err, res) => {
        expect(res).to.have.status('success');
        expect(res).to.have.property('question');
        expect(res).to.have.property('token');
        accessToken = res.token;
        questionId = res.question.question_id;
      });
  });

  it('should return a question using its id', () => {
    chai.request(app)
      .get(`${qstPath}/${questionId}`)
      .set('x-access-token', accessToken)
      .end((err, res) => {
        expect(res).to.have.status('success');
        expect(res).to.have.property('question');
        expect(res).to.have.property('token');
        accessToken = res.token;
      });
  });

  it('should return all questions', () => {
    chai.request(app)
      .get(`${qstPath}/`)
      .set('x-access-token', accessToken)
      .end((err, res) => {
        expect(res).to.have.status('success');
        expect(res).to.have.property('questions');
        expect(res).to.have.property('token');
        accessToken = res.token;
      });
  });

  it('should return all the questions a user has asked', () => {
    chai.request(app)
      .get(`${qstPath}/my-questions`)
      .set('x-access-token', accessToken)
      .end((err, res) => {
        expect(res).to.have.status('success');
        expect(res).to.have.property('questions');
        expect(res).to.have.property('token');
        accessToken = res.token;
      });
  });

  it('should return search for questions using a query', () => {
    chai.request(app)
      .get(`${qstPath}/search?query=install`)
      .set('x-access-token', accessToken)
      .end((err, res) => {
        expect(res).to.have.status('success');
        expect(res).to.have.property('questions');
        expect(res).to.have.property('token');
        accessToken = res.token;
      });
  });

  it('should add an answer to a question', () => {
    chai.request(app)
      .post(`${qstPath}/${questionId}/answer`)
      .set('x-access-token', accessToken)
      .send({
        content: `It is very easy to install android studio, just google search, you would see the link,
        download for your Operating System's version, follow the installation steps on the site`,
      })
      .end((err, res) => {
        expect(res).to.have.property('status');
        expect(res).to.have.property('answer');
        expect(res).to.have.property('token');
        accessToken = res.token;
        answerId = res.answer.answer_id;
        questionId = res.answer.question_id;
      });
  });

  it('should mark an answer as the preferred', () => {
    chai.request(app)
      .put(`${qstPath}/${questionId}/answers/${answerId}/mark`)
      .set('x-access-token', accessToken)
      .end((err, res) => {
        expect(res).to.have.property('status');
        expect(res).to.have.property('question');
        expect(res).to.have.property('token');
        accessToken = res.token;
      });
  });

  it('should up vote an answer', () => {
    chai.request(app)
      .put(`${qstPath}/${questionId}/answers/${answerId}/vote`)
      .set('x-access-token', accessToken)
      .send({ vote: 'up' })
      .end((err, res) => {
        expect(res).to.have.property('status');
        expect(res).to.have.property('answer');
        expect(res).to.have.property('token');
        accessToken = res.token;
      });
  });

  it('should down vote an answer', () => {
    chai.request(app)
      .put(`${qstPath}/${questionId}/answers/${answerId}/vote`)
      .set('x-access-token', accessToken)
      .send({ vote: 'down' })
      .end((err, res) => {
        expect(res).to.have.property('status');
        expect(res).to.have.property('answer');
        expect(res).to.have.property('token');
        accessToken = res.token;
      });
  });
});
