const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const User = require('../models/user');
require('dotenv').config();

// @route   GET api/subscription/
// @desc    Get list of Plans
// @access  Protected
exports.plans = async (req, res) => {
    try {
        const prices = await stripe.prices.list({ product: process.env.STRIPE_SUBSCRIPTION_PRODUCT });
        console.log(prices);
        const plans = prices.data.map(price => {
            return {
                id: price.id,
                amount: price.unit_amount / 100,
                currency: price.currency,
                interval: price.recurring.interval,
                interval_count: price.recurring.interval_count,
            }
        });

        res.json(plans);
    } catch (error) {
        
    }

}

// @route   POST api/subscription/
// @desc    Create a subscription
// @access  Protected
exports.subscribe = async (req, res) => {
    try {
        if (req.user.isSubscribed) {
            return res.status(400).json({
                errors: [
                    {
                        msg: 'User already subscribed'
                    }
                ]
            });
        }
        const priceId = req.body.priceId;
        const session = await stripe.checkout.sessions.create({
            customer: req.user.stripeId,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [{
                price: priceId,
                // For metered billing, do not pass quantity
                quantity: 1,
            }],
            success_url: `${process.env.HOST}/success`,
            cancel_url: `${process.env.HOST}/cancel`,
        });
        res.json(session);
        // res.status(303).redirect(session.url);

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).send(error.message);
    }
}

// @route   POST api/subscription/webhook
// @desc    Stripe webhook
// @access  Protected
exports.webhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_SIGNING_SECRET;
    let event = req.body;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        const { customer } = event.data.object
        let user;
        // Handle the event
        switch (event.type) {
            case 'customer.subscription.created':
                console.log('💰 subscription created');
                user = await User.findOne({stripeId: customer}, "isSubscribed");
                user.isSubscribed = true;
                await user.save();
                break;
            case 'customer.subscription.deleted':
                console.log('💰 subscription cancelled');
                user = await User.findOne({stripeId: customer}, "isSubscribed");
                user.isSubscribed = false;
                await user.save();
                break;
            case 'customer.subscription.updated':
                console.log('💰 subscription updated');
                user = await User.findOne({stripeId: customer}, "isSubscribed");
                user.isSubscribed = true;
                await user.save();
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
                return res.status(400).send(`Unhandled event type ${event.type}`);
        }
    
        // Return a response to acknowledge receipt of the event
        res.json({received: true});
    }
    catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
}


exports.portal = async (req, res) => {
    try {
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: req.user.stripeId,
            return_url: process.env.HOST,
        });
        res.json(portalSession);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}
