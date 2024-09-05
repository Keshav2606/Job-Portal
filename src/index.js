import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: './.env'
})

const port = process.env.PORT;

connectDB()
.then(() => {
    app.listen(port, () => {
        console.log("Server is listening at Port: ", port);
    })
})
.catch((error) => {
    console.log("MongoDB Connection Error at server: ", error);
    process.exit(1); 
})

