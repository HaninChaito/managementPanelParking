import express from "express";
import verifyUser from "../middlewares/VerifyUser.js";
import { AddVehicle, uploadFields } from "../Controllers/Vehicle.js";
import { SendVisitorForm } from "../Controllers/VisitorRequest.js";




const router = express.Router();

router.post("/SendVisitorRequest", verifyUser, uploadFields , AddVehicle , SendVisitorForm);

export default router;