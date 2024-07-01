const express = require("express");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const passport = require("passport");

const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.set("view engine", "ejs");

require("./models/User");

app.get("/", (req, res) => {
  console.log("Home page");
  res.send("Home page");
  //console.log(req.cookies);
});


const store = new MongoStore({
  mongoUrl: "mongodb+srv://learnflow:learnflow@cluster0.o3y0dz5.mongodb.net/LearnFlow",
  mongoOptions: {
    useUnifiedTopology: true,
  },
});


app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "fkod odijfow",
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    }
  })
);


require("./config/passport");

app.use(passport.initialize());
app.use(passport.session());


app.use("/auth", require("./routers/auth"));
app.use("/user", require("./routers/user"));




connectDB()
  .then(async () => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });

    // CRUD

    //create
    // await User.create({
    //   firstName: "John 3",
    //   lastName: "Doe 1",
    //   email: "hd2@gmail.com",
    // });
    //     console.log("User created successfully");

    //find
    //   const user = await User.findOne({ lastName: "Doe" });
    //   console.log(user);

    //   const userList = await User.find({ lastName: "Doe" });
    //   console.log(userList);

    //   const user = await User.findById("6681337678e887c75e9eb2f3");
    //   console.log(user);

    //update
    //   const user = await User.findOne({ lastName: "Doe" });
    //   if (user) {
    //       user.firstName = "Jane";
    //       await user.save();
    //   }

    //delete
    //   const delres = await User.deleteOne({ email: "hd2@gmail.com" });
    //   console.log(delres);

    // const delres = await User.deleteMany({ email: "hd2@gmail.com" });
    // console.log(delres);
  })
  .catch((error) => {
    console.log("Error connecting to the database");
  });
