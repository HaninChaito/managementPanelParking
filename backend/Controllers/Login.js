import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../database.js";
import nodemailer from 'nodemailer';

export async function login(req, res) {
  try {
    const { Email, Password } = req.body;

    const [rows] = await db.query("SELECT * FROM user WHERE Email = ?", [
      Email,
    ]);

    if (rows.length === 0) {
      console.log(
        "Error Finding User. Check the validity of your Email or Password"
      );
      return res
        .status(400)
        .json({
          msg: "Error Finding User. Check the validity of your Email or Password",
        });
    }

    const userExist = rows[0];

    if (userExist) {
      const [manager] = await db.query(
        "SELECT * FROM manager WHERE UserID = ?",
        [userExist.UserID]
      );
      if (manager.length === 0) {
        console.log("Access Denied. ");
        return res.status(400).json({ msg: "Access Denied." });
      }
    }

    const matchPassword = await bcrypt.compare(Password, userExist.Password);
    if (!matchPassword) {
      console.log(
        "Error Finding User. Check the validity of your Email or Password"
      );
      return res
        .status(400)
        .json({
          msg: "Error Finding User. Check the validity of your Email or Password",
        });
    }

    // Create a JWT token
    const token = jwt.sign({ id: userExist.UserID }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });

    return res
      .status(200)
      .json({
        msg: "success",
        token,
        user: { _id: userExist.UserID, Email: userExist.Email },
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "error: " + error });
  }
}




export const CreateAccount = async (req, res) => {
  const { email} = req.body;
  

  try {
    const [rows] = await db.query('SELECT * FROM  manageruserview WHERE Email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'غير موجود' });
    }

    const manager = rows[0];


  

   return res.status(200).json({
      message: 'تم ايجاد البريد الشخصي بنجاح',
      manager: {
        id: manager.ManagerID,
        name: `${manager.FirstName} ${manager.LastName}`,
        email: manager.Email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'حدث خطأ ما في الخادم' });
  }
};


export const  sendEmail = async(req,res)=> {
   const { to, subject, text } = req.body;
  console.log("Email Params →", { to, subject, text });
 let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.email,      
      pass: process.env.App_Password 
    },
    tls: {
    rejectUnauthorized: false, // Allow self-signed cert
  },
  });

 try {
    let info = await transporter.sendMail({
      from: `"Lebanese University Vehivcle Access " <${process.env.email}>`, // sender address
      to,
      subject,  // Subject line
      text      // plain text body
    });

    console.log('Message sent: %s', info.messageId);
    res.status(200).json({ message: 'Email sent', info });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send email' });
  }
 } 


export const setPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const [rows] = await db.query('SELECT * FROM user WHERE Email = ?', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'المستخدم غير موجود' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update the password
    await db.query('UPDATE user SET Password = ? WHERE Email = ?', [hashedPassword, email]);

    return res.status(200).json({ message: 'تم تحديث كلمة المرور بنجاح' });
  } catch (error) {
    console.error('Set password error:', error);
    return res.status(500).json({ message: 'حدث خطأ أثناء تحديث كلمة المرور' });
  }
};