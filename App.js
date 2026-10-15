import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDb from './config/db.js'
import router from './route/userRoute.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(router)

const PORT = process.env.PORT

app.get('/', (req, res) => {
    res.send("Backend run successfully")
})

connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`App is running on port localhost://${PORT}`)
    })
})