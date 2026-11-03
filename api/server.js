const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

const userRouter = require('./routes/userRoute.js');


dotenv.config();

const PORT = process.env.PORT;

const app = express();


mongoose.connect(process.env.DB_STRING)
.then(() => {
	console.log('Successfully established a connection from Database!');
})
.catch((err) => {
	console.log(`Database connection error: ${err}`);
})


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());




app.use('/users', userRouter);





app.listen(PORT, () => {
	console.log(`Server connected at Port:${PORT}`);
})


