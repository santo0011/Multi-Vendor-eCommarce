
const striptModel = require('../../models/stripeModel');
const sellerModel = require('../../models/sellerModel');
const sellerWallet = require('../../models/sellerWallet');
const withdrowRequest = require('../../models/withdrowRequest');
const { mongo: { ObjectId } } = require('mongoose')

const { v4: uuidv4 } = require('uuid');
const { responseReturn } = require('../../utiles/response');
const stripe = require('stripe')('sk_test_51NolxnKPP1hRVgwQwLXf3T7JVd4gf61I5MDrvWsyenrkWAyU945OOGDOXXeszMaq5DZVinMX6ls2imgp06QNTim500SHxDu7t0')


class paymentController {

    //    create_stripe_connect_account
    create_stripe_connect_account = async (req, res) => {
        const { id } = req;
        const uid = uuidv4();

        try {
            const stripeInfo = await striptModel.findOne({ sellerId: id });

            if (stripeInfo) {
                await striptModel.deleteOne({ sellerId: id });

                // Create a new Stripe Express account
                const account = await stripe.accounts.create({ type: 'express' });

                // Generate an account link to connect the Stripe account
                const accountLink = await stripe.accountLinks.create({
                    account: account.id,
                    refresh_url: 'http://localhost:3000/',
                    return_url: `http://localhost:3000/success?activeCode=${uid}`,
                    type: 'account_onboarding'
                });

                await striptModel.create({
                    sellerId: id,
                    stripeId: account.id,
                    code: uid
                });

                responseReturn(res, 201, { url: accountLink.url })


            } else {
                // Create a new Stripe Express account
                const account = await stripe.accounts.create({ type: 'express' });

                // Generate an account link to connect the Stripe account
                const accountLink = await stripe.accountLinks.create({
                    account: account.id,
                    refresh_url: 'http://localhost:3000/refresh',
                    return_url: `http://localhost:3000/success?activeCode=${uid}`,
                    type: 'account_onboarding'
                });

                await striptModel.create({
                    sellerId: id,
                    stripeId: account.id,
                    code: uid
                });

                responseReturn(res, 201, { url: accountLink.url })

            }

        } catch (error) {
            console.log(error.message)
        }
    }


    // active_stripe_connect_account
    active_stripe_connect_account = async (req, res) => {
        const { activeCode } = req.params;
        const { id } = req;
        try {
            const userStripeInfo = await striptModel.findOne({ code: activeCode });

            if (userStripeInfo) {
                await sellerModel.findByIdAndUpdate(id, {
                    payment: 'active'
                });
                responseReturn(res, 200, { message: "Payment active" })
            } else {
                responseReturn(res, 404, { error: "Payment active faild" })
            }

        } catch (error) {
            responseReturn(res, 500, { error: "Internal server error" })
        }
    }

    sunAmount = (data) => {
        let sum = 0;

        for (let i = 0; i < data.length; i++) {
            sum = sum + data[i].amount
        }
        return sum;
    }


    // get_seller_payemt_details
    get_seller_payemt_details = async (req, res) => {
        const { sellerId } = req.params;
        try {
            const payments = await sellerWallet.find({ sellerId });
            const pendingWithdrows = await withdrowRequest.find({
                $and: [
                    {
                        sellerId: {
                            $eq: sellerId
                        }
                    }, {
                        status: {
                            $eq: "pending"
                        }
                    }
                ]
            });

            const successWithdrows = await withdrowRequest.find({
                $and: [
                    {
                        sellerId: {
                            $eq: sellerId
                        }
                    }, {
                        status: {
                            $eq: "success"
                        }
                    }
                ]
            });

            const pendingAmount = this.sunAmount(pendingWithdrows)
            const withdrowAmount = this.sunAmount(successWithdrows)
            const totalAmount = this.sunAmount(payments)

            let availableAmount = 0;
            if (totalAmount > 0) {
                availableAmount = totalAmount - (pendingAmount + withdrowAmount)
            }

            responseReturn(res, 200, {
                pendingAmount,
                withdrowAmount,
                totalAmount,
                successWithdrows,
                pendingWithdrows,
                availableAmount
            });

        } catch (error) {
            console.log(error.message)
        }
    }

    // withdrowal_request
    withdrowal_request = async (req, res) => {
        const { amount, sellerId } = req.body;
        try {
            const withdrowal = await withdrowRequest.create({
                sellerId,
                amount: parseInt(amount)
            });
            responseReturn(res, 200, { withdrowal, message: "Withdrowal request send" })
        } catch (error) {
            responseReturn(res, 500, { error: 'Internal server error' })
        }
    }


    // get_payment_request
    get_payment_request = async (req, res) => {
        try {
            const withdrowalRequest = await withdrowRequest.find({ status: "pending" })
            responseReturn(res, 200, { withdrowalRequest })
        } catch (error) {
            responseReturn(res, 500, { message: 'Internal server error' })
        }
    }

    // payment_request_confirm
    payment_request_confirm = async (req, res) => {
        const { paymentId } = req.body;
        try {
            const payment = await withdrowRequest.findById(paymentId);
            const { stripeId } = await striptModel.findOne({
                sellerId: new ObjectId(payment.sellerId)
            });

            await stripe.transfers.create({
                amount: payment.amount * 100,
                currency: 'usd',
                destination: stripeId
            })
            await withdrowRequest.findByIdAndUpdate(paymentId, { status: 'success' })
            responseReturn(res, 200, { payment, message: "Request confirm success" })

        } catch (error) {
            responseReturn(res, 500, { error: 'Internal server error' })
        }
    }
}

module.exports = new paymentController();