const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities')
const { descriptors, places } = require('./seedHelpers')

mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const randomize = arr => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randomPlace = Math.ceil(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[randomPlace].city}, ${cities[randomPlace].state}`,
            geometry: {
                type: 'Point',
                coordinates: [cities[randomPlace].longitude, cities[randomPlace].latitude]
            },
            title: `${randomize(descriptors)} ${randomize(places)}`,
            images: [{ url: `https://picsum.photos/400?random=${Math.random()}`, filename: 'image' }],
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laudantium, tempora consequatur? Repudiandae minus sed voluptatum architecto porro. Aliquid dignissimos animi temporibus dolore inventore nulla sunt in voluptate! Libero, laboriosam blanditiis.',
            price: Math.ceil(Math.random() * 50) + 10,
            author: '6771adde9fbb2536fbba426a'
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});
