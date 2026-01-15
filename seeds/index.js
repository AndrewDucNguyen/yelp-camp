const mongoose = require('mongoose')
const Campground = require('../models/campground')
const { places, descriptors } = require('./seedHelpers')
const cities = require('./cities')


mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;

db.on("error", console.error.bind(console, "conection error:"))
db.once("open", () => {
    console.log("Database connected")
})

const sample = (array) => {
    return array[Math.floor(Math.random() * array.length)]
}

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20 + 10)

        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam eos, nulla hic deserunt unde necessitatibus illum inventore soluta voluptates! Architecto, expedita nam, sint dignissimos ab quibusdam pariatur, deserunt consequatur et praesentium modi assumenda inventore reiciendis nemo rerum eveniet? Temporibus reiciendis magnam praesentium corrupti modi. Amet dolores nam omnis odit dicta.',
            price
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})