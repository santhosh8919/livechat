import express from "express";
import { login, logout, onboard,signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

    router.post("/signup",signup);
    router.post("/login",login);
    router.post("/logout",logout);

    router.post("/onboarding",protectRoute,onboard);
 


    router.get("/me", (req, res) => {
        if (!req.cookies.jwt) {
            return res.status(200).json({ success: true, user: null });
        }

        return protectRoute(req, res, () => {
            res.status(200).json({ success: true, user: req.user });
        });
    });
   

export default router;
 