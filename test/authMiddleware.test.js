const sinon = require('sinon');
const proxyquire = require('proxyquire');
const httpMocks = require('node-mocks-http');

describe('authenticateMiddleware', function() {
  this.timeout(5000);
  let UserMock;
  let authenticateMiddleware;

  beforeEach(function() {
    UserMock = {
      findOne: sinon.stub()
    };
    authenticateMiddleware = proxyquire('../src/middleware/authMiddleware', {
      '../models/User': UserMock
    });
  });

  afterEach(function() {
    sinon.restore();
  });

  it('should call next() if user is authenticated', async () => {
    UserMock.findOne.resolves({ userid: 'user1' });
    const req = httpMocks.createRequest({
      headers: { loginid: 'user1', passkey: 'secret' }
    });
    const res = httpMocks.createResponse();
    const next = sinon.spy();
    await authenticateMiddleware(req, res, next);
    sinon.assert.calledOnce(next);
  });

  it('should return 401 if user is not authenticated', async () => {
    UserMock.findOne.resolves(null);
    const req = httpMocks.createRequest({
      headers: { loginid: 'bad', passkey: 'wrong' }
    });
    const res = httpMocks.createResponse();
    const next = sinon.spy();
    await authenticateMiddleware(req, res, next);
    sinon.assert.notCalled(next);
    const data = res._getJSONData();
    if (data && typeof data === 'object') {
      if (data.message !== 'Unauthorized') {
        throw new Error('Expected Unauthorized message');
      }
    } else {
      throw new Error('No JSON response');
    }
    if (res.statusCode !== 401) {
      throw new Error('Expected status 401');
    }
  });

  it('should call next(err) if findOne throws', async () => {
    const error = new Error('DB error');
    UserMock.findOne.rejects(error);
    const req = httpMocks.createRequest({
      headers: { loginid: 'user1', passkey: 'secret' }
    });
    const res = httpMocks.createResponse();
    const next = sinon.spy();
    await authenticateMiddleware(req, res, next);
    sinon.assert.calledOnce(next);
    sinon.assert.calledWith(next, error);
  });
});
