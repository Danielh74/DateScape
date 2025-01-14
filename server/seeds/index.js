const mongoose = require('mongoose');
const cities = require('./cities')
const { descriptors, places, categories } = require('./seedHelpers');
const DateLocation = require('../models/dateLocation');

mongoose.connect('mongodb://127.0.0.1:27017/DateScape');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const randomize = arr => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
    await DateLocation.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randomPlace = Math.ceil(Math.random() * 1000);
        const location = new DateLocation({
            address: `${cities[randomPlace].city}, ${cities[randomPlace].state}`,
            geometry: {
                type: 'Point',
                coordinates: [cities[randomPlace].longitude, cities[randomPlace].latitude]
            },
            title: `${randomize(descriptors)} ${randomize(places)}`,
            images: [{ url: `https://picsum.photos/400?random=${Math.random()}`, filename: 'image' }],
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laudantium, tempora consequatur? Repudiandae minus sed voluptatum architecto porro. Aliquid dignissimos animi temporibus dolore inventore nulla sunt in voluptate! Libero, laboriosam blanditiis.',
            price: Math.ceil(Math.random() * 50) + 10,
            categories: [`${randomize(categories)}`],
            author: '678641f454d4f4a32ee7552d'
        })
        await location.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});
