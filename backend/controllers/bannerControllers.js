const productModel = require("../models/productModel");
const bannerModel = require("../models/bannerModel");
const { responseReturn } = require("../utiles/response");
const formidable = require("formidable");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");

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
                secure: true,
            });

            try {
                const { slug } = await productModel.findById(productId);
                const result = await cloudinary.uploader.upload(image.filepath, {
                    folder: "banners",
                });

                const banner = await bannerModel.create({
                    productId,
                    banner: result.url,
                    link: slug,
                });
                responseReturn(res, 201, { message: "Banner add success", banner });
            } catch (error) {
                responseReturn(res, 500, { error: "Internal server error" });
            }
        });
    };

    // banner_get
    banner_get = async (req, res) => {
        const { productId } = req.params;
        try {
            const banner = await bannerModel.findOne({
                productId: mongoose.Types.ObjectId(productId),
            });
            responseReturn(res, 201, {
                banner,
            });
        } catch (error) {
            responseReturn(res, 500, { error: "Internal server error" });
        }
    };


    // get all banners
    banners_get = async (req, res) => {
        try {
            const banners = await bannerModel.aggregate([
                { $sample: { size: 10 } }
            ]);
            responseReturn(res, 201, {
                banners,
            });
        } catch (error) {
            responseReturn(res, 500, { error: "Internal server error" });
        }
    };


    // banner_update
    banner_update = async (req, res) => {
        const { bannerId } = req.params;

        const form = formidable({});

        cloudinary.config({
            cloud_name: process.env.cloud_name,
            api_key: process.env.api_key,
            api_secret: process.env.api_secret,
            secure: true,
        });

        form.parse(req, async (err, _, files) => {
            const { image } = files;

            try {
                let banner = await bannerModel.findById(bannerId);
                let temp = banner.banner.split("/");
                temp = temp[temp.length - 1];
                const imageName = temp.split(".")[0];

                await cloudinary.uploader.destroy(imageName)

                const { url } = await cloudinary.uploader.upload(image.filepath, {
                    folder: "banners",
                });

                await bannerModel.findByIdAndUpdate(bannerId, {
                    banner: url
                })
                
                banner = await bannerModel.findById(bannerId);

                responseReturn(res, 200, { banner, message: "Benner update successfully" })

            } catch (error) {
                responseReturn(res, 500, { error: "Internal server error" });
            }
        });
    };
}



module.exports = new bannerControllers();