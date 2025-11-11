import db from "../database.js";

export async function GetPendingRequests(req, res) {
  try {
    const FacultyID = req.manager.FacultyID;
    const [rows] = await db.query(
      "SELECT * FROM uservehiclerequestview WHERE Status = 'pending'  AND FacultyID = ? ",
      [FacultyID]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
}

export async function GetModifiedRequests(req, res) {
  try {
    const FacultyID = req.manager.FacultyID;
    const [rows] = await db.query(
      "SELECT * FROM uservehiclerequestview WHERE Status = 'modified' AND FacultyID = ?",
      [FacultyID]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
}

export async function AcceptRequest(req, res) {
  const { Req_ID } = req.body;

  if (!Req_ID) {
    return res.status(400).json({ msg: "Request ID is required" });
  }

  try {
    // Fetch request details
    const [requestRows] = await db.query(
      "SELECT Sender_ID, Vehicle_ID FROM request WHERE Req_ID = ?",
      [Req_ID]
    );

    if (requestRows.length === 0) {
      return res.status(404).json({ msg: "Request not found" });
    }

    const { Sender_ID, Vehicle_ID } = requestRows[0];
    const Manager_ID = req.manager.ManagerID;

    // Insert into requesthistory
      await db.query(
      `INSERT INTO requesthistory (Req_ID ,Sender_ID, Manager_ID, Vehicle_ID, Status, Comment)
         VALUES ( ?,?, ?, ?, 'approvedByManager', NULL)`,
      [Req_ID ,Sender_ID, Manager_ID, Vehicle_ID]
    );
 
    // Update the request status in the request table
    await db.query(
      `UPDATE request SET Status = 'approvedByManager', Manager_ID = ? WHERE Req_ID = ?`,
      [Manager_ID, Req_ID]
    );

    res
      .status(200)
      .json({ msg: "Request approved and added to history successfully" });
  } catch (error) {
    console.error("Error inserting into history or updating request:", error);
    res.status(500).json({ msg: "Server error" });
  }
}

export async function DeclineRequest(req, res) {
  const { Req_ID } = req.body;

  if (!Req_ID) {
    return res.status(400).json({ msg: "Request ID is required" });
  }

  try {
    const [requestRows] = await db.query(
      "SELECT Sender_ID, Vehicle_ID FROM request WHERE Req_ID = ?",
      [Req_ID]
    );

    if (requestRows.length === 0) {
      return res.status(404).json({ msg: "Request not found" });
    }

    const { Sender_ID, Vehicle_ID } = requestRows[0];
    const Manager_ID = req.manager.ManagerID;

    // Insert into requesthistory
    await db.query(
      `INSERT INTO requesthistory (Req_ID ,Sender_ID, Manager_ID, Vehicle_ID, Status, Comment)
         VALUES ( ?,?, ?, ?, 'declined', NULL)`,
      [Req_ID ,Sender_ID, Manager_ID, Vehicle_ID]
    );

 
    await db.query(
      `UPDATE request SET Status = 'declined', Manager_ID = ? WHERE Req_ID = ?`,
      [Manager_ID, Req_ID]
    );

       const [senderEmail] = await db.query(
      "SELECT Email FROM uservehiclerequestview WHERE Req_ID = ?",
      [Req_ID]
    );

    const { Email } = senderEmail[0];

res.status(200).json({
      msg: "Request denied and added to history successfully",
      email: Email
    });


  } catch (error) {
    console.error("Error inserting into history or updating request:", error);
    res.status(500).json({ msg: "Server error" });
  }
}

export async function EditRequest(req, res) {
  const { Req_ID, Comment } = req.body;

  if (!Req_ID || !Comment) {
    return res.status(400).json({ msg: "Request ID and Comment are required" });
  }

  try {
    const [requestRows] = await db.query(
      "SELECT Sender_ID, Vehicle_ID FROM request WHERE Req_ID = ?",
      [Req_ID]
    );

    if (requestRows.length === 0) {
      return res.status(404).json({ msg: "Request not found" });
    }

    const { Sender_ID, Vehicle_ID } = requestRows[0];
    const Manager_ID = req.manager.ManagerID;

    // Insert into requesthistory
    await db.query(
      `INSERT INTO requesthistory (Req_ID,Sender_ID, Manager_ID, Vehicle_ID, Status, Comment)
           VALUES ( ?,?, ?, ?, 'modification_requested', ?)`,
      [Req_ID,Sender_ID, Manager_ID, Vehicle_ID, Comment]
    );
    await db.query(
      `UPDATE request 
       SET Status = 'modification_requested', Comment = ? , Manager_ID = ?
       WHERE Req_ID = ?`,
      [Comment, Manager_ID, Req_ID]
    );

 const [senderEmail] = await db.query(
      "SELECT Email FROM uservehiclerequestview WHERE Req_ID = ?",
      [Req_ID]
    );

    const { Email } = senderEmail[0];

res.status(200).json({
      msg: "Request updated with modification_requested status",
      email: Email
    });
  } catch (error) {
    console.error("Error updating request:", error);
    res.status(500).json({ msg: "Server error" });
  }
}
