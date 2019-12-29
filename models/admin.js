const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const  event= require("./event");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true
  },
  age: {
    type: Number,
    default: 0
  },
  type:{
    type:Number,
    required:true
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});
userSchema.virtual("events", {
  ref: "event",
  localField: "_id",
  foreignField: "owner"
});

userSchema.pre("save", async function(next) {
  const user = this;
  if (user.isModified("password"))
    user.password = await bcrypt.hash(user.password, 9);
  next();
});
userSchema.pre("remove", async function(next) {
  const user = this;
  await event.deleteMany({ owner: user._id });
  next();
});
userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "mytoken");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};
userSchema.statics.findByCredentials = async (email, password) => {
  const admain = await Admain.findOne({ email });

  if (!admain) {
    throw new Error("admain not found");
  }
  const isMatch = await bcrypt.compare(password, admain.password);
  if (!isMatch) throw new Error("password error");
  return admain;
};
const Admain = mongoose.model("Admain", userSchema);
module.exports = Admain;
