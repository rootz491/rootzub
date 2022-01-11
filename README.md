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