require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.SECRET_KEY);
const Contact = require("./backend/models/Contact");
const productRoutes = require("./backend/routes/productRoutes");
const connectDB = require("./backend/config/db");

// Initialize app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// API Routes
app.use("/api/products", productRoutes);

// Contact Routes
app.get("/contact", (req, res) => {
  res.json({ message: "This is the contact page" });
});

app.post("/contact", async (req, res) => {
  const { fullName, email, message, city } = req.body;
  try {
    const newContact = new Contact({ fullName, email, message, city });
    await newContact.save();
    console.log("Contact saved");
    res.status(201).json({ message: "Contact saved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save contact" });
  }
});

// Stripe Payment Route
app.post("/payment", (req, res) => {
  const { token, price } = req.body;

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      return stripe.charges.create({
        amount: price * 100,
        currency: "INR",
        customer: customer.id,
        receipt_email: token.email,
        description: "Pharmacy payment",
      });
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      console.error("Stripe Error:", err);
      res.status(500).json({ error: "Payment failed" });
    });
});


// ---------- Serve Frontend in Production ----------
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
