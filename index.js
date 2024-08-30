const express = require("express");
// const mainRouter=require("./routes/index")
// const userRouter =require("./routes/user");
const rootRouter = require("./routes/index");
const cors = require('cors')

const app=express();
const corsOptions = {
  origin: 'https://paytwin-frontend.vercel.app',
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json())

// app.use("/api/v1", mainRouter)
// app.use("api/v1/user",userRouter)
app.use("/api/v1", rootRouter);


app.get("/",(req,res)=>{
    res.json("hello");
})

app.listen(3000);


