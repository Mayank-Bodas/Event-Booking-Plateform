const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const { connectRabbitMQ } = require('./config/rabbitmq');
const paymentRoutes = require('./routes/payment.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/v1/payments', paymentRoutes);

async function startServer() {
    await connectRabbitMQ();
    app.listen(PORT, () => {
        console.log(`Payment Service running on port ${PORT}`);
    });
}

startServer();
