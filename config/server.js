import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDb from "./config/db.js";
import router from "./route/userRoute.js";

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(router);

// Home
app.get("/", (req, res) => {
    res.send("Backend run successfully");
});

// Database + Server
connectDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(
                `App is running on http://localhost:${PORT}`
            );
        });
    })
    .catch((error) => {
        console.log(
            "Server not started because database connection failed."
        );
    });
