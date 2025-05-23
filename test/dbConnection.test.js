const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('dbConnection', function() {
  let mongooseMock, dbConnection;

  beforeEach(function() {
    mongooseMock = {
      connect: sinon.stub().resolves(),
      connection: { close: sinon.stub().resolves() }
    };
    dbConnection = proxyquire('../src/services/dbConnection', {
      mongoose: mongooseMock
    });
  });

  afterEach(function() {
    sinon.restore();
  });

  it('should connect to MongoDB successfully', async function() {
    await dbConnection.connectDB();
    sinon.assert.calledOnce(mongooseMock.connect);
    sinon.assert.calledWith(mongooseMock.connect, 'mongodb://localhost:27017/bookingsystem');
  });

  it('should close the MongoDB connection', async function() {
    await dbConnection.closeConnection();
    sinon.assert.calledOnce(mongooseMock.connection.close);
  });

  it('should exit process on connection error', async function() {
    // Arrange
    const error = new Error('Connection failed');
    mongooseMock.connect.rejects(error);
    const exitStub = sinon.stub(process, 'exit');
    const logStub = sinon.stub(console, 'error');
    // Act
    await dbConnection.connectDB();
    // Assert
    sinon.assert.calledOnce(logStub);
    sinon.assert.calledOnce(exitStub);
    exitStub.restore();
    logStub.restore();
  });
});
