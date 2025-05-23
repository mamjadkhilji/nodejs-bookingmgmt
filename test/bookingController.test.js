const sinon = require('sinon');
const proxyquire = require('proxyquire');
const httpMocks = require('node-mocks-http');

describe('BookingController', function() {
  this.timeout(5000);
  let BookingServiceMock;
  let BookingController;

  beforeEach(function() {
    BookingServiceMock = {
      getAllBookings: sinon.stub(),
      getBookingById: sinon.stub(),
      createBooking: sinon.stub(),
      updateBooking: sinon.stub(),
      patchBooking: sinon.stub(),
      deleteBooking: sinon.stub(),
    };
    BookingController = proxyquire('../src/controllers/bookingController', {
      '../services/bookingService': BookingServiceMock
    });
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('getAllBookings', function() {
    it('should return 200 and bookings if found', async function() {
      const req = httpMocks.createRequest({ headers: { loginid: 'user1' } });
      const res = httpMocks.createResponse();
      const bookings = [{ id: 1 }, { id: 2 }];
      BookingServiceMock.getAllBookings.resolves(bookings);
      await BookingController.getAllBookings(req, res);
      if (res.statusCode !== 200) throw new Error('Expected 200');
      const data = res._getJSONData();
      if (!Array.isArray(data)) throw new Error('Expected bookings array');
    });
    it('should return 404 if no bookings found', async function() {
      const req = httpMocks.createRequest({ headers: { loginid: 'user1' } });
      const res = httpMocks.createResponse();
      BookingServiceMock.getAllBookings.resolves(null);
      await BookingController.getAllBookings(req, res);
      if (res.statusCode !== 404) throw new Error('Expected 404');
    });
    it('should return 500 on error', async function() {
      const req = httpMocks.createRequest({ headers: { loginid: 'user1' } });
      const res = httpMocks.createResponse();
      BookingServiceMock.getAllBookings.rejects(new Error('DB error'));
      await BookingController.getAllBookings(req, res);
      if (res.statusCode !== 500) throw new Error('Expected 500');
    });
  });

  describe('getBookingById', function() {
    it('should return 200 and booking if found', async function() {
      const req = httpMocks.createRequest({ headers: { loginid: 'user1' }, params: { id: '1' } });
      const res = httpMocks.createResponse();
      BookingServiceMock.getBookingById.resolves({ id: 1 });
      await BookingController.getBookingById(req, res);
      if (res.statusCode !== 200) throw new Error('Expected 200');
    });
    it('should return 404 if not found', async function() {
      const req = httpMocks.createRequest({ headers: { loginid: 'user1' }, params: { id: '1' } });
      const res = httpMocks.createResponse();
      BookingServiceMock.getBookingById.resolves(null);
      await BookingController.getBookingById(req, res);
      if (res.statusCode !== 404) throw new Error('Expected 404');
    });
    it('should return 500 on error', async function() {
      const req = httpMocks.createRequest({ headers: { loginid: 'user1' }, params: { id: '1' } });
      const res = httpMocks.createResponse();
      BookingServiceMock.getBookingById.rejects(new Error('DB error'));
      await BookingController.getBookingById(req, res);
      if (res.statusCode !== 500) throw new Error('Expected 500');
    });
  });

  describe('createBooking', function() {
    it('should return 201 if booking created', async function() {
      const req = httpMocks.createRequest({ headers: { loginid: 'user1' }, body: { slot: 1 } });
      const res = httpMocks.createResponse();
      BookingServiceMock.createBooking.resolves({ id: 1 });
      await BookingController.createBooking(req, res);
      if (res.statusCode !== 201) throw new Error('Expected 201');
    });
    it('should return 400 if body is missing', async function() {
      const req = httpMocks.createRequest({ headers: { loginid: 'user1' } });
      req.body = null; // Explicitly set body to null
      const res = httpMocks.createResponse();
      await BookingController.createBooking(req, res);
      if (res.statusCode !== 400) throw new Error('Expected 400');
    });
    it('should return 400 for USER_NOT_FOUND', async function() {
      const req = httpMocks.createRequest({ headers: { loginid: 'user1' }, body: { slot: 1 } });
      const res = httpMocks.createResponse();
      BookingServiceMock.createBooking.resolves('USER_NOT_FOUND');
      await BookingController.createBooking(req, res);
      if (res.statusCode !== 400) throw new Error('Expected 400');
    });
    it('should return 500 on error', async function() {
      const req = httpMocks.createRequest({ headers: { loginid: 'user1' }, body: { slot: 1 } });
      const res = httpMocks.createResponse();
      BookingServiceMock.createBooking.rejects(new Error('DB error'));
      await BookingController.createBooking(req, res);
      if (res.statusCode !== 500) throw new Error('Expected 500');
    });
  });

  describe('updateBooking', function() {
    it('should return 200 if updated', async function() {
      const req = httpMocks.createRequest({ headers: { loginid: 'user1' }, params: { id: '1' }, body: { slot: 1 } });
      const res = httpMocks.createResponse();
      BookingServiceMock.updateBooking.resolves({ id: 1 });
      await BookingController.updateBooking(req, res);
      if (res.statusCode !== 200) throw new Error('Expected 200');
    });
    it('should return 400 if body is missing', async function() {
      const req = httpMocks.createRequest({ headers: { loginid: 'user1' }, params: { id: '1' } });
      req.body = null; // Explicitly set body to null
      const res = httpMocks.createResponse();
      await BookingController.updateBooking(req, res);
      if (res.statusCode !== 400) throw new Error('Expected 400');
    });
    it('should return 404 if BOOKING_NOT_FOUND', async function() {
      const req = httpMocks.createRequest({ headers: { loginid: 'user1' }, params: { id: '1' }, body: { slot: 1 } });
      const res = httpMocks.createResponse();
      BookingServiceMock.updateBooking.resolves('BOOKING_NOT_FOUND');
      await BookingController.updateBooking(req, res);
      if (res.statusCode !== 404) throw new Error('Expected 404');
    });
    it('should return 500 on error', async function() {
      const req = httpMocks.createRequest({ headers: { loginid: 'user1' }, params: { id: '1' }, body: { slot: 1 } });
      const res = httpMocks.createResponse();
      BookingServiceMock.updateBooking.rejects(new Error('DB error'));
      await BookingController.updateBooking(req, res);
      if (res.statusCode !== 500) throw new Error('Expected 500');
    });
  });

  describe('patchBooking', function() {
    it('should return 200 if patched', async function() {
      const req = httpMocks.createRequest({ headers: { loginid: 'user1' }, params: { id: '1' }, body: { slot: 1 } });
      const res = httpMocks.createResponse();
      BookingServiceMock.patchBooking.resolves({ id: 1 });
      await BookingController.patchBooking(req, res);
      if (res.statusCode !== 200) throw new Error('Expected 200');
    });
    it('should return 400 if body is missing', async function() {
      const req = httpMocks.createRequest({ headers: { loginid: 'user1' }, params: { id: '1' } });
      req.body = null; // Explicitly set body to null
      const res = httpMocks.createResponse();
      await BookingController.patchBooking(req, res);
      if (res.statusCode !== 400) throw new Error('Expected 400');
    });
    it('should return 404 if BOOKING_NOT_FOUND', async function() {
      const req = httpMocks.createRequest({ headers: { loginid: 'user1' }, params: { id: '1' }, body: { slot: 1 } });
      const res = httpMocks.createResponse();
      BookingServiceMock.patchBooking.resolves('BOOKING_NOT_FOUND');
      await BookingController.patchBooking(req, res);
      if (res.statusCode !== 404) throw new Error('Expected 404');
    });
    it('should return 500 on error', async function() {
      const req = httpMocks.createRequest({ headers: { loginid: 'user1' }, params: { id: '1' }, body: { slot: 1 } });
      const res = httpMocks.createResponse();
      BookingServiceMock.patchBooking.rejects(new Error('DB error'));
      await BookingController.patchBooking(req, res);
      if (res.statusCode !== 500) throw new Error('Expected 500');
    });
  });

  describe('deleteBooking', function() {
    it('should return 200 if deleted', async function() {
      const req = httpMocks.createRequest({ headers: { loginid: 'user1' }, params: { id: '1' } });
      const res = httpMocks.createResponse();
      BookingServiceMock.deleteBooking.resolves(true);
      await BookingController.deleteBooking(req, res);
      if (res.statusCode !== 200) throw new Error('Expected 200');
    });
    it('should return 404 if BOOKING_NOT_FOUND', async function() {
      const req = httpMocks.createRequest({ headers: { loginid: 'user1' }, params: { id: '1' } });
      const res = httpMocks.createResponse();
      BookingServiceMock.deleteBooking.resolves('BOOKING_NOT_FOUND');
      await BookingController.deleteBooking(req, res);
      if (res.statusCode !== 404) throw new Error('Expected 404');
    });
    it('should return 500 on error', async function() {
      const req = httpMocks.createRequest({ headers: { loginid: 'user1' }, params: { id: '1' } });
      const res = httpMocks.createResponse();
      BookingServiceMock.deleteBooking.rejects(new Error('DB error'));
      await BookingController.deleteBooking(req, res);
      if (res.statusCode !== 500) throw new Error('Expected 500');
    });
  });
});
