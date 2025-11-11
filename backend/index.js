import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import LoginRoute from "./Routes/LoginRoute.js"; 
import RequestTableRoute from "./Routes/RequestsTableRoute.js"
import VisitorRequestRoute from "./Routes/VisitorRequestRoute.js"
import RequestHistoryRoute from "./Routes/RequestHistoryRoute.js"
import ManagerRoute from "./Routes/managerRoute.js"

dotenv.config();



const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5174", // Frontend URL
    credentials: true,
  })
);
app.use(express.json()); // Parse JSON bodies

app.use('/uploads', express.static('uploads'));

app.use('/register' , LoginRoute );
app.use('/RequestTable' , RequestTableRoute) ;
app.use('/VistorRequest' , VisitorRequestRoute );
app.use('/RequestHistory' , RequestHistoryRoute );
app.use('/api/managers', ManagerRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
