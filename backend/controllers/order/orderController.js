const customerOrder = require("../../models/customerOrder");
const authorModel = require("../../models/authOrder");
const cardModel = require("../../models/cardModel");
const myShopWallet = require('../../models/myShopWallet')
const sellerWallet = require('../../models/sellerWallet')


const moment = require('moment');
const { responseReturn } = require("../../utiles/response");
const { mongo: { ObjectId } } = require('mongoose');
const authOrderModel = require("../../models/authOrder");
const stripe = require('stripe')('sk_test_51NolxnKPP1hRVgwQwLXf3T7JVd4gf61I5MDrvWsyenrkWAyU945OOGDOXXeszMaq5DZVinMX6ls2imgp06QNTim500SHxDu7t0')


class orderController {

    paymentCheck = async (id) => {
        try {
            const order = await customerOrder.findById(id);
            if (order.payment_status === 'unpaid') {
                await customerOrder.findByIdAndUpdate(id, {
                    delivery_status: 'cancelled'
                });
                await authorModel.updateMany({ orderId: id }, {
                    delivery_status: 'cancelled'
                })
            }
            return true;
        } catch (error) {
            console.log(error.message)
        }
    }

    place_order = async (req, res) => {
        const { price, products, shipping_fee, shippingInfo, userId } = req.body;

        let authorOrderData = [];
        let cardId = [];
        const tempDate = moment(Date.now()).format('LLL');

        let customerOrderProduct = [];

        for (let i = 0; i < products.length; i++) {
            const pro = products[i].products;
            for (let j = 0; j < pro.length; j++) {
                let tempCusPro = pro[j].productInfo;
                customerOrderProduct.push(tempCusPro);
                if (pro[j]._id) {
                    cardId.push(pro[j]._id)
                }
            }
        }


        try {
            const order = await customerOrder.create({
                customerId: userId,
                shippingInfo,
                products: customerOrderProduct,
                price: price + shipping_fee,
                delivery_status: 'pending',
                payment_status: 'unpaid',
                date: tempDate
            })
            for (let i = 0; i < products.length; i++) {
                const pro = products[i].products
                const pri = products[i].price
                const sellerId = products[i].sellerId
                let storePro = []
                for (let j = 0; j < pro.length; j++) {
                    let tempPro = pro[j].productInfo
                    tempPro.quantity = pro[j].quantity
                    storePro.push(tempPro)
                }

                authorOrderData.push({
                    orderId: order.id,
                    sellerId,
                    products: storePro,
                    price: pri,
                    payment_status: 'unpaid',
                    shippingInfo: 'Dhaka myshop Warehouse',
                    delivery_status: 'pending',
                    date: tempDate
                })
            }
            await authorModel.insertMany(authorOrderData)

            for (let k = 0; k < cardId.length; k++) {
                await cardModel.findByIdAndDelete(cardId[k])
            }

            setTimeout(() => {
                this.paymentCheck(order.id)
            }, 100000)

            responseReturn(res, 201, { message: "Order place success", orderId: order.id });

        } catch (error) {
            console.log(error.message)
        }

    }

    // get_customer_databorad_data
    get_customer_databorad_data = async (req, res) => {
        const { userId } = req.params;
        try {
            const recentOrders = await customerOrder.find({
                customerId: new ObjectId(userId)
            }).limit(5);
            const pendingOrder = await customerOrder.find({
                customerId: new ObjectId(userId),
                delivery_status: 'pending'
            }).countDocuments();
            const totalOrder = await customerOrder.find({
                customerId: new ObjectId(userId)
            }).countDocuments();
            const cancelledOrder = await customerOrder.find({
                customerId: new ObjectId(userId),
                delivery_status: "cancelled"
            }).countDocuments();

            responseReturn(res, 200, {
                recentOrders,
                pendingOrder,
                totalOrder,
                cancelledOrder
            });

        } catch (error) {
            console.log(error.message)
        }
    }

    // get_orders
    get_orders = async (req, res) => {
        const { customerId, status } = req.params;
        try {

            let orders = [];
            if (status !== 'all') {
                orders = await customerOrder.find({
                    customerId: new ObjectId(customerId),
                    delivery_status: status
                })
            } else {
                orders = await customerOrder.find({
                    customerId: new ObjectId(customerId)
                })
            }
            responseReturn(res, 200, {
                orders
            });

        } catch (error) {
            console.log(error.message)
        }
    }

    // get_order
    get_order = async (req, res) => {
        const { orderId } = req.params;
        try {
            const order = await customerOrder.findById(orderId);
            responseReturn(res, 200, {
                order
            })
        } catch (error) {
            console.log(error.message)
        }
    }

