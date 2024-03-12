//PACKAGES
// const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
// const parser = require("./middlewares/cloudinaryConfig");
const cors = require("cors");
const connectDB = require("./db/db");
const bodyParser = require("body-parser");
var morgan = require('morgan');
// Routes
const autheticationRoutes = require("./routes/autheticationRoutes");
const categoryRoutes = require("./routes/categoryRoute");
const merchantRoutes = require("./routes/merchantRoutes");
const productsRouters = require("./routes/productRoutes");
const ordersRoutes = require("./routes/ordersRoutes");
const customerRoutes = require("./routes/customerRoutes");
const adminRoutes = require("./routes/adminRoutes");
dotenv.config({ path: "./.env" });
connectDB();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('combined'))
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("API server  is running ....");
});


//ROUTES
app.use('/', autheticationRoutes);
app.use('/', categoryRoutes);
app.use('/', merchantRoutes);
app.use('/', productsRouters);
app.use('/', ordersRoutes);
app.use('/', customerRoutes);
app.use('/', adminRoutes);




//Starting server
const startServer = async () => {
    app.listen(process.env.PORT  || 6000, () => {
        console.log(`🚀 Server is Up on ${process.env.NODE_ENV} and Running on Port: ` + process.env.PORT || 6000);
    })
}

startServer().then(r => {
    console.log("Server Ready");
});

