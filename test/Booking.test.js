const mongoose = require('mongoose');
const Booking = require('../src/models/Booking');

describe('Booking Model', function() {
  this.timeout(10000); // Increase timeout for slow DB operations
  before(function(done) {
    mongoose.connect('mongodb://localhost:27017/bookingmodeltest', { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => done())
      .catch(done);
  });

  after(async function() {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create a booking with all required fields', async function() {
    const booking = new Booking({
      bookingid: 'BKG0001',
      userid: new mongoose.Types.ObjectId(),
      userloginid: 'user1',
      bookingdate: '2025-05-23',
    });
    const saved = await booking.save();
    if (!saved._id) throw new Error('Booking not saved');
    if (saved.status !== 'confirmed') throw new Error('Default status not set');
    if (saved.active !== true) throw new Error('Default active not set');
    if (!saved.createdAt) throw new Error('createdAt not set');
    if (!saved.updatedAt) throw new Error('updatedAt not set');
  });

  it('should fail validation if required fields are missing', async function() {
    const booking = new Booking({});
    let error = null;
    try {
      await booking.validate();
    } catch (err) {
      error = err;
    }
    if (!error) throw new Error('Validation should fail');
    if (!error.errors.bookingid) throw new Error('bookingid required');
    if (!error.errors.userid) throw new Error('userid required');
    if (!error.errors.userloginid) throw new Error('userloginid required');
    if (!error.errors.bookingdate) throw new Error('bookingdate required');
  });

  it('should only allow valid status values', async function() {
    const booking = new Booking({
      bookingid: 'BKG0002',
      userid: new mongoose.Types.ObjectId(),
      userloginid: 'user2',
      bookingdate: '2025-05-24',
      status: 'invalidstatus'
    });
    let error = null;
    try {
      await booking.validate();
    } catch (err) {
      error = err;
    }
    if (!error || !error.errors.status) throw new Error('Invalid status should fail validation');
  });

  it('should update updatedAt on save', async function() {
    const booking = new Booking({
      bookingid: 'BKG0003',
      userid: new mongoose.Types.ObjectId(),
      userloginid: 'user3',
      bookingdate: '2025-05-25',
    });
    await booking.save();
    const oldUpdatedAt = booking.updatedAt;
    // Wait 1ms to ensure timestamp changes
    await new Promise(r => setTimeout(r, 2));
    booking.status = 'cancelled';
    await booking.save();
    if (!(booking.updatedAt > oldUpdatedAt)) throw new Error('updatedAt not updated');
  });
});
