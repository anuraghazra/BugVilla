const mongoose = require('mongoose');
const { UserModel } = require('../models/userModel');
const userData = {
  name: 'TekLoon',
  gender: 'Male',
  dob: new Date(),
  loginUsing: 'Facebook',
};

describe('User Model Test', () => {
  // It's just so easy to connect to the MongoDB Memory Server
  // By using mongoose.connect
  beforeAll(() => {
    mongoose
      .connect(process.env.DB_CONNECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('Connected to database');
      })
      .catch(() => console.log('Failed to connect to database.'));
  });

  it('should start', () => {
    let a = 2 + 2;
    console.log('Working');
  });
});
