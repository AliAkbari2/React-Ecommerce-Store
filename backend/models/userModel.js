import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    //define the schema first
    name: { type: String, required: true }, //not unique as users might have same username
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
  },
  {
    //set options
    timestamps: true, //sets created at and updated at fields
  }
);

//next create a model based on the above schema
const User = mongoose.model('User', userSchema);

export default User;
