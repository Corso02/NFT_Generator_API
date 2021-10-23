let express = require("express")
let app = express()
let fileHandler = require("express-fileupload")
let cors = require("cors")
let mainController = require("./controllers/index.controller")

app.use(cors())
app.use(express.json())

app.use(fileHandler({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}))

app.post("/upload", mainController.upload)

app.get("/", (req, res) => {
    res
     .status(200)
     .send("Hello world")
})



app.listen(5000, () => {
    console.log(`Listening on port 5000....`)
})