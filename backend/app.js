import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors'
import morgan from 'morgan';
import pool from './config/db.js';
import cookieParser from 'cookie-parser';
//Routes
import ordersRoute from './router/ordersRoute.js';
import productsRoute from './router/productsRoute.js';
//import registerRoute from './router/registerRoute.js';
import cartRoute from './router/cartRoute.js';
//import loginRoute from './router/loginRoute.js';
import authRoute from './router/authRoute.js';
import deliveryOptionRoute from './router/deliveryOptionRoute.js';
import { validateToken } from './middleware/createTokens.js';
//middleware
import errorHandler from './middleware/error.js';
import notFound from './middleware/notFound.js';



//initialize express
const app=express();

//middleware
app.use(cors({
    origin: ["http://localhost:5501", "http://127.0.0.1:5501",
        "http://localhost:5500","http://127.0.0.1:5500",
    ],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use((req,res,next)=>{
    console.log(req.method, req.url);
    next();
});
//test root route
app.get('/', (req, res) => {
  res.send('Server working');
});
app.use((req, res, next) => {
  console.log('Incoming:', req.method, req.url);
  next();
});

//routes
app.use('/api/orders',ordersRoute);
app.use('/api/products',productsRoute);
app.use('/api/cart',cartRoute);
//app.use('/api/auth/',registerRoute);
app.use('/api/auth/',authRoute);
app.use('/api/delivery',deliveryOptionRoute);


//errorHandler
app.use(errorHandler);
app.use(notFound);

//Test Database Connection
async function testDB() {
    try {
        const [rows]=await pool.query('select 1');
        console.log('Database connected successfully');
    } catch(error){
        console.error('Database connection failed',error)
    }
    
}
testDB();

const port=process.env.PORT||8000;

app.listen(port,()=>{
    console.log(`listenning on port ${port}`);
})