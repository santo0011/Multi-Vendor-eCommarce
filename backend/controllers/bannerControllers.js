const adminModel = require('../models/adminModel');
const productModel = require("../models/productModel");
const bannerModel = require("../models/bannerModel");
const sellerCustomerSchema = require("../models/chat/sellerCustomerModel");
const bcrpty = require('bcrypt');
const { createToken } = require('../utiles/tokenCreate');
const { responseReturn } = require('../utiles/response');
const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;


class bannerControllers {
    // banner_add
    banner_add = async (req, res) => {

        const form = formidable({ multiples: true });
        form.parse(req, async (err, field, files) => {
            const { productId } = field;
            const { image } = files;

            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            });

            try {
                const { slug } = await productModel.findById(productId)
                const result = await cloudinary.uploader.upload(image.filepath, { folder: 'banners' });

                await bannerModel.create({
                    productId,
                    banner: result.url,
                    link: slug
                })
                responseReturn(res, 201, { message: "Banner add success" })

            } catch (error) {
                responseReturn(res, 500, { error: "Internal server error" });
            }
        })

    }

}


module.exports = new bannerControllers();