import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Lead from "./models/Leads.js";

const demoLeads = [
  { name: "Rahul Sharma", email: "rahul@acme.in", phone: "9876543210", company: "Acme Traders", source: "website", status: "new", message: "Need a company website.", value: 45000 },
  { name: "Priya Nair", email: "priya@brightlabs.com", phone: "9812345678", company: "Bright Labs", source: "referral", status: "contacted", message: "Interested in a CRM.", value: 120000 },
  { name: "Imran Khan", email: "imran@fitzone.co", phone: "9900112233", company: "FitZone", source: "instagram", status: "converted", message: "Booking app.", value: 80000 },
  { name: "Sneha Rao", email: "sneha@gmail.com", company: "", source: "linkedin", status: "qualified", message: "Portfolio redesign.", value: 25000 },
  { name: "Vikram S", email: "vikram@oldcorp.com", company: "OldCorp", source: "cold-call", status: "lost", message: "Budget not approved.", value: 0 },
];

const run = async () => {
  await connectDB();

  const email = process.env.SEED_ADMIN_EMAIL;
  let admin = await User.findOne({ email });
  if (!admin) {
    admin = await User.create({
      name: process.env.SEED_ADMIN_NAME,
      email,
      password: process.env.SEED_ADMIN_PASSWORD,
    });
    console.log(`Admin created: ${email}`);
  } else {
    console.log("Admin already exists, skipping.");
  }

  if ((await Lead.countDocuments()) === 0) {
    await Lead.insertMany(demoLeads);
    console.log(`${demoLeads.length} demo leads inserted.`);
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((e) => { console.error(e); process.exit(1); });