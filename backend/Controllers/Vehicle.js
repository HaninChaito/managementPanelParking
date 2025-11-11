import db from "../database.js";
import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "uploads");
  },
  filename: (req, res, cb) => {
    cb(null, res.fieldname + "_" + Date.now() + path.extname(res.originalname));
  },
});

export const upload = multer({
  storage: storage,
});

export const uploadFields = upload.fields([
  { name: "VehicleImage", maxCount: 1 },
  { name: "InsuranceDoc", maxCount: 1 },
  { name: "DrivingLiscence", maxCount: 1 },
]);

export async function AddVehicle(req, res , next) {
    const { vehicleType, vehicleColor, Plate_Nb, Insurance_Expiration_Date } = req.body;
  
    const VehicleImage = req.files?.VehicleImage?.[0]?.filename || "";
    const InsuranceDoc = req.files?.InsuranceDoc?.[0]?.filename || "";
    const DrivingLiscence = req.files?.DrivingLiscence?.[0]?.filename || "";
  
    const sql = `
      INSERT INTO vehicle (
        Vehicle_Type, Vehicle_Color, Plate_Nb,
        Vehicle_Image, Insurance_Image, Driving_License,
        Insurance_Expiration_Date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
  
    const values = [
      vehicleType,
      vehicleColor,
      Plate_Nb,
      VehicleImage,
      InsuranceDoc,
      DrivingLiscence,
      Insurance_Expiration_Date,
    ];
  
    try {
      const [result] = await db.query(sql, values);
  
      const insertedId = result.insertId;

      req.vehicleId = insertedId ;

      next();


  
     
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error." });
    }
  }
  