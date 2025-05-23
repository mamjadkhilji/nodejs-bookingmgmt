const express = require('express');
const debug = require('debug')('app:server');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/swagger');

const bookingRouter = require('./src/routes/bookingRouter')();
const slotRouter = require('./src/routes/slotRouter')();

const connectDB = require('./src/services/dbConnection');

 connectDB.connectDB();

const app = express(); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || 'localhost';

app.use('/api/bookings', bookingRouter);
app.use('/api/slots', slotRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Booking Managemnet Sysem APIs</h1>');
});   

app.listen(PORT, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
