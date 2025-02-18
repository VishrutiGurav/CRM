const bcrypt = require('bcrypt');

const password = 'rigel'; // Replace with the password you want to hash

// Define the number of salt rounds (10-12 is common)
const saltRounds = 10;

// Hash the password
bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    console.log('Hashed Password:', hash);
  }
});
