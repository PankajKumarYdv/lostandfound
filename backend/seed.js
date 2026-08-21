// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const User = require("./models/User");
// const Item = require("./models/Item");

// dotenv.config();

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/trusttrace");
//     console.log("MongoDB connected for seeding...");
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// };

// const seedData = async () => {
//   await connectDB();

//   try {
//     // Clear existing data completely to avoid clutter
//     await Item.deleteMany();
//     await User.deleteMany();
//     console.log("Existing data cleared.");

//     // Create a dummy user
//     const user1 = await User.create({
//       name: "Alice Finder",
//       email: "alice@example.com",
//       password: "password123", // Presave hook will hash this
//       honestyScore: 25,
//     });

//     const user2 = await User.create({
//       name: "Bob GoodSamaritan",
//       email: "bob@example.com",
//       password: "password123",
//       honestyScore: 50,
//     });

//     console.log("Created dummy users.");

//     // Create dummy items
//     const items = [
//       {
//         title: "MacBook Pro M2 16-inch",
//         description: "Found a silver MacBook Pro abandoned near the library cafe. It has a distinctive sticker on the back, but I won't describe it to verify the owner.",
//         category: "Electronics",
//         images: ["/uploads/macbook_pro.png"],
//         status: "available",
//         createdBy: user1._id,
//       },
//       {
//         title: "Brown Leather Fossil Wallet",
//         description: "Found on a park bench in Central Park. Contains a few cards but no cash. I've secured it.",
//         category: "Wallets/IDs",
//         images: ["/uploads/leather_wallet.png"],
//         status: "available",
//         createdBy: user2._id,
//       },
//       {
//         title: "Toyota Car Keys + Gym Keychain",
//         description: "A set of Toyota keys with a blue gym membership tag attached. Found in parking lot B.",
//         category: "Keys",
//         images: ["/uploads/toyota_keys.png"],
//         status: "available",
//         createdBy: user1._id,
//       },
//       {
//         title: "Gold Chain Necklace",
//         description: "Found near the gym entrance. Appears to be real gold. It has a specific inscription.",
//         category: "Jewelry/Watches",
//         images: ["/uploads/gold_necklace.png"],
//         status: "available",
//         createdBy: user2._id,
//       }
//     ];

//     await Item.insertMany(items);
//     console.log("Inserted dummy items.");

//     console.log("Database perfectly seeded!");
//     process.exit();
//   } catch (error) {
//     console.error("Error seeding database:", error);
//     process.exit(1);
//   }
// };

// seedData();
