const mongoose = require('mongoose');
const Slot = require('../src/models/Slot');

describe('Slot Model', function() {
  this.timeout(10000);
  before(function(done) {
    mongoose.connect('mongodb://localhost:27017/slotmodeltest', { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => done())
      .catch(done);
  });

  after(async function() {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create a slot with all required fields', async function() {
    const slot = new Slot({
      slotid: 'SLT0001',
      slotdate: '2025-05-23',
      slotcount: 5
    });
    const saved = await slot.save();
    if (!saved._id) throw new Error('Slot not saved');
    if (saved.slotstatus !== 'available') throw new Error('Default slotstatus not set');
    if (saved.active !== true) throw new Error('Default active not set');
    if (!saved.createdAt) throw new Error('createdAt not set');
    if (!saved.updatedAt) throw new Error('updatedAt not set');
  });

  it('should fail validation if required fields are missing', async function() {
    const slot = new Slot({});
    let error = null;
    try {
      await slot.validate();
    } catch (err) {
      error = err;
    }
    if (!error) throw new Error('Validation should fail');
    if (!error.errors.slotid) throw new Error('slotid required');
    if (!error.errors.slotdate) throw new Error('slotdate required');
    if (!error.errors.slotcount) throw new Error('slotcount required');
  });

  it('should only allow valid slotstatus values', async function() {
    const slot = new Slot({
      slotid: 'SLT0002',
      slotdate: '2025-05-24',
      slotcount: 3,
      slotstatus: 'invalidstatus'
    });
    let error = null;
    try {
      await slot.validate();
    } catch (err) {
      error = err;
    }
    if (!error || !error.errors.slotstatus) throw new Error('Invalid slotstatus should fail validation');
  });

  it('should update updatedAt on save', async function() {
    const slot = new Slot({
      slotid: 'SLT0003',
      slotdate: '2025-05-25',
      slotcount: 2
    });
    await slot.save();
    const oldUpdatedAt = slot.updatedAt;
    await new Promise(r => setTimeout(r, 2));
    slot.slotstatus = 'booked';
    await slot.save();
    if (!(slot.updatedAt > oldUpdatedAt)) throw new Error('updatedAt not updated');
  });
});
