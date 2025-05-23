const express = require('express');
const request = require('supertest');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('slotRouter', () => {
  let app;
  let slotController;
  let adminAuthenticateMiddleware;
  let slotRouterFactory;

  beforeEach(() => {
    // Mock controller and middleware before requiring router
    slotController = {
      getAllSlots: sinon.stub().callsFake((req, res) => res.status(200).json([])),
      getSlotById: sinon.stub().callsFake((req, res) => res.status(200).json({})),
      createSlot: sinon.stub().callsFake((req, res) => res.status(201).json({})),
      updateSlot: sinon.stub().callsFake((req, res) => res.status(200).json({})),
      deleteSlot: sinon.stub().callsFake((req, res) => res.status(204).end()),
    };
    adminAuthenticateMiddleware = (req, res, next) => next();
    // Use proxyquire to inject mocks
    slotRouterFactory = proxyquire('../src/routes/slotRouter', {
      '../controllers/slotController': slotController,
      '../middleware/adminMiddleware': adminAuthenticateMiddleware
    });
    app = express();
    app.use(express.json());
    app.use('/slots', slotRouterFactory());
  });

  afterEach(() => {
    sinon.restore();
  });

  it('GET /slots should call getAllSlots', async () => {
    await request(app).get('/slots').expect(200);
    sinon.assert.calledOnce(slotController.getAllSlots);
  });

  it('GET /slots/:id should call getSlotById', async () => {
    await request(app).get('/slots/123').expect(200);
    sinon.assert.calledOnce(slotController.getSlotById);
  });

  it('POST /slots should call createSlot', async () => {
    await request(app).post('/slots').send({}).expect(201);
    sinon.assert.calledOnce(slotController.createSlot);
  });

  it('PUT /slots/:id should call updateSlot', async () => {
    await request(app).put('/slots/123').send({}).expect(200);
    sinon.assert.calledOnce(slotController.updateSlot);
  });

  it('DELETE /slots/:id should call deleteSlot', async () => {
    await request(app).delete('/slots/123').expect(204);
    sinon.assert.calledOnce(slotController.deleteSlot);
  });
});
