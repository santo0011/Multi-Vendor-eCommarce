const cardModel = require('../../models/cardModel');
const { responseReturn } = require('../../utiles/response');
const { mongo: { ObjectId } } = require('mongoose')


class cardController {

    add_to_card = async (req, res) => {
        const { userId, productId, quantity } = req.body;
        try {

            const product = await cardModel.findOne({
                $and: [
                    {
                        productId: {
                            $eq: productId
                        }
                    },
                    {
                        userId: {
                            $eq: userId
                        }
                    }
                ]
            });
            if (product) {
                responseReturn(res, 404, { error: "Product already added to cart" })
            } else {
                const product = await cardModel.create({
                    userId,
                    productId,
                    quantity
                });
                responseReturn(res, 201, { message: 'Add to card success', product })
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    get_card_products = async (req, res) => {
        const { userId } = req.params;
        try {

            const card_products = await cardModel.aggregate([
                {
                    $match: {
                        userId: {
                            $eq: new ObjectId(userId)
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'products',
                        localField: 'productId',
                        foreignField: '_id',
                        as: 'products',
                    },
                }
            ]);

            // console.log(card_products)

        } catch (error) {
            console.log(error.message)
        }

    }

}

module.exports = new cardController();