    // create_payment
    create_payment = async (req, res) => {
        const { price } = req.body;
        try {
            const payment = await stripe.paymentIntents.create({
                amount: price * 100,
                currency: 'usd',
                automatic_payment_methods: {
                    enabled: true
                }
            });

            responseReturn(res, 200, { clientSecret: payment.client_secret })

        } catch (error) {
            console.log(error.message)
        }
    }

    // order_confirm
    order_confirm = async (req, res) => {
        const { orderId } = req.params;

        try {
            await customerOrder.findByIdAndUpdate(orderId, { payment_status: 'paid', delivery_status: "pending" })
            await authOrderModel.updateMany({ orderId: new ObjectId(orderId) }, {
                payment_status: "paid", delivery_status: 'pending'
            });
            const cuOrder = await customerOrder.findById(orderId);

            const auOrder = await authOrderModel.find({
                orderId: new ObjectId(orderId)
            });

            const time = moment(Date.now()).format('l');
            const splitTime = time.split('/')

            await myShopWallet.create({
                amount: cuOrder.price,
                manth: splitTime[0],
                year: splitTime[1]
            });

            for (let i = 0; i < auOrder.length; i++) {
                await sellerWallet.create({
                    sellerId: auOrder[i].sellerId.toString(),
                    amount: auOrder[i].price,
                    manth: splitTime[0],
                    year: splitTime[1]
                })

            }
            responseReturn(res, 200, { message: 'success' })
        } catch (error) {
            console.log(error.message)
        }
    }


    // get_admin_orders
    get_admin_orders = async (req, res) => {
        let { page, parPage, searchValue } = req.query
        page = parseInt(page)
        parPage = parseInt(parPage)
        const skipPage = parPage * (page - 1)

        try {

            if (searchValue) {

            } else {
                const orders = await customerOrder.aggregate([
                    {
                        $lookup: {
                            from: 'authorOrders',
                            localField: '_id',
                            foreignField: 'orderId',
                            as: 'suborder'
                        }
                    }
                ]).skip(skipPage).limit(parPage).sort({ createdAt: -1 });

                responseReturn(res, 200, { orders, totalOrder: orders.length })
            }

        } catch (error) {
            console.log(error.message)
        }

    }

    // get_admin_order
    get_admin_order = async (req, res) => {
        const { orderId } = req.params;

        try {
            const order = await customerOrder.aggregate([
                {
                    $match: { _id: new ObjectId(orderId) }
                }, {
                    $lookup: {
                        from: 'authororders',
                        localField: '_id',
                        foreignField: 'orderId',
                        as: 'suborder'
                    }
                }
            ])
            responseReturn(res, 200, { order: order[0] })

        } catch (error) {
            console.log(error.message)
        }
    }

    // admin_order_status_update
    admin_order_status_update = async (req, res) => {
        const { orderId } = req.params;
        const { status } = req.body;

        try {
            await customerOrder.findByIdAndUpdate(orderId, {
                delivery_status: status
            })
            responseReturn(res, 200, { message: 'Order status change success' })
        } catch (error) {
            responseReturn(res, 500, { message: 'Internal server error' })
        }
    }


    // get_seller_orders
    get_seller_orders = async (req, res) => {
        const { sellerId } = req.params;
        let { page, parPage, searchValue } = req.query;
        page = parseInt(page)
        parPage = parseInt(parPage)
        const skipPage = parPage * (page - 1)

        try {

            if (searchValue) {

            } else {
                const orders = await authOrderModel.find({
                    sellerId,
                }).skip(skipPage).limit(parPage).sort({ createdAt: -1 })
                responseReturn(res, 200, { orders, totalOrder: orders.length })
            }

        } catch (error) {
            console.log(error.message)
        }
    }


    // get_seller_order
    get_seller_order = async (req, res) => {
        const { orderId } = req.params;

        try {
            const order = await authOrderModel.findById(orderId)
            responseReturn(res, 200, { order })
        } catch (error) {
            console.log(error.message)
        }
    }


    // seller_order_status_update
    seller_order_status_update = async (req, res) => {
        const { orderId } = req.params;
        const { status } = req.body;

        try {

            await authOrderModel.findByIdAndUpdate(orderId, {
                delivery_status: status
            })
            responseReturn(res, 200, { message: 'Order status change success' })

        } catch (error) {
            responseReturn(res, 500, { message: 'Internal server error' })
        }
    }

}

module.exports = new orderController();