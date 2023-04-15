import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
username: { type: String, required: true, unique: true },
email: { type: String, required: true, unique: true },
password: { type: String, required: false },
role: { type: String, enum: ['teacher', 'student'], required: true },
googleId: { type: String },
});

UserSchema.methods.encryptPassword = async function (password) {
const salt = await bcrypt.genSalt(10);
return await bcrypt.hash(password, salt);
};

UserSchema.methods.validatePassword = function (password) {
return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

export default User;
