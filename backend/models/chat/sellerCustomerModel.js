const { Schema, model } = require("mongoose");

const sellerCustomerSchema = new Schema({
    mId: {
        type: String,
        required: true
    },
    myFriends: {
        type: Array,
        default: []
    }
}, { timestamps: true });


module.exports = model('seller_customers', sellerCustomerSchema);