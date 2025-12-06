// require('dotenv').config();  // <-- ADD THIS AT THE VERY TOP
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const fs = require("fs");
// const path = require("path");

// const Wedthemeroutes = require("./Routes/Wedthemeroute");
// const WedRecPartyroutes = require("./Routes/WedRecPartyroutes");
// const WedLiveMusicroutes = require("./Routes/WedLiveMusicroutes");
// const WedPhotoroutes = require("./Routes/WedPhotoroutes");

// const app = express();

// // Middlewares
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Static uploads folder
// // app.use("/uploads/theme", express.static(path.join(__dirname, "uploads/theme")));
// // app.use("/uploads/Wedrecparty", express.static(path.join(__dirname, "uploads/Wedrecparty"))); 
// // app.use("/uploads/WedLiveMusic", express.static(path.join(__dirname, "uploads/WedLiveMusic")));
// // app.use("/uploads/WedPhoto", express.static(path.join(__dirname, "uploads/WedPhoto")));
// app.use("/uploads", express.static("uploads"));


// // MongoDB Connection
// mongoose
//   .connect("mongodb://127.0.0.1:27017/event-db")
//   .then(() => console.log("MongoDB Connected Successfully"))
//   .catch((err) => console.log("DB Connection Error: ", err));

// // Routes
// app.use("/api/theme", Wedthemeroutes);
// app.use("/api/Wedrecparty", WedRecPartyroutes);
// app.use("/api/WedLiveMusic", WedLiveMusicroutes);
// app.use("/api/WedPhoto", WedPhotoroutes);

// // Server start
// const PORT = 5005;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const Wedthemeroutes = require("./Routes/Wedthemeroute");
const WedRecPartyroutes = require("./Routes/WedRecPartyroutes");
const WedLiveMusicroutes = require("./Routes/WedLiveMusicroutes");
const WedPhotoroutes = require("./Routes/WedPhotoroutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));


mongoose
  .connect(process.env.MONGO_URI) // options remove பண்ணுங்க
  .then(() => console.log("MongoDB Connected Globally"))
  .catch(err => console.log("DB Connection Error:", err));



app.use("/api/theme", Wedthemeroutes);
app.use("/api/Wedrecparty", WedRecPartyroutes);
app.use("/api/WedLiveMusic", WedLiveMusicroutes);
app.use("/api/WedPhoto", WedPhotoroutes);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
