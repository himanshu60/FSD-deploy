const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");

const { connection } = require("./config/db")
const { userRouter } = require("./routes/user.route")
const { noteRouter } = require("./routes/note.route")
const { authenticate } = require("./middlewares/authenticate")

const swaggerUI = require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc")

// specifications
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Learning Swagger",
            version: "1.0.0"
        },
        servers: [
            {
                url: "http://localhost:4500"
            }
        ]
    },
    apis: ["./routes/*.js"]
}

const swaggerSpec = swaggerJsDoc(options)
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec))


app.use(express.json());
app.use(cors())

app.get("/",(req,res)=>{
    res.send(`<h1>Home page Here</h1>`);
})

app.use("/users", userRouter);
app.use(authenticate);
app.use("/notes", noteRouter);




app.listen(process.env.port, async () => {
    try {
        await connection
        console.log("Connected to mongoAtlas")
    } catch (error) {
        console.log(error)
    }
    console.log(`port is running at ${process.env.port}`)
})