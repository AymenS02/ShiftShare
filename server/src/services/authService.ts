import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { generateToken } from "../utils/jwt.js";


export async function registerUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {

  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }


  // Hash password
  const hashedPassword = await hashPassword(password);


  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });


  // Create JWT
  const token = generateToken(
    user._id.toString()
  );


  return {
    user,
    token,
  };
}



export async function loginUser(
  email: string,
  password: string
) {

  // Find user
  const user = await User.findOne({
    email,
  });


  if (!user) {
    throw new Error("Invalid credentials");
  }


  // Check password
  const isPasswordCorrect =
    await comparePassword(
      password,
      user.password
    );


  if (!isPasswordCorrect) {
    throw new Error("Invalid credentials");
  }


  // Generate token
  const token = generateToken(
    user._id.toString()
  );


  return {
    user,
    token,
  };
}