import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import './db.js'
import cookieParser from 'cookie-parser'
import user from './controllers/user.js'
import dealership from './controllers/dealership.js'
// import { faker } from '@faker-js/faker';
import { Admin, carUser, Dealership, Deal, Car, SoldVehicle } from './models/carsInfoSchema.js'


const app = express()
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors())
app.use(cookieParser())

app.use('/user', user)
app.use('/dealerships',dealership)

app.get('/cars', async (req, res) => {
    try {
        const cars = await Car.find();
        res.status(200).json(cars);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.get('/dealerships/:dealershipId/cars', async (req, res) => {
    try {
        const { dealershipId } = req.params;
        const dealership = await Dealership.findById(dealershipId);
        if (!dealership) {
            return res.status(404).send('Dealership not found');
        }
        const cars = await Car.find({ _id: { $in: dealership.cars } });
        res.status(200).json(cars);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.post('/:userType/:userId/vehicles', async (req, res) => {
    try {
        const { userType, userId } = req.params;
        const { carId, vehicleInfo } = req.body;
        let owner;
        if (userType === 'user') {
            owner = await User.findById(userId);
        } else if (userType === 'dealership') {
            owner = await Dealership.findById(userId);
        } else {
            return res.status(400).send('Invalid user type');
        }
        if (!owner) {
            return res.status(404).send('User or dealership not found');
        }
        const newVehicle = new SoldVehicle({
            car_id: carId,
            vehicle_info: vehicleInfo
        });
        await newVehicle.save();
        owner.sold_vehicles.push(newVehicle._id);
        await owner.save();
        res.status(201).send('Vehicle added successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.get('/dealerships/:dealershipId/deals', async (req, res) => {
    try {
        const { dealershipId } = req.params;
        const dealership = await Dealership.findById(dealershipId);
        if (!dealership) {
            return res.status(404).send('Dealership not found');
        }
        const deals = await Deal.find({ _id: { $in: dealership.deals } });
        res.status(200).json(deals);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
