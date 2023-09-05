const adminModel = require('../models/adminModel');
const sellerModel = require("../models/sellerModel");
const sellerCustomerSchema = require("../models/chat/sellerCustomerModel");
const bcrpty = require('bcrypt');
const { createToken } = require('../utiles/tokenCreate');
const { responseReturn } = require('../utiles/response');
const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;


class authControllers {
    // admin_login
    admin_login = async (req, res) => {
        const { email, password } = req.body;
        try {
            const admin = await adminModel.findOne({ email }).select("+password");
            if (admin) {
                const match = await bcrpty.compare(password, admin.password);
                if (match) {
                    const token = await createToken({
                        id: admin.id,
                        role: admin.role
                    });
                    res.cookie('accessToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    });
                    responseReturn(res, 200, { token, message: "Login success" })

                } else {
                    responseReturn(res, 404, { error: "Password wrong" })
                }
            } else {
                responseReturn(res, 404, { error: "Email not found" })
            }
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }


    // getUser
    getUser = async (req, res) => {
        const { role, id } = req;
        try {

            if (role === "admin") {
                const user = await adminModel.findById(id);
                responseReturn(res, 200, { userInfo: user })
            } else {
                const seller = await sellerModel.findById(id);
                responseReturn(res, 200, { userInfo: seller })
            }

        } catch (error) {
            responseReturn(res, 500, { error: "Internal server error" })
        }
    }

    // seller_register
    seller_register = async (req, res) => {
        const { email, name, password } = req.body;
        try {
            const getUser = await sellerModel.findOne({ email });
            if (getUser) {
                responseReturn(res, 400, { error: "Email alrady exit" })
            } else {
                const seller = await sellerModel.create({
                    name,
                    email,
                    password: await bcrpty.hash(password, 10),
                    method: "menulay",
                    shopInfo: {}
                });

                await sellerCustomerSchema.create({
                    mId: seller.id
                });

                const token = await createToken({
                    id: seller.id,
                    role: seller.role
                });
                res.cookie("accessToken", token, {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                });
                responseReturn(res, 201, { token, message: "Regsiter success" })
            }

        } catch (error) {
            responseReturn(res, 500, { error: "Internal server error" });
        }

    }


    // seller_login
    seller_login = async (req, res) => {
        const { email, password } = req.body;
        try {
            const seller = await sellerModel.findOne({ email }).select("+password");
            if (seller) {
                const match = await bcrpty.compare(password, seller.password);
                if (match) {
                    const token = await createToken({
                        id: seller.id,
                        role: seller.role
                    });
                    res.cookie('accessToken', token, {
                        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                    });
                    responseReturn(res, 200, { token, message: "Login success" })
                } else {
                    responseReturn(res, 404, { error: "Password wrong" })
                }
            } else {
                responseReturn(res, 404, { error: "Email not found" })
            }

        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }

    }


    // profile_image_upload
    profile_image_upload = async (req, res) => {
        const { id } = req;
        const form = formidable({ multiples: true });
        form.parse(req, async (err, _, files) => {
            cloudinary.config({
                cloud_name: process.env.cloud_name,
                api_key: process.env.api_key,
                api_secret: process.env.api_secret,
                secure: true
            });
            const { image } = files;
            try {
                const result = await cloudinary.uploader.upload(image.filepath, { folder: 'profile' });
                if (result) {
                    await sellerModel.findByIdAndUpdate(id, {
                        image: result.url
                    });
                    const userInfo = await sellerModel.findById(id)
                    responseReturn(res, 201, { message: 'Image upload success', userInfo })
                } else {
                    responseReturn(res, 404, { error: 'Image upload failed' })
                }
            } catch (error) {
                responseReturn(res, 500, { error: error.message })
            }
        });

    }

    // profile_info_add
    profile_info_add = async (req, res) => {
        const { division, district, shopName, sub_district } = req.body;
        const { id } = req;
        try {
            await sellerModel.findByIdAndUpdate(id, {
                shopInfo: {
                    shopName,
                    division,
                    district,
                    sub_district
                }
            });
            const userInfo = await sellerModel.findById(id);
            responseReturn(res, 201, { message: "Profile info add success", userInfo });
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }


    // logout
    logout = async (req, res) => {
        try {
            res.cookie('accessToken', null, {
                expires: new Date(Date.now()),
                httpOnly: true
            });
            responseReturn(res, 200, { message: "Logout success" })
        } catch (error) {
            responseReturn(res, 500, { error: error.message })
        }
    }
}


module.exports = new authControllers();