const { responseReturn } = require("../../utiles/response");
const customerModel = require('../../models/customerModel');
const bcrypt = require('bcrypt');
const sellerCustomerModel = require('../../models/chat/sellerCustomerModel');
const { createToken } = require('../../utiles/tokenCreate')


class customerAuthController {

    customer_register = async (req, res) => {
        const { name, email, password } = req.body;

        try {
            const customer = await customerModel.findOne({ email });
            if (customer) {
                responseReturn(res, 404, { error: 'Email already exists' })
            } else {
                const createCustomer = await customerModel.create({
                    name: name.trim(),
                    email: email.trim(),
                    password: await bcrypt.hash(password, 10),
                    method: 'menualy'
                });

                await sellerCustomerModel.create({
                    mId: createCustomer.id
                });

                const token = await createToken({
                    id: createCustomer.id,
                    name: createCustomer.name,
                    email: createCustomer.email,
                    method: createCustomer.method
                });

                res.cookie('customerToken', token, {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                });
                responseReturn(res, 201, { message: "Register success", token })
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    // customer_login
    customer_login = async (req, res) => {
        const { email, password } = req.body;
        try {
            const customer = await customerModel.findOne({ email }).select('+password')
            if (customer) {
                const match = await bcrypt.compare(password, customer.password)
                if (match) {
                    const token = await createToken({
                        id: customer.id,
                        name: customer.name,
                        email: customer.email,
                        method: customer.method
                    })
                    res.cookie('customerToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    })
                    responseReturn(res, 201, { message: 'Login success', token })
                } else {
                    responseReturn(res, 404, { error: "Password wrong" })
                }
            } else {
                responseReturn(res, 404, { error: 'Email not found' })
            }
        } catch (error) {
            console.log(error.message)
        }
    }


    // customer_logout
    customer_logout = async (req, res) => {
        try {
            res.cookie('customerToken', "", {
                expires: new Date(Date.now()),
                httpOnly: true
            });
            responseReturn(res, 200, { message: "Logout success" })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }
}

module.exports = new customerAuthController();