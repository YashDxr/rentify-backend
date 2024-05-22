import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { customErrors } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { firstName, lastName, email, phoneNumber, password, userType } =
    req.body;

  const existingUser1 = await User.findOne({ email });
  const existingUser2 = await User.findOne({ phoneNumber });
  if (existingUser1 || existingUser2) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await bcryptjs.hash(password, 10);

  const newUser = new User({
    firstName,
    lastName,
    email,
    phoneNumber,
    userType,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.status(201).json("User Created Successfully!!!");
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  const { user, password } = req.body;
  try {
    const validUser =
      (await User.findOne({ email: user })) ||
      (await User.findOne({ phoneNumber: user }));
    if (!validUser) return next(customErrors(404, "User Not Found"));
    const validPassword = await bcryptjs.compare(password, validUser.password);
    if (!validPassword) return next(customErrors(401, "Invalid Credentials"));
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET_KEY);
    const { password: pass, ...REST } = validUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(REST); //expires: 24*60*60
  } catch (err) {
    next(err);
  }
};

export const google = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
    const { password: pass, ...rest } = user._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } else {
    
    const generatePassword =
      Math.random().toString(36).slice(-8) +
      Math.random().toString(36).slice(-8);
    const hashedPassword = await bcryptjs.hash(generatePassword, 10);
    const newUser = new User({
      email: req.body.email,
      password: hashedPassword,
      avatar: req.body.photo,
    });

    await newUser.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY);
    const { password: pass, ...rest } = newUser._doc;
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User logged out successfully!");
  } catch (error) {
    next(error);
  }
};
