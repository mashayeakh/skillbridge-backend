import express from "express";
// import cors from "cors";

// const app = express();

export const app = express();

app.use(express.json());


//root route
app.get("/", (req, res) => {
    res.send("Hello Backend!");
})