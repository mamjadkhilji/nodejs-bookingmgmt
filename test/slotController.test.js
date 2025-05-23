const sinon = require('sinon');
const proxyquire = require('proxyquire');
const httpMocks = require('node-mocks-http');

describe('SlotController', function() {
  this.timeout(5000);
  let SlotServiceMock;
  let SlotController;

  beforeEach(function() {
    SlotServiceMock = {
      getAllSlots: sinon.stub(),
      getSlotById: sinon.stub(),
      createSlot: sinon.stub(),
      updateSlot: sinon.stub(),
      deleteSlot: sinon.stub(),
    };
    SlotController = proxyquire('../src/controllers/slotController', {
      '../services/slotService': SlotServiceMock
    });
  });

  afterEach(function() {
    sinon.restore();
  });

  describe('getAllSlots', function() {
    it('should return 200 and slots if found', async function() {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const slots = [{ id: 1 }, { id: 2 }];
      SlotServiceMock.getAllSlots.resolves(slots);
      await SlotController.getAllSlots(req, res);
      if (res.statusCode !== 200) throw new Error('Expected 200');
      const data = res._getJSONData();
      if (!Array.isArray(data)) throw new Error('Expected slots array');
    });
    it('should return 404 if no slots found', async function() {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      SlotServiceMock.getAllSlots.resolves(null);
      await SlotController.getAllSlots(req, res);
      if (res.statusCode !== 404) throw new Error('Expected 404');
    });
    it('should return 500 on error', async function() {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      SlotServiceMock.getAllSlots.rejects(new Error('DB error'));
      await SlotController.getAllSlots(req, res);
      if (res.statusCode !== 500) throw new Error('Expected 500');
    });
  });

  describe('getSlotById', function() {
    it('should return 200 and slot if found', async function() {
      const req = httpMocks.createRequest({ params: { id: '1' } });
      const res = httpMocks.createResponse();
      SlotServiceMock.getSlotById.resolves({ id: 1 });
      await SlotController.getSlotById(req, res);
      if (res.statusCode !== 200) throw new Error('Expected 200');
    });
    it('should return 404 if not found', async function() {
      const req = httpMocks.createRequest({ params: { id: '1' } });
      const res = httpMocks.createResponse();
      SlotServiceMock.getSlotById.resolves(null);
      await SlotController.getSlotById(req, res);
      if (res.statusCode !== 404) throw new Error('Expected 404');
    });
    it('should return 500 on error', async function() {
      const req = httpMocks.createRequest({ params: { id: '1' } });
      const res = httpMocks.createResponse();
      SlotServiceMock.getSlotById.rejects(new Error('DB error'));
      await SlotController.getSlotById(req, res);
      if (res.statusCode !== 500) throw new Error('Expected 500');
    });
  });

  describe('createSlot', function() {
    it('should return 201 if slot created', async function() {
      const req = httpMocks.createRequest({ body: { slot: 1 } });
      const res = httpMocks.createResponse();
      SlotServiceMock.createSlot.resolves({ id: 1 });
      await SlotController.createSlot(req, res);
      if (res.statusCode !== 201) throw new Error('Expected 201');
    });
    it('should return 400 if body is missing', async function() {
      const req = httpMocks.createRequest();
      req.body = null;
      const res = httpMocks.createResponse();
      SlotServiceMock.createSlot.resolves({ id: 1 });
      await SlotController.createSlot(req, res);
      if (res.statusCode !== 400) throw new Error('Expected 400');
    });
    it('should return 400 for USER_NOT_FOUND', async function() {
      const req = httpMocks.createRequest({ body: { slot: 1 } });
      const res = httpMocks.createResponse();
      SlotServiceMock.createSlot.resolves('USER_NOT_FOUND');
      await SlotController.createSlot(req, res);
      if (res.statusCode !== 400) throw new Error('Expected 400');
    });
    it('should return 500 on error', async function() {
      const req = httpMocks.createRequest({ body: { slot: 1 } });
      const res = httpMocks.createResponse();
      SlotServiceMock.createSlot.rejects(new Error('DB error'));
      await SlotController.createSlot(req, res);
      if (res.statusCode !== 500) throw new Error('Expected 500');
    });
  });

  describe('updateSlot', function() {
    it('should return 200 if updated', async function() {
      const req = httpMocks.createRequest({ params: { id: '1' }, body: { slot: 1 } });
      const res = httpMocks.createResponse();
      SlotServiceMock.updateSlot.resolves({ id: 1 });
      await SlotController.updateSlot(req, res);
      if (res.statusCode !== 200) throw new Error('Expected 200');
    });
    it('should return 400 if body is missing', async function() {
      const req = httpMocks.createRequest({ params: { id: '1' } });
      req.body = null;
      const res = httpMocks.createResponse();
      SlotServiceMock.updateSlot.resolves({ id: 1 });
      await SlotController.updateSlot(req, res);
      if (res.statusCode !== 400) throw new Error('Expected 400');
    });
    it('should return 404 if SLOT_NOT_FOUND', async function() {
      const req = httpMocks.createRequest({ params: { id: '1' }, body: { slot: 1 } });
      const res = httpMocks.createResponse();
      SlotServiceMock.updateSlot.resolves('SLOT_NOT_FOUND');
      await SlotController.updateSlot(req, res);
      if (res.statusCode !== 404) throw new Error('Expected 404');
    });
    it('should return 500 on error', async function() {
      const req = httpMocks.createRequest({ params: { id: '1' }, body: { slot: 1 } });
      const res = httpMocks.createResponse();
      SlotServiceMock.updateSlot.rejects(new Error('DB error'));
      await SlotController.updateSlot(req, res);
      if (res.statusCode !== 500) throw new Error('Expected 500');
    });
  });

  describe('deleteSlot', function() {
    it('should return 200 if deleted', async function() {
      const req = httpMocks.createRequest({ params: { id: '1' } });
      const res = httpMocks.createResponse();
      SlotServiceMock.deleteSlot.resolves(true);
      await SlotController.deleteSlot(req, res);
      if (res.statusCode !== 200) throw new Error('Expected 200');
    });
    it('should return 404 if SLOT_NOT_FOUND', async function() {
      const req = httpMocks.createRequest({ params: { id: '1' } });
      const res = httpMocks.createResponse();
      SlotServiceMock.deleteSlot.resolves('SLOT_NOT_FOUND');
      await SlotController.deleteSlot(req, res);
      if (res.statusCode !== 404) throw new Error('Expected 404');
    });
    it('should return 404 if SLOT_BOOKED', async function() {
      const req = httpMocks.createRequest({ params: { id: '1' } });
      const res = httpMocks.createResponse();
      SlotServiceMock.deleteSlot.resolves('SLOT_BOOKED');
      await SlotController.deleteSlot(req, res);
      if (res.statusCode !== 404) throw new Error('Expected 404');
    });
    it('should return 404 if BOOKING_EXISTS', async function() {
      const req = httpMocks.createRequest({ params: { id: '1' } });
      const res = httpMocks.createResponse();
      SlotServiceMock.deleteSlot.resolves('BOOKING_EXISTS');
      await SlotController.deleteSlot(req, res);
      if (res.statusCode !== 404) throw new Error('Expected 404');
    });
    it('should return 500 on error', async function() {
      const req = httpMocks.createRequest({ params: { id: '1' } });
      const res = httpMocks.createResponse();
      SlotServiceMock.deleteSlot.rejects(new Error('DB error'));
      await SlotController.deleteSlot(req, res);
      if (res.statusCode !== 500) throw new Error('Expected 500');
    });
  });
});
