const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});


const AdminModel = mongoose.model('Admin', adminSchema, 'admin');  

module.exports = AdminModel;

