import db from "../database.js";

export async function GetRequestsHistory(req, res) {
  try {
    const FacultyID = req.manager.FacultyID;

    const [rows] = await db.query(
      "SELECT * FROM requesthistoryformanagerview WHERE FacultyID = ?",
      [FacultyID]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
}


export async function GetUser(req, res) {
  try {
    const { UserID } = req.query;

    const [rows] = await db.query(
      "SELECT * FROM userfaculty WHERE UserID = ?",
      [UserID]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
}


export async function GetManager(req, res) {
  try {
    const { ManagerId } = req.query;

    const [rows] = await db.query(
      "SELECT * FROM manageruserview WHERE ManagerID = ?",
      [ManagerId]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
}


export async function GetVehicle(req, res) {
  try {
    const { Vehicle_ID } = req.query;

    const [rows] = await db.query(
      "SELECT Vehicle_Type , Plate_Nb , Vehicle_Color, Insurance_Expiration_Date  FROM vehicle WHERE Vehicle_ID = ?",
      [Vehicle_ID]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
}