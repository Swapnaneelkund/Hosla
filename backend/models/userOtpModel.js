import mongoose from 'mongoose';

const UserOTPSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // Auto delete after 10 min
});
const UserOTP=mongoose.model('UserOTP', UserOTPSchema);
export default UserOTP;
