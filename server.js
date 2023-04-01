const express = require("express");
const bodyParser = require("body-parser");
const db = require("mongoose");
const nodeMailer = require("nodemailer");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("pages"));
db.connect(
  ""
);
const middle = (req, res, next) => {
  if (req.query.admin == "true") {
    next();
  } else {
    res.status(400).send("Error");
  }
};

const userSchema = db.Schema({
  fullname: String,
  email: String,
  password: String,
  buyingList: Array,
});
const productSchema = db.Schema({
  title: String,
  description: String,
  price: Number,
});
const orderSchema = db.Schema({
  clientEmail: String,
  product: Object,
});
const userModel = db.model("User", userSchema);
const productModel = db.model("Product", productSchema);
const orderModel = db.model("Order", orderSchema);

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const find = async () => {
    try {
      const user = await userModel.findOne({ email, password });
      res.json(user);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  };
  find();
});
app.get("/signup", (req, res) => {
  res.sendFile(__dirname + "/pages/signup.html");
});
app.post("/register", (req, res) => {
  const { fullname, email, password } = req.body;
  const find = async () => {
    try {
      const user = await userModel.findOne({ email });
      if (user) {
        res.status(409).send("User already exists");
      } else {
        await userModel.insertMany({ fullname, email, password });
        res.status(200).send("User created successfully");
      }
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  };
  find();
});

app.get("/store", (req, res) => {
  res.sendFile(__dirname + "/pages/store.html");
});
app.get("/products", (req, res) => {
  const find = async () => {
    try {
      const products = await productModel.find();
      res.json(products);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  };
  find();
});
app.get("/buy", (req, res) => {
  res.sendFile(__dirname + "/pages/buy.html");
});
app.post("/order", async (req, res) => {
  const { email, buyingList } = req.body;
  console.log(email);
  try {
    await userModel.findOneAndUpdate(
      { email: email },
      { $set: { buyingList: buyingList } },
      { multi: true }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send("Error adding order to database");
  }
});
app.get("/forgot", (req, res) => {
  res.sendFile(__dirname + "/pages/forgot.html");
});

app.post("/sendmail", async (req, res) => {
  try {
    const { email } = req.body;
    const transporter = nodeMailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "dorris.schowalter3@ethereal.email",
        pass: "TCBb2m9nyFqRXG5cUk",
      },
    });
    let user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    let password = user.password;
    let info = await transporter.sendMail({
      from: '"Dorris from SV-Store" <rhianna.beer@ethereal.email>',
      to: email,
      subject: "Password",
      text: `Your password is ${password}`,
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodeMailer.getTestMessageUrl(info));
    return res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});

app.post("/approve", async (req, res) => {
  const { clientEmail, currentName } = req.body;
  try {
    let user = await userModel.find({ email: clientEmail });
    let result = user[0].buyingList;
    await orderModel.insertMany({
      clientEmail: currentName,
      product: result,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/all", (req, res) => {
  res.sendFile(__dirname + "/pages/admin.html");
});
app.use(middle);
app.get("/active", (req, res) => {
  const find = async () => {
    try {
      const orders = await orderModel.find();
      res.json(orders);
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  };
  find();
});

app.listen("3000", () => {
  console.log("Server is up and running on port 3000");
});
