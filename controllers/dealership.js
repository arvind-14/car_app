import express from 'express';
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Admin, carUser, Dealership, Deal, Car, SoldVehicle } from '../models/carsInfoSchema.js'
import { faker } from '@faker-js/faker';

const router = express();
dotenv.config();

router.post('/:dealershipId/cars', async (req, res) => {
    try {
        const { dealershipId } = req.params;
        const dealership = await Dealership.findById(dealershipId);
        if (!dealership) {
            return res.status(404).send('Dealership not found');
        }
        const { type, name, model, car_info } = req.body;
        const newCar = new Car({
            type,
            name,
            model,
            car_info
        });
        await newCar.save();
        dealership.cars.push(newCar._id);
        await dealership.save();
        res.status(201).send('Car added to dealership successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

router.post('/:dealershipId/deals', async (req, res) => {
    try {
        const { dealershipId } = req.params;
        const dealership = await Dealership.findById(dealershipId);
        if (!dealership) {
            return res.status(404).send('Dealership not found');
        }
        const { carId, dealInfo } = req.body;
        const newDeal = new Deal({
            car_id: carId,
            deal_info: dealInfo
        });
        await newDeal.save();
        dealership.deals.push(newDeal._id);
        await dealership.save();
        res.status(201).send('Deal added to dealership successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

router.get('/:dealershipId/sold-vehicles', async (req, res) => {
    try {
        const { dealershipId } = req.params;
        const dealership = await Dealership.findById(dealershipId);
        if (!dealership) {
            return res.status(404).send('Dealership not found');
        }
        const soldVehicles = await SoldVehicle.find({ _id: { $in: dealership.sold_vehicles } }).populate('car_id').exec();
        res.status(200).json(soldVehicles);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});
export default router;