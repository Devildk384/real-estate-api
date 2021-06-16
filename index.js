/** @format */

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

//app
const app = express();

//routes
const blogRoutes = require("./routes/blog");
const adminRoutes = require("./routes/admin");
const categoryRoutes = require("./routes/category");
const subcategoryRoutes = require("./routes/subcategory");
const propertyRoutes = require("./routes/property");
const adminTypeRoutes = require("./routes/admin_type");
const LocationRoutes = require("./routes/location");
const propertyTypeRoutes = require("./routes/property_type");
const propertyAmenityRoutes = require("./routes/property_amenities");
const propertyStatusRoutes = require("./routes/property_status");
const propertyFloorSizeRoutes = require("./routes/property_floor_size");
const adminAuth = require("./routes/admin_auth");

//db
mongoose
  .connect(process.env.DATABASE_CLOUD, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connected"))
  .catch((err) => {
    console.log(err);
  });

//middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
app.use(cors());

//routes middleware
app.use("/api", blogRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", subcategoryRoutes);
app.use("/api", propertyRoutes);
app.use("/api", adminTypeRoutes);
app.use("/api", LocationRoutes);
app.use("/api", propertyTypeRoutes);
app.use("/api", propertyAmenityRoutes);
app.use("/api", propertyStatusRoutes);
app.use("/api", propertyFloorSizeRoutes);
app.use("/api", adminAuth);

//use this to show the image you have in node js server to client (react js)
app.use("/uploads", express.static("uploads"));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  // index.html for all page routes
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
