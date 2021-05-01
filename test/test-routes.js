import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

import { expect } from 'chai';

chai.use(chaiHttp);

describe('Test Routes', () => {
  describe('Default Route', () => {
    // prettier-ignore
    chai.request(app).get('/').then(res => {
      expect(res).should.have.status(200);
      expect(res).should.be.json;
    }).catch(err => {throw err});
  });
});
