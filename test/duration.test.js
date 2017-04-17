const path = require('path');
const fs = require('fs');
const expect = require('chai').expect;
const armDuration = require('../index');

const testAmr1 =  path.resolve(__dirname, 'fixture/test1.amr');
const testAmr2 =  path.resolve(__dirname, 'fixture/test2.amr');
const du2 = 6000;
const du1 = 13680;

describe('amr duration test', () => {
  describe('string test', () => {
    it('amr1', (done) => {
      armDuration(testAmr1, (err, duration) => {
        expect(duration).to.be.eql(du1);
        done(err);
      });
    });

    it('amr2', (done) => {
      armDuration(testAmr2, (err, duration) => {
        expect(duration).to.be.eql(du2);
        done(err);
      });
    });

    it('amr1 promise', (done) => {
      armDuration(testAmr1)
        .then((duration) => {
          expect(duration).to.be.eql(du1);
          done();
        })
        .catch(done);
    });
  });

  describe('buffer test', () => {
    const buffer1 = fs.readFileSync(testAmr1);
    const buffer2 = fs.readFileSync(testAmr2);
    it('amr1', (done) => {
      armDuration(buffer1, (err, duration) => {
        expect(duration).to.be.eql(du1);
        done(err);
      });
    });

    it('amr2', (done) => {
      armDuration(buffer2, (err, duration) => {
        expect(duration).to.be.eql(du2);
        done(err);
      });
    });

    it('amr1 promise', (done) => {
      armDuration(buffer1)
        .then((duration) => {
          expect(duration).to.be.eql(du1);
          done();
        })
        .catch(done);
    });

  });

  describe('stream test', () => {
    const stream1 = fs.createReadStream(testAmr1);
    const stream2 = fs.createReadStream(testAmr2);

    it('amr1', (done) => {
      armDuration(stream1, (err, duration) => {
        expect(duration).to.be.eql(du1);
        done(err);
      });
    });

    it('amr2', (done) => {
      armDuration(stream2, (err, duration) => {
        expect(duration).to.be.eql(du2);
        done(err);
      });
    });
  });
});
