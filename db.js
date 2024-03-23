import mongoose from 'mongoose'
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { carUser, Dealership, Deal, Car, SoldVehicle } from './models/carsInfoSchema.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URL, { dbName: process.env.DB_NAME }).then(() => {
  console.log("database connected");
  // addDataToDatabase();
})
  .catch((err) => {
    console.log("error connecting to database", err);
  })

// async function addDataToDatabase() {
//   try {

//     // Add fake cars
//     for (let i = 0; i < 20; i++) {
//       const newCar = new Car({
//         car_id: faker.string.uuid(),
//         type: faker.vehicle.type(),
//         name: faker.vehicle.vehicle(),
//         model: faker.vehicle.model(),
//         car_info: {
//           color: faker.vehicle.color(),
//           fuel: faker.vehicle.fuel(),
//         }
//       });
//       await newCar.save();
//     }

//     // Add fake carUsers
//     for (let i = 0; i < 10; i++) {
//       const soldVehicleId = await SoldVehicle.findOne().populate('vehicle_id').exec();
//       const newUser = new carUser({
//         user_email: faker.internet.email(),
//         user_id: faker.string.uuid(),
//         user_location: faker.location.city(),
//         user_info: {
//           name: faker.person.fullName(),
//           age: faker.number.int({ min: 18, max: 80 }),
//           // Add more fields as needed
//         },
//         password: faker.internet.password(),
//         vehicle_info: [soldVehicleId]
//       });
//       await newUser.save();
//     }

//     // Add fake deals
//     for (let i = 0; i < 15; i++) {
//       const randomCar = await Car.findOne().skip(Math.floor(Math.random() * 20));
//       const newDeal = new Deal({
//         deal_id: faker.string.uuid(),
//         car_id: randomCar._id,
//         deal_info: {
//           price: faker.number.octal({ min: 1000, max: 50000 }),
//           // Add more fields as needed
//         }
//       });
//       await newDeal.save();
//     }
//     // Add fake dealerships
//     for (let i = 0; i < 5; i++) {
//       const newDealership = new Dealership({
//         dealership_email: faker.internet.email(),
//         dealership_id: faker.string.uuid(),
//         dealership_name: faker.vehicle.manufacturer(),
//         dealership_location: faker.location.city(),
//         password: faker.internet.password(),
//         dealership_info: {
//           owner: faker.person.fullName(),
//           // Add more fields as needed
//         }
//       });
//       await newDealership.save();
//     }


//     for (let i = 0; i < 3; i++) {
//      const id= await Car.findOne().skip(Math.floor(Math.random() * 20))
//       const soldVehicle = new SoldVehicle({
//         vehicle_id: faker.string.uuid(),
//         car_id: id,
//         vehicle_info: {
//           color: faker.vehicle.color(),
//           fuel: faker.vehicle.fuel(),
//         }
//       })
//       await soldVehicle.save();
//     }


//     console.log('Data added to the database successfully');
//     process.exit(); // Terminate the script after adding data
//   } catch (error) {
//     console.error('Error adding data to the database:', error);
//     process.exit(1); // Terminate with non-zero exit code to indicate failure
//   }
// }
