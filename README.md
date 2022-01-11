# rootzub

subscription based web application integrated with stripe!

## Features

*   JWT authentication for user login
    *   Signup with username, email & password: `POST` `/api/auth/signup`
    *   Login with email & password: `POST` `/api/auth/login`
    *   Refresh token: `POST` `/api/auth/refresh`

*   Stripe integration for payment
    *   Create customer: Created at the time of signup
    *   Get subscription plans: `GET` `/api/subscription` 
    *   Create subscription: `POST` `/api/subscription`
    *   Stripe customer portal: `GET` `/api/subscription/portal`
    *   Stripe webhook to update data after payment related actions: `/api/subscription/webhook`

*   User management
    *   Get all users: `GET` `/api/users`
    *   Get user by id: `GET` `/api/users/:id`
    *   Delete user: `DELETE` `/api/users/:id`

*   Secured API
    *   `/api/secured` - only authenticated users with activated subscription can access this endpoint.
    *   you can implement your paid features [here](routes/secured.js).


## Important

1.  If you're implement upon it, make sure to create a `.env` file with the following variables:
```
STRIPE_PRIVATE_KEY=api_key
STRIPE_SIGNING_SECRET=webhook_secret
STRIPE_SUBSCRIPTION_PRODUCT=product_id
MONGO_URI=mongodb
ADMIN_EMAIL=
JWT_SECRET=keyboard_cat
HOST=http://localhost:1337
```

2.  Create a stripe product with different prices for different subscription duration.
    *   You can also add multiple products but that will require some extra work. Let me know if you need this.

3.  Before accessing custoner portal via `/api/subscription/portal`, you need to configure your stripe customer portal settings: https://dashboard.stripe.com/test/settings/billing/portal


## Useful Links

*   stripe subscription webhook: https://stripe.com/docs/billing/subscriptions/webhooks
*   stripe `products` API: https://stripe.com/docs/api/products
*   stripe `prices` API: https://stripe.com/docs/api/prices
*   How Subscription Works: https://stripe.com/docs/billing/subscriptions/overview
*   Subscription events: https://stripe.com/docs/api/events/types#event_types-customer.subscription.created
*   stripe subscription integration walkthrough: https://stripe.com/docs/billing/subscriptions/build-subscription


##  Installation

install dependencies and run the server locally:
```sh
npm install
node app.js
```

to listen for stripe payment webhook events:
```sh
# install stripe cli if not already
brew install stripe
stripe login
# start a listener on webhook
stripe listen --forward-to http://localhost:1337/api/subscription/webhook
```

**NOTE**: Run the stripe listener in the background along with express server to successfully listen for events.

---

For any questions, please contact me at [@karansh491](https://twitter.com/karansh491)
chao ✌🏻