import express from "express";
import {
  AcceptRequest,
  DeclineRequest,
  EditRequest,
  GetModifiedRequests,
  GetPendingRequests,
} from "../Controllers/RequestsTable.js";
import verifyUser from "../middlewares/VerifyUser.js";




const router = express.Router();

router.get("/PendingRequests", verifyUser ,GetPendingRequests);
router.get("/ModifiedRequests", verifyUser ,GetModifiedRequests);
router.post("/AcceptRequest", verifyUser, AcceptRequest);
router.post("/DeclineRequest", verifyUser , DeclineRequest);
router.post("/EditRequest",verifyUser , EditRequest);


export default router;
