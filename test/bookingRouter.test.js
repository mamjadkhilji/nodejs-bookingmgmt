const express = require('express');
const request = require('supertest');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('bookingRouter', () => {
  let app;
  let bookingController;
  let authenticateMiddleware;
  let bookingRouterFactory;

  beforeEach(() => {
    bookingController = {
      getAllBookings: sinon.stub().callsFake((req, res) => res.status(200).json([])),
      getBookingById: sinon.stub().callsFake((req, res) => res.status(200).json({})),
      createBooking: sinon.stub().callsFake((req, res) => res.status(201).json({})),
      updateBooking: sinon.stub().callsFake((req, res) => res.status(200).json({})),
      patchBooking: sinon.stub().callsFake((req, res) => res.status(200).json({})),
      deleteBooking: sinon.stub().callsFake((req, res) => res.status(204).end()),
    };
    authenticateMiddleware = (req, res, next) => next();
    bookingRouterFactory = proxyquire('../src/routes/bookingRouter', {
      '../controllers/bookingController': bookingController,
      '../middleware/authMiddleware': authenticateMiddleware
    });
    app = express();
    app.use(express.json());
    app.use('/bookings', bookingRouterFactory());
  });

  afterEach(() => {
    sinon.restore();
  });

  it('GET /bookings should call getAllBookings', async () => {
    await request(app).get('/bookings').expect(200);
    sinon.assert.calledOnce(bookingController.getAllBookings);
  });

  it('GET /bookings/:id should call getBookingById', async () => {
    await request(app).get('/bookings/123').expect(200);
    sinon.assert.calledOnce(bookingController.getBookingById);
  });

  it('POST /bookings should call createBooking', async () => {
    await request(app).post('/bookings').send({}).expect(201);
    sinon.assert.calledOnce(bookingController.createBooking);
  });

  it('PUT /bookings/:id should call updateBooking', async () => {
    await request(app).put('/bookings/123').send({}).expect(200);
    sinon.assert.calledOnce(bookingController.updateBooking);
  });

  it('PATCH /bookings/:id should call patchBooking', async () => {
    await request(app).patch('/bookings/123').send({}).expect(200);
    sinon.assert.calledOnce(bookingController.patchBooking);
  });

  it('DELETE /bookings/:id should call deleteBooking', async () => {
    await request(app).delete('/bookings/123').expect(204);
    sinon.assert.calledOnce(bookingController.deleteBooking);
  });
});
