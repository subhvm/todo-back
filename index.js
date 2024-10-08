const express = require('express');
const dotenv = require('dotenv');
const PORT = process.env.PORT ||6000
const app = express();
const cors = require('cors');
const mongoose = require("mongoose");
dotenv.config();
const Todo = require('./models/todoModel');
app.use(express.json());
app.use(cors());

mongoose
    .connect(process.env.MONGO_URI)
    .then(()=> console.log("Database Connected"))
    .catch((err)=> console.error("MongoDB connection error :", err));

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})

app.use('/api/auth', require('./routes/authRoute'));
app.use('/api/todo', require('./routes/todoRoute'));

app.get("/",(req,res)=>{
    res.send("Server Running")
});