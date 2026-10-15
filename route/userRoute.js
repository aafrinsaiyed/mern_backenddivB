import express from "express";

import {
    addUser,
    getUser,
    updateUser,
    deleteUser,
    getSingleUser,
    login
} from "../controller/userDataController.js";

import upload from "../middleware/fileUpload.js";

const router = express.Router();


router.post("/api/add-user", upload.single("image"), addUser);


router.post("/api/login", login);


router.get("/api/get-user", getUser);

router.get("/api/get-singleuser/:id", getSingleUser);

router.put("/api/update-user/:id", upload.single("image"), updateUser);


router.delete("/api/delete-user/:id", deleteUser);

export default router;