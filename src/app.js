require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const shoppingcartRoutes = require("./routes/shoppingcartRoutes");
const productRoutes = require("./routes/productRoutes");

//1. Skapa express app
const app = express();

//3. Middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Processing ${req.method} request to ${req.path}`);
  // when above code executed; go on to next middleware/routing
  next();
});

//4. Skapa våra routes
app.use("/api/v1/shoppingcarts", shoppingcartRoutes);

app.use("/api/v1/products", productRoutes);

//2. Sätta upp servern
const port = process.env.PORT || 4000;
async function run() {
  try {
    // Connect to MongoDB database (via Mongoose)
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
    console.log(`MongoDB connected: ${conn.connection.host}`);

    // Start server; listen to requests on port
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
  }
}

run();
