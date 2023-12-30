const express = require("express");
const cors = require("cors");

const app = express();
const port = 5500;

//json middleware to extract json data
app.use(express.json());

app.use(cors());

let authMiddleware = require("./middleware/authMiddleware");
//user routes middleware file
const userRoute = require("./routes/userRoute");

//question routes middleware file
const questionRoute = require("./routes/questionRoute");

//answer routes middleware file
const answerRoute = require("./routes/answerRoute");

// db connection
let dbConnection = require("./db/dbConfig");

// app.get("/", (req, res) => {
//     res.send("hello world!");
// });

//user routes middleware
app.use("/api/users", userRoute);

//question routes middleware
app.use("/api/questions", authMiddleware, questionRoute);

//routes answer middleware
app.use("/api/answer", authMiddleware, answerRoute);

// app.listen(port, (err) => {
//     if (err) {
//         console.log(err.message);
//     } else {
//         console.log(`listening on port number ${port} `);
//     }
// });

async function start() {
    try {
        const result = await dbConnection.execute("select 'test' ");
        app.listen(port);
        console.log(`listening on ${port}`);
        console.log("database connected!");
    } catch (error) {
        console.log(error.message);
    }
}
start();
