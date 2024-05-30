const User = require('../dao/models/users.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Function definitions for userLogin, signUp, showLogin, and showRegister
// (Assuming your code defines these functions)

// Export the functions as an object (common approach with require)
module.exports = {
  userLogin,
  signUp,
  showLogin,
  showRegister,
};
