const amqp = require('amqplib');

let channel;
const EXCHANGE_NAME = 'payment.exchange';
const EXCHANGE_TYPE = 'topic';

async function connectRabbitMQ() {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672');
        channel = await connection.createChannel();
        await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, { durable: true });
        console.log('Connected to RabbitMQ');
    } catch (error) {
        console.error('Error connecting to RabbitMQ', error);
        process.exit(1);
    }
}

function getChannel() {
    return channel;
}

async function publishPaymentVerified(paymentData) {
    if (!channel) {
        throw new Error('RabbitMQ channel not established');
    }
    const routingKey = 'payment.verified';
    channel.publish(EXCHANGE_NAME, routingKey, Buffer.from(JSON.stringify(paymentData)));
    console.log(`Published ${routingKey} event:`, paymentData);
}

module.exports = { connectRabbitMQ, getChannel, publishPaymentVerified };
