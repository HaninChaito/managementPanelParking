import jwt from "jsonwebtoken";
import pool from '../database.js';

const verifyManagerForAdd = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ msg: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "Token missing" });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (!decoded) {
      return res.status(401).json({ msg: "Invalid token" });
    }

    // Fetch the manager's details with faculty information
    const [managerRows] = await pool.query(`
      SELECT m.ManagerID, m.FacultyID, u.UserID, u.Role 
      FROM manager m
      JOIN user u ON m.UserID = u.UserID
      WHERE m.UserID = ?
    `, [decoded.id]);

    if (managerRows.length === 0) {
      return res.status(403).json({ msg: "Manager not found" });
    }

    const manager = managerRows[0];

    // Store manager information in request object
    req.manager = {
      ManagerID: manager.ManagerID,
      FacultyID: manager.FacultyID,
      UserID: manager.UserID
    };

    next();
  } catch (error) {
    console.error("Authorization error:", error);
    return res.status(401).json({ msg: "Authorization failed" });
  }
};

export default verifyManagerForAdd;