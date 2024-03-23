import express from 'express';
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Admin, carUser, Dealership, Deal, Car, SoldVehicle } from '../models/carsInfoSchema.js'
import { faker } from '@faker-js/faker';

const router = express();
dotenv.config();

// TOKEN VALIDATION MIDDLEWARE
function tokenValidation(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        const error = new Error("No token available")
        next(error)
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.id = decoded.userId;
        next();
    }
    catch (error) {
        next(error)
    }
}
router.post('/register', async (req, res, next) => {
    try {
        const { user_email, password, user_info } = req.body;
        const isExistingUser = await carUser.findOne({ user_email });

        if (isExistingUser) {
            const error = new Error("User Email already exists!")
            next(error)
        }
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        const newUser = new carUser({
            user_email,
            user_id: faker.number.int(100),
            password: hashPassword,
            user_info
        })
        await newUser.save();
        res.status(201).json({
            message: "User registered successfully",
            user: newUser
        })
    }
    catch (error) {
        next(error);
    }


})
router.post('/login', async (req, res, next) => {
    try {
        const { user_email, password } = req.body;
        const existingUser = await carUser.findOne({ user_email })

        if (!existingUser) {
            const error = new Error("Invalid User Email")
            next(error);
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password)
        if (!isPasswordValid) {
            const error = new Error("Invalid User Password")
            next(error);
        }
        const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' })

        res.cookie('token', token, { httpOnly: true })

        res.status(200).json({
            token: token,
            message: "User Login successful"
        })
    }
    catch (error) {
        next(error)
    }
})

router.post('/logout', tokenValidation, async (req, res) => {
    res.clearCookie('token')
    res.status(200).json({
        message: "User Logout successful"
    })
})

router.post('/changePassword', tokenValidation, async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const id = req.id;
        const existingUser = await carUser.findById(id)

        if (!existingUser) {
            const error = new Error("Invalid User Email or User not found")
            next(error);
        }
        const passwordMatch = await bcrypt.compare(oldPassword, existingUser.password)
        if (!passwordMatch) {
            const error = new Error("Incorrect Old Password")
            next(error);
        }
        const salt = bcrypt.genSaltSync(10);
        const hashNewPassword = bcrypt.hashSync(newPassword, salt);
        existingUser.password = hashNewPassword;
        await existingUser.save();
        res.status(200).json({
            message: "User Password changed successfully"
        })
    }
    catch (error) {
        next(error)
    }
})

router.get('/:userId/dealerships/:carId', async (req, res, next) => {
    try {
        const { userId, carId } = req.params;
        const dealerships = await Dealership.find({ cars: carId });
        res.status(200).json(dealerships);
    } catch (error) {
        next(error)
    }
})

router.get('/:userId/vehicles', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await carUser.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const vehicles = await SoldVehicle.find({ _id: { $in: user.sold_vehicles } }).populate('car_id').exec();
        const vehicleInfo = vehicles.map(vehicle => ({
            vehicle_info: vehicle.vehicle_info,
            car_info: vehicle.car_id,
            dealer_info: Dealership.findOne({ cars: vehicle.car_id }).exec()
        }));
        res.status(200).json(vehicleInfo);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

router.get('/:userId/deals/:carId', async (req, res) => {
    try {
        const { carId } = req.params;
        const deals = await Deal.find({ car_id: carId });
        res.status(200).json(deals);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

//ERROR HANDLING MIDDLEWARE
router.use((err, req, res, next) => {
    res.status(500).json({
        message: err.message
    })
})
export default router;