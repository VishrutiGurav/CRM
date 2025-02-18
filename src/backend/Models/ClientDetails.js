const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientDetailsSchema = new Schema({
  personalDetails: {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    role: { type: String, required: true },
  },
  instituteDetails: {
    departmentName: { type: String, required: true },
    instituteName: { type: String, required: true },
    instituteAddress: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  interestDetails: {
    businessType: { type: String, required: true }, 
    purpose: { type: String, required: true },
    scope: { type: String, required: true },
    startDate: { type: Date, required: true },
    duration: { type: String, required: true },
    budget: { type: String, required: true },
    communicationMode: { type: String, required: true },
    customPurpose: { type: String },
  }
});


const ClientDetails = mongoose.model('ClientDetails', clientDetailsSchema);
module.exports = ClientDetails;
