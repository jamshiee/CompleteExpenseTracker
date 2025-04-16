import { comparePassword, hashPassword } from "../libs/authValidation.js";
import { db } from "../libs/database.js";

export const getUser = async (req, res) => {
  try {
    const { userId } = req.user;

    const userExists = await db.query({
      text: "SELECT *FROM tbluser WHERE id =$1",
      values: [userId],
    });

    const user = userExists.rows[0];

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    user.password = undefined;
    res.status(200).json({
      message: "success",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  const { userId } = req.user;
  const { currentPass, newPass, confirmPass } = req.body;

  try {
    const dbPass = await db.query({
      text: "SELECT password FROM tbluser WHERE id = $1",
      values: [userId],
    });
    console.log(dbPass.rows[0].password);

    const verifyPass = await comparePassword(
      currentPass,
      dbPass.rows[0].password
    );
    console.log(verifyPass);

    if (!verifyPass) {
      return res.status(400).json({
        message: "Invalid Current Password",
      });
    }

    if (newPass !== confirmPass) {
      return res.status(400).json({
        message: "Password does not match",
      });
    }

    const hashedPassword = await hashPassword(newPass);

    await db.query({
      text: "UPDATE tbluser SET password = $1 WHERE id = $2",
      values: [hashedPassword, userId],
    });

    res.status(200).json({
      message: "Password changed succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { userId } = req.user;
  const { firstname, lastname, country, currency, contact } = req.body;
  try {
    const userExists = await db.query({
      text: "SELECT * FROM tbluser WHERE id = $1",
      values: [userId],
    });

    const user = userExists.rows[0];

    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }

    const updatedUser = await db.query({
      text: "UPDATE tbluser SET firstname = $1,lastname =$2,country=$3,currency=$4,contact=$5, updatedAt = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *",
      values: [firstname, lastname, country, currency, contact, userId],
    });

    updatedUser.rows[0].password = undefined;

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
