
import userData from "../model/user.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/jwtutils.js";
import cloudinary,{proxyAgent} from "../config/cloudinary.js";

const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "diva_user",
                agent: proxyAgent
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve(result);
            }
        );

        stream.end(buffer);
    });
};

export const addUser = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            mobile,
            address,
            password,
            image
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required",
                status: 0
            });
        }

        const existingUser = await userData.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
                status: 0
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let imageUrl = "";

        if (req.file) {
            const uploadedImage = await uploadToCloudinary(
                req.file.buffer
            );

            imageUrl = uploadedImage.secure_url;
        }

        const userDataval = {
            name,
            email,
            phone,
            mobile,
            address,
            password: hashedPassword,
            image: imageUrl
        };

        const saveUserData = await userData.create(userDataval);

        return res.status(201).json({
            message: "User added successfully",
            status: 1,
            data: saveUserData
        });

    } catch (error) {
        console.error("Add user error:", error);

        return res.status(500).json({
            message: "Server error",
            errorMessage: error.message,
            status: 0
        });
    }
};


export const getUser = async (req, res) => {
    try {
        const getuserData = await userData.find()
            .select("-password");

        return res.status(200).json({
            message: "Users retrieved successfully",
            status: 1,
            data: getuserData
        });

    } catch (error) {
        console.error("Get users error:", error);

        return res.status(500).json({
            message: "Server error",
            errorMessage: error.message,
            status: 0
        });
    }
};


export const getSingleUser = async (req, res) => {
    try {
        const id = req.params.id;

        const singleUser = await userData.findById(id)
            .select("-password");

        if (!singleUser) {
            return res.status(404).json({
                message: "User not found",
                status: 0
            });
        }

        return res.status(200).json({
            message: "User retrieved successfully",
            status: 1,
            data: singleUser
        });

    } catch (error) {
        console.error("Get single user error:", error);

        return res.status(500).json({
            message: "Server error",
            errorMessage: error.message,
            status: 0
        });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                status: 0
            });
        }

        const uData = await userData.findOne({ email });

        if (!uData) {
            return res.status(404).json({
                message: "User not found",
                status: 0
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            uData.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Password does not match",
                status: 0
            });
        }

        const token = await generateToken(uData);

        const safeUserData = uData.toObject();
        delete safeUserData.password;

        return res.status(200).json({
            message: "Login successful",
            status: 1,
            data: safeUserData,
            token
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Login failed",
            status: 0,
            errorMessage: error.message
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const id = req.params.id;

        const {
            name,
            email,
            phone,
            mobile,
            address,
            password
        } = req.body;

        const updateData = {};

        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (mobile !== undefined) updateData.mobile = mobile;
        if (address !== undefined) updateData.address = address;

        if (req.file) {
            const uploadedImage = await uploadToCloudinary(
                req.file.buffer
            );

            updateData.image = uploadedImage.secure_url;
        }

        if (password && password.trim() !== "") {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await userData.findByIdAndUpdate(
            id,
            { $set: updateData },
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
                status: 0
            });
        }

        return res.status(200).json({
            message: "User updated successfully",
            status: 1,
            data: updatedUser
        });

    } catch (error) {
        console.error("Update user error:", error);

        return res.status(500).json({
            message: "Server error",
            errorMessage: error.message,
            status: 0
        });
    }
};


export const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;

        const deletedUser = await userData.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                message: "User not found",
                status: 0
            });
        }

        return res.status(200).json({
            message: "User deleted successfully",
            status: 1
        });

    } catch (error) {
        console.error("Delete user error:", error);

        return res.status(500).json({
            message: "Server error",
            errorMessage: error.message,
            status: 0
        });
    }
};