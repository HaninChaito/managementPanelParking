import db from "../database.js";


  export async function SendVisitorForm(req, res){

    const Manager_ID = req.manager.ManagerID;

    const Vehicle_ID = req.vehicleId ;
  
    const {
       GuestName , GuestPhone , Purpose , EntryDate , EntryTime , ExitDate
    } = req.body;
  
    
  
    try {
      await db.query  (
        `INSERT INTO GuestRequest (
            ManagerId , Vehicle_ID , GuestName , GuestPhone , Purpose , EntryDate , EntryTime , ExitDate)
       VALUES (? , ? , ? , ? , ? , ? ,? ,? )`,
       [Manager_ID , Vehicle_ID , GuestName , GuestPhone , Purpose , EntryDate , EntryTime , ExitDate]
       ) ;
  
  
      res.status(200).json({ message: 'Visitor Request submitted successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error.' });
    }
  }
  

