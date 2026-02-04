const razorpay = require('../services/razorpay.service');
const { publishPaymentVerified } = require('../config/rabbitmq');
const crypto = require('crypto');

async function createOrder(req, res) {
    try {
        const { amount, currency = 'INR', receipt, notes } = req.body;

        const options = {
            amount: amount * 100, // Razorpay works in paise
            currency,
            receipt,
            notes,
        };

        const order = await razorpay.orders.create(options);
        res.json({
            ...order,
            keyId: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

async function verifyPayment(req, res) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, ticketTypeId } = req.body;

        const body = razorpay_order_id + '|' + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Payment verification successful

            // Publish event
            const paymentData = {
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                userId: userId,
                ticketTypeId: ticketTypeId,
                status: 'SUCCESS'
            };

            await publishPaymentVerified(paymentData);

            res.json({ status: 'success', message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ status: 'failure', message: 'Invalid signature' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { createOrder, verifyPayment };
