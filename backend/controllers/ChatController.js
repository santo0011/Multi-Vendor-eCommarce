
const sellerModel = require('../models/sellerModel');
const customerModel = require('../models/customerModel');
const sellerCustomerModel = require('../models/chat/sellerCustomerModel');
const sellerCustomerMessage = require('../models/chat/sellerCustomerMessage');
const { responseReturn } = require('../utiles/response');


class chatController {
    add_customer_friend = async (req, res) => {
        const { sellerId, userId } = req.body;

        try {
            if (sellerId !== '') {
                const seller = await sellerModel.findById(sellerId)
                const user = await customerModel.findById(userId)
                const checkSeller = await sellerCustomerModel.findOne({
                    $and: [{
                        mId: {
                            $eq: userId
                        }
                    }, {
                        myFriends: {
                            $elemMatch: {
                                fdId: sellerId
                            }
                        }
                    }]
                })

                if (!checkSeller) {
                    await sellerCustomerModel.updateOne({
                        mId: userId
                    }, {
                        $push: {
                            myFriends: {
                                fdId: sellerId,
                                name: seller.shopInfo?.shopName,
                                image: seller.image
                            }
                        }
                    })
                }

                const checkCustomer = await sellerCustomerModel.findOne({
                    $and: [{
                        mId: {
                            $eq: sellerId
                        }
                    }, {
                        myFriends: {
                            $elemMatch: {
                                fdId: userId
                            }
                        }
                    }]
                })

                if (!checkCustomer) {
                    await sellerCustomerModel.updateOne({
                        mId: sellerId
                    }, {
                        $push: {
                            myFriends: {
                                fdId: userId,
                                name: user.name,
                                image: ""
                            }
                        }
                    })
                }

                // message
                const message = await sellerCustomerMessage.find({
                    $or: [
                        {
                            $and: [{
                                receverId: { $eq: sellerId }
                            }, {
                                senderId: {
                                    $eq: userId
                                }
                            }]
                        },
                        {
                            $and: [{
                                receverId: { $eq: userId }
                            }, {
                                senderId: {
                                    $eq: sellerId
                                }
                            }]
                        }
                    ]
                })

                const MyFriends = await sellerCustomerModel.findOne({
                    mId: userId
                });

                const currentFd = MyFriends.myFriends.find(s => s.fdId === sellerId);
                responseReturn(res, 200, {
                    myFriends: MyFriends.myFriends,
                    currentFd,
                    message
                });

            } else {
                const MyFriends = await sellerCustomerModel.findOne({
                    mId: userId
                });
                responseReturn(res, 200, {
                    myFriends: MyFriends.myFriends
                })
            }

        } catch (error) {
            console.log(error.message)
        }

    }


    // customer_message_add
    customer_message_add = async (req, res) => {
        const { userId, text, sellerId, name } = req.body;
        try {

            const message = await sellerCustomerMessage.create({
                senderId: userId,
                senderName: name,
                receverId: sellerId,
                message: text
            });

            const data = await sellerCustomerModel.findOne({ mId: userId })
            let myFriends = data.myFriends;
            let index = myFriends.findIndex(f => f.fdId === sellerId)
            while (index > 0) {
                let temp = myFriends[index]
                myFriends[index] = myFriends[index - 1]
                myFriends[index - 1] = temp
                index--
            }
            await sellerCustomerModel.updateOne({ mId: userId }, { myFriends })

            const data1 = await sellerCustomerModel.findOne({ mId: sellerId })
            let myFriends1 = data1.myFriends
            let index1 = myFriends1.findIndex(f => f.fdId === userId)

            while (index1 > 0) {
                let temp1 = myFriends1[index1]
                myFriends1[index1] = myFriends1[index1 - 1]
                myFriends1[index1 - 1] = temp1
                index1--
            }

            await sellerCustomerModel.updateOne({ mId: sellerId }, { myFriends1 })

            responseReturn(res, 201, { message })

        } catch (error) {
            console.log(error.message)
        }
    }

    // get_customers
    get_customers = async (req, res) => {
        const { sellerId } = req.params;

        try {
            const data = await sellerCustomerModel.findOne({ mId: sellerId });
            responseReturn(res, 200, {
                customers: data.myFriends
            });

        } catch (error) {
            console.log(error.message)
        }
    }

    // get_customer_seller_message
    get_customer_seller_message = async (req, res) => {
        const { customerId } = req.params
        const { id } = req;
        try {
            const messages = await sellerCustomerMessage.find({
                $or: [
                    {
                        $and: [{
                            receverId: { $eq: customerId }
                        }, {
                            senderId: {
                                $eq: id
                            }
                        }]
                    },
                    {
                        $and: [{
                            receverId: { $eq: id }
                        }, {
                            senderId: {
                                $eq: customerId
                            }
                        }]
                    }
                ]
            })

            const currentCustomer = await customerModel.findById(customerId);

            responseReturn(res, 200, { messages, currentCustomer });

        } catch (error) {
            console.log(error.message)
        }
    }


    // seller_message_add
    seller_message_add = async (req, res) => {
        const { senderId, text, receverId, name } = req.body;

        try {
            const message = await sellerCustomerMessage.create({
                senderId: senderId,
                senderName: name,
                receverId: receverId,
                message: text
            });

            const data = await sellerCustomerModel.findOne({ mId: senderId });
            let myFriends = data.myFriends;
            let index = myFriends.findIndex(f => f.fdId === receverId);
            while (index > 0) {
                let temp = myFriends[index]
                myFriends[index] = myFriends[index - 1]
                myFriends[index - 1] = temp
                index--
            }
            await sellerCustomerModel.updateOne({ mId: senderId }, { myFriends });


            const data1 = await sellerCustomerModel.findOne({ mId: receverId });
            let myFriends1 = data1.myFriends;
            let index1 = myFriends1.findIndex(f => f.fdId === senderId);
            while (index1 > 0) {
                let temp1 = myFriends1[index1]
                myFriends1[index1] = myFriends1[index1 - 1]
                myFriends1[index1 - 1] = temp1
                index1--
            }
            await sellerCustomerModel.updateOne({ mId: receverId }, { myFriends1 });

            responseReturn(res, 201, { message })

        } catch (error) {
            console.log(error.message)
        }

    }

}

module.exports = new chatController();