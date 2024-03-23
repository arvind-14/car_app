import express from 'express';
import {Car} from '../models/carsInfoSchema.js'
import { faker } from '@faker-js/faker';

const router = express();

router.post('/', async (req, res) => {
    try {
        // const { type, name, model, car_info } = req.body;
        const newCars = new Car({
            type: faker.vehicle.type(),
            name: faker.vehicle.vehicle(),
            model: faker.vehicle.model(),
            car_info: {
                color: faker.vehicle.color(),
                fuel: faker.vehicle.fuel(),
                manufacturer: faker.vehicle.manufacturer()
            }
        })
        await newCars.save();
        res.status(200).json({
            message: "car_info saved successfully",
            newCars
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
})

router.get('/', async (req, res) => {
    const carsInfo = await Car.find()
    res.json({
        message: "Welcome to the car_info API",
        carsInfo
    })
})
export default router;