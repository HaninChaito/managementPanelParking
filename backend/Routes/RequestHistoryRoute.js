import express from "express";
import { GetManager, GetRequestsHistory, GetUser, GetVehicle } from "../Controllers/RequestHistory.js";
import verifyUser from "../middlewares/VerifyUser.js";

const router = express.Router();

router.get("/GetHistory", verifyUser, GetRequestsHistory);
router.get("/user",GetUser);
router.get("/manager",GetManager);
router.get("/vehicle",GetVehicle);

export default router;
