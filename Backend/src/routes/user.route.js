// import express from "express";
// import { protectRoute } from "../middleware/auth.middleware.js";
// // import { sendFriendRequest } from "c:/Users/Ramu/AppData/Local/Temp/bbe75109-525f-4ab8-a64e-e9afca681458_streamify-video-calls-master.zip.458/streamify-video-calls-master/backend/src/controllers/user.controller.js";
// import {sendFriendRequest} from "../controllers/user.controller.js";

// const router=express.Router();

// router.use(protectRoute);
// router.get("/",getRecommendedUsers);

// router.get("/friends",getMyFriends);
// router.post("/friend-request/:id",sendFriendRequest)
// router.post("/friend-request/:id/accept",acceptFriendRequest)

// router.post("/friend-requests",getFriendRequests);

// router.post("/outgoing-friend-requests",getOutgoingFriendReqs);


// export default router;
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  acceptFriendRequest,
  getFriendRequests,
  getMyFriends,
  getOutgoingFriendReqs,
  getRecommendedUsers,
  sendFriendRequest,
} from "../controllers/user.controller.js";

const router = express.Router();

// apply auth middleware to all routes
router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);

export default router;
