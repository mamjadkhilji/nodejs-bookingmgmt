const mongoose = require('mongoose');
const User = require('../src/models/User');

describe('User Model', function() {
  this.timeout(10000);
  before(function(done) {
    mongoose.connect('mongodb://localhost:27017/usermodeltest', { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => done())
      .catch(done);
  });

  after(async function() {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
  });

  it('should create a user with all required fields', async function() {
    const user = new User({
      userid: 'user1',
      username: 'Test User',
      passkey: 'secret',
      email: 'test@example.com',
      usertype: 'admin'
    });
    const saved = await user.save();
    if (!saved._id) throw new Error('User not saved');
    if (saved.usertype !== 'admin') throw new Error('Usertype not set');
    if (saved.active !== true) throw new Error('Default active not set');
  });

  it('should fail validation if userid is missing', async function() {
    const user = new User({});
    let error = null;
    try {
      await user.validate();
    } catch (err) {
      error = err;
    }
    if (!error) throw new Error('Validation should fail');
    if (!error.errors.userid) throw new Error('userid required');
  });

  it('should only allow valid usertype values', async function() {
    const user = new User({
      userid: 'user2',
      usertype: 'invalidtype'
    });
    let error = null;
    try {
      await user.validate();
    } catch (err) {
      error = err;
    }
    if (!error || !error.errors.usertype) throw new Error('Invalid usertype should fail validation');
  });

  it('should trim userid and username', async function() {
    const user = new User({
      userid: '  user3  ',
      username: '  Name  '
    });
    await user.validate();
    if (user.userid !== 'user3') throw new Error('userid not trimmed');
    if (user.username !== 'Name') throw new Error('username not trimmed');
  });

  it('should enforce unique userid', async function() {
    const user1 = new User({ userid: 'uniqueuser' });
    const user2 = new User({ userid: 'uniqueuser' });
    await user1.save();
    let error = null;
    try {
      await user2.save();
    } catch (err) {
      error = err;
    }
    if (!error) throw new Error('Unique constraint should fail');
  });
});
