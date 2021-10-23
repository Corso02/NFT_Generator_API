let express = require("express")

let app = express()

app.get("/", (req, res) => {
    res
     .status(200)
     .send("Hello world")
})

app.listen(5000, () => {
    console.log(`Listening on port 5000....`)
})