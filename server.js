import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
const port = process.env.PORT;

app.use(express());

app.listen(port, () => console.log(`Server is running on port ${port}`));
