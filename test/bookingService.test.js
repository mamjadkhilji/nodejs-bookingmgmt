const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('bookingService', function() {
  this.timeout(5000);
  let Booking, User, Slot, bookingService;

  beforeEach(function() {
    Booking = {
      findOne: sinon.stub(),
      insertOne: sinon.stub(),
      find: sinon.stub(),
      updateOne: sinon.stub(),
      deleteOne: sinon.stub()
    };
    User = { findOne: sinon.stub() };
    Slot = { findOne: sinon.stub(), updateOne: sinon.stub() };
    bookingService = proxyquire('../src/services/bookingService', {
      '../models/Booking': Booking,
      '../models/User': User,
      '../models/Slot': Slot
    });
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('createBooking', function() {
    it('should return USER_NOT_FOUND if user does not exist', async function() {
      User.findOne.resolves(null);
      const result = await bookingService.createBooking('user1', { bookingdate: '2025-05-23' });
      if (result !== 'USER_NOT_FOUND') throw new Error('Expected USER_NOT_FOUND');
    });
    it('should return BOOKING_ALREADY_EXISTS if booking exists', async function() {
      User.findOne.resolves({ _id: 'u1', userid: 'user1' });
      Booking.findOne.onFirstCall().resolves({});
      const result = await bookingService.createBooking('user1', { bookingdate: '2025-05-23' });
      if (result !== 'BOOKING_ALREADY_EXISTS') throw new Error('Expected BOOKING_ALREADY_EXISTS');
    });
    it('should return SLOT_NOT_FOUND if slot does not exist', async function() {
      User.findOne.resolves({ _id: 'u1', userid: 'user1' });
      Booking.findOne.onFirstCall().resolves(null);
      Slot.findOne.resolves(null);
      const result = await bookingService.createBooking('user1', { bookingdate: '2025-05-23' });
      if (result !== 'SLOT_NOT_FOUND') throw new Error('Expected SLOT_NOT_FOUND');
    });
    it('should insert booking and update slot if all valid', async function() {
      User.findOne.resolves({ _id: 'u1', userid: 'user1' });
      Booking.findOne.onFirstCall().resolves(null); // isExistingBooking
      Slot.findOne.resolves({ slotcount: 2 });
      // Mock Booking.findOne().sort({ createdAt: -1 })
      const sortStub = sinon.stub().resolves({ bookingid: 'BKG0001' });
      Booking.findOne.onSecondCall().returns({ sort: sortStub });
      Booking.insertOne.resolves({ bookingid: 'BKG0002' });
      Slot.updateOne.resolves();
      Booking.findOne.onThirdCall().resolves({ bookingid: 'BKG0002', userloginid: 'user1', bookingdate: '2025-05-23', status: 'confirmed' });
      const result = await bookingService.createBooking('user1', { bookingdate: '2025-05-23' });
      if (!result || result.bookingid !== 'BKG0002') throw new Error('Expected booking result');
    });
  });

  describe('getBookingById', function() {
    it('should return booking if found', async function() {
      Booking.findOne.resolves({ bookingid: 'BKG0001' });
      const result = await bookingService.getBookingById('user1', 'BKG0001');
      if (!result || result.bookingid !== 'BKG0001') throw new Error('Expected booking');
    });
  });

  describe('getAllBookings', function() {
    it('should return bookings array', async function() {
      Booking.find.resolves([{ bookingid: 'BKG0001' }]);
      const result = await bookingService.getAllBookings('user1');
      if (!Array.isArray(result)) throw new Error('Expected array');
    });
  });

  describe('updateBooking', function() {
    it('should return BOOKING_NOT_FOUND if not found', async function() {
      Booking.findOne.resolves(null);
      const result = await bookingService.updateBooking('user1', 'BKG0001', { bookingdate: '2025-05-23' });
      if (result !== 'BOOKING_NOT_FOUND') throw new Error('Expected BOOKING_NOT_FOUND');
    });
    it('should return SLOT_NOT_FOUND if slot does not exist for new date', async function() {
      Booking.findOne.resolves({});
      Slot.findOne.resolves(null);
      const result = await bookingService.updateBooking('user1', 'BKG0001', { bookingdate: '2025-05-23' });
      if (result !== 'SLOT_NOT_FOUND') throw new Error('Expected SLOT_NOT_FOUND');
    });
    it('should update booking and return true if successful', async function() {
      Booking.findOne.resolves({});
      Slot.findOne.resolves({});
      Booking.updateOne.resolves({ modifiedCount: 1 });
      const result = await bookingService.updateBooking('user1', 'BKG0001', { bookingdate: '2025-05-23' });
      if (result !== true) throw new Error('Expected true');
    });
  });

  describe('patchBooking', function() {
    it('should return BOOKING_NOT_FOUND if not found', async function() {
      Booking.findOne.resolves(null);
      const result = await bookingService.patchBooking('user1', 'BKG0001', { bookingdate: '2025-05-23' });
      if (result !== 'BOOKING_NOT_FOUND') throw new Error('Expected BOOKING_NOT_FOUND');
    });
    it('should return SLOT_NOT_FOUND if slot does not exist for new date', async function() {
      Booking.findOne.resolves({});
      Slot.findOne.resolves(null);
      const result = await bookingService.patchBooking('user1', 'BKG0001', { bookingdate: '2025-05-23' });
      if (result !== 'SLOT_NOT_FOUND') throw new Error('Expected SLOT_NOT_FOUND');
    });
    it('should patch booking and return true if successful', async function() {
      Booking.findOne.resolves({});
      Slot.findOne.resolves({});
      Booking.updateOne.resolves({ modifiedCount: 1 });
      const result = await bookingService.patchBooking('user1', 'BKG0001', { bookingdate: '2025-05-23' });
      if (result !== true) throw new Error('Expected true');
    });
  });

  describe('deleteBooking', function() {
    it('should return BOOKING_NOT_FOUND if not found', async function() {
      Booking.findOne.resolves(null);
      const result = await bookingService.deleteBooking('user1', 'BKG0001');
      if (result !== 'BOOKING_NOT_FOUND') throw new Error('Expected BOOKING_NOT_FOUND');
    });
    it('should delete booking and update slot if found', async function() {
      Booking.findOne.resolves({ bookingdate: '2025-05-23' });
      Slot.findOne.resolves({ slotcount: 1 });
      Booking.deleteOne.resolves({ deletedCount: 1 });
      Slot.updateOne.resolves();
      const result = await bookingService.deleteBooking('user1', 'BKG0001');
      if (result !== true) throw new Error('Expected true');
    });
  });
});
