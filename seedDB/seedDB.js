require("dotenv").config();
const { mockProductsData } = require("../seedDB/products");
const Cart = require("../src/models/Cart");
const Product = require("../src/models/Product");
const mongoose = require("mongoose");

const populateDbWithMockData = async (connectionString) => {
  try {
    //startar servern
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(connectionString);
    //för att få upp min länk t.ex localhost
    console.log(`MongoDB connected: ${conn.connection.host}`);
    //tömmer listan
    await Product.deleteMany();

    const productRes = await Product.create(mockProductsData);

    console.log("Database successfully populated with test data");
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
};

populateDbWithMockData(process.env.MONGO_CONNECTION_STRING);
