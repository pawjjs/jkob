import { Router } from "express";

export function createUserRouter(userController) {
        const router = Router();
        router.post("/register", userController.registerUser);
        return router;
}