const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
if(process.env.NODE_ENV!="production"){
  require("dotenv").config({ path: "../.env" })
}
const dbUrl=process.env.ATLASDB_URL;
const MONGO_URL =dbUrl;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data=initData.data.map((obj)=>({...obj,owner:"66d240140b75d02dcc3ea7be"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();