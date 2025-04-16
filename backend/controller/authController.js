import {
  comparePassword,
  createJwt,
  hashPassword,
} from "../libs/authValidation.js";
import { db } from "../libs/database.js";

export const signupUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!(firstName || email || password)) {
      return res.status(404).json({
        message: "Provide Required Fields",
      });
    }

    const userExists = await db.query({
      text: "SELECT EXISTS(SELECT * FROM tbluser WHERE email = $1 )",
      values: [email],
    });
   

    if (userExists.rows[0].exists) {
      return res.status(409).json({
        message: "User Already Exists",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await db.query({
      text: "INSERT INTO tbluser (firstName,lastName,email,password) VALUES ($1,$2,$3,$4) RETURNING *",
      values: [firstName, lastName, email, hashedPassword],
    });

    user.rows[0].password = undefined;

    res.status(200).json({
      message: "User account created successfully",
      user: user.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const signinUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await db.query({
      text: "SELECT * FROM tbluser WHERE email =  $1",
      values: [email],
    });

    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const checkPassword = await comparePassword(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: "Invalid Credentials",
      });
    }

    const token = createJwt(user.id,res);

    user.password = undefined;

    res.status(200).json({
      message: "User Login successfull",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
