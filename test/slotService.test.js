const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('slotService', function() {
  this.timeout(5000);
  let Slot, Booking, slotService;

  beforeEach(function() {
    Slot = {
      findOne: sinon.stub(),
      insertOne: sinon.stub(),
      find: sinon.stub(),
      updateOne: sinon.stub(),
      deleteOne: sinon.stub()
    };
    Booking = { findOne: sinon.stub() };
    slotService = proxyquire('../src/services/slotService', {
      '../models/Slot': Slot,
      '../models/Booking': Booking
    });
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('createSlot', function() {
    it('should return INVALID_SLOT_DATE if slotdate is invalid', async function() {
      const result = await slotService.createSlot({ slotdate: null });
      if (result !== 'INVALID_SLOT_DATE') throw new Error('Expected INVALID_SLOT_DATE');
    });
    
  });

  describe('getSlotById', function() {
    it('should return slot if found', async function() {
      Slot.findOne.resolves({ slotid: 'SLT0001' });
      const result = await slotService.getSlotById('SLT0001');
      if (!result || result.slotid !== 'SLT0001') throw new Error('Expected slot');
    });
  });

  describe('getAllSlots', function() {
    it('should return slots array', async function() {
      Slot.find.resolves([{ slotid: 'SLT0001' }]);
      const result = await slotService.getAllSlots();
      if (!Array.isArray(result)) throw new Error('Expected array');
    });
  });

  describe('updateSlot', function() {
    it('should return SLOT_NOT_FOUND if not found', async function() {
      Slot.findOne.resolves(null);
      const result = await slotService.updateSlot('SLT0001', { slotdate: '2025-05-23' });
      if (result !== 'SLOT_NOT_FOUND') throw new Error('Expected SLOT_NOT_FOUND');
    });
    it('should update slot and return true if successful', async function() {
      Slot.findOne.resolves({});
      Slot.updateOne.resolves({ modifiedCount: 1 });
      const result = await slotService.updateSlot('SLT0001', { slotdate: '2025-05-23' });
      if (result !== true) throw new Error('Expected true');
    });
  });

  describe('deleteSlot', function() {
    it('should return SLOT_NOT_FOUND if not found', async function() {
      Slot.findOne.resolves(null);
      const result = await slotService.deleteSlot('SLT0001');
      if (result !== 'SLOT_NOT_FOUND') throw new Error('Expected SLOT_NOT_FOUND');
    });
    it('should return BOOKING_EXISTS if booking exists', async function() {
      Slot.findOne.resolves({ slotdate: '2025-05-23' });
      Booking.findOne.resolves({});
      const result = await slotService.deleteSlot('SLT0001');
      if (result !== 'BOOKING_EXISTS') throw new Error('Expected BOOKING_EXISTS');
    });
    it('should delete slot and return true if successful', async function() {
      Slot.findOne.resolves({ slotdate: '2025-05-23' });
      Booking.findOne.resolves(null);
      Slot.deleteOne.resolves({ deletedCount: 1 });
      const result = await slotService.deleteSlot('SLT0001');
      if (result !== true) throw new Error('Expected true');
    });
  });
});
