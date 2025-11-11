import jwt from "jsonwebtoken";
import db from '../database.js';


const verifyUser = async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
  
      if (!authHeader) {
        return res.status(401).json({ msg: "auth header Unauthorized" });
      }
  
      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({ msg: "token Unauthorized" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      if (!decoded) {
        return res.status(401).json({ msg: "Invalid token" });
      }
  
      // Fetch user from MySQL using raw SQL
      const [rows] = await db.query(
        "SELECT ManagerID, FacultyID FROM manager WHERE UserID = ?",
        [decoded.id]
      );
  
      if (rows.length === 0) {
        return res.status(404).json({ msg: "Manager not Found " });
      }
  
      const manager = rows[0]; 
      
      req.manager = manager;
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({ msg: "error Unauthorized" });
    }
  };
  
  export default verifyUser;