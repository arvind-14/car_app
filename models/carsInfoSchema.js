import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define schema for admin table
const adminSchema = new Schema({
    admin_id: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Define schema for carUser table
const userSchema = new Schema({
    user_email: { type: String, required: true, unique: true },
    user_id: { type: String, required: true, unique: true },
    user_location: String,
    user_info: Object,
    password: { type: String, required: true },
    vehicle_info: [{ type: Schema.Types.ObjectId, ref: 'SoldVehicle' }] 
});

// Define schema for dealership table
const dealershipSchema = new Schema({
    dealership_email: { type: String, required: true, unique: true },
    dealership_id: { type: String, required: true, unique: true },
    dealership_name: String,
    dealership_location: String,
    password: { type: String, required: true },
    dealership_info: Object, 
    cars: [{ type: Schema.Types.ObjectId, ref: 'Car' }],
    deals: [{ type: Schema.Types.ObjectId, ref: 'Deal' }], 
    sold_vehicles: [{ type: Schema.Types.ObjectId, ref: 'SoldVehicle' }]
});

// Define schema for deal table
const dealSchema = new Schema({
    deal_id: { type: String, required: true, unique: true },
    car_id: { type: Schema.Types.ObjectId, ref: 'Car' }, 
    deal_info: Object 
});

// Define schema for cars table
const carSchema = new Schema({
    car_id: { type: String, required: true, unique: true },
    type: String,
    name: String,
    model: String,
    car_info: Object
});

// Define schema for sold vehicles table
const soldVehicleSchema = new Schema({
    vehicle_id: { type: String, required: true, unique: true },
    car_id: { type: Schema.Types.ObjectId, ref: 'Car' }, 
    vehicle_info: Object 
});


const Admin = mongoose.model('Admin', adminSchema);
const carUser = mongoose.model('carUser', userSchema);
const Dealership = mongoose.model('Dealership', dealershipSchema);
const Deal = mongoose.model('Deal', dealSchema);
const Car = mongoose.model('Car', carSchema);
const SoldVehicle = mongoose.model('SoldVehicle', soldVehicleSchema);

export { Admin, carUser, Dealership, Deal, Car, SoldVehicle };
