const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const uri =
  "mongodb+srv://admin:passAdmin@twiller.vcwh7.mongodb.net/?retryWrites=true&w=majority&appName=twiller";
const port = 5000;

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(uri);

const requestLimit = {};
const otpStore = {};

const generateRandomPassword = () => {
  const length = 8;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

const generateOtp = () => {
  return crypto.randomBytes(3).toString('hex');
};

async function run() {
  try {
    await client.connect();
    const postcollection = client.db("database").collection("posts");
    const usercollection = client.db("database").collection("users");

    app.post('/api/forgot-password', async (req, res) => {
      const { emailOrPhone } = req.body;
      const currentDate = new Date().toDateString();

      if (requestLimit[emailOrPhone] === currentDate) {
        return res.status(429).json({ message: "You can only request a password reset once per day." });
      }

      requestLimit[emailOrPhone] = currentDate;
      const otp = generateOtp();
      otpStore[emailOrPhone] = otp;
      

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'advaityayt@gmail.com',
          pass: 'exge jbsy zwnj hrot'
        }
      });
      

      const mailOptions = {
        from: 'advaityayt@gmail.com',
        to: emailOrPhone,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}`
      };
      

      transporter.sendMail(mailOptions, (error, info) => {
        
        if (error) {
          console.error('Error sending OTP:', error);
          return res.status(500).json({ message: 'Error sending OTP' });
        }
        res.json({ message: 'OTP sent to your email' });
      });
    });

    app.post('/api/verify-otp', (req, res) => {
      const { emailOrPhone, otp } = req.body;
      if (otpStore[emailOrPhone] === otp) {
        delete otpStore[emailOrPhone];
        res.json({ success: true });
      } else {
        res.status(400).json({ message: 'Invalid OTP' });
      }
    });

    app.post('/api/reset-password', async (req, res) => {
      const { emailOrPhone, newPassword } = req.body;
      const hashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');
      await usercollection.updateOne({ email: emailOrPhone }, { $set: { password: hashedPassword } });
      res.json({ success: true, message: 'Password reset successfully' });
    });
    
    app.post("/register", async (req, res) => {
      const user = req.body;
      // console.log(user)
      const result = await usercollection.insertOne(user);
      res.send(result);
    });
    app.get("/loggedinuser", async (req, res) => {
      const email = req.query.email;
      const user = await usercollection.find({ email: email }).toArray();
      res.send(user);
    });
    app.post("/post", async (req, res) => {
      const post = req.body;
      const result = await postcollection.insertOne(post);
      res.send(result);
    });
    app.get("/post", async (req, res) => {
      const post = (await postcollection.find().toArray()).reverse();
      res.send(post);
    });
    app.get("/userpost", async (req, res) => {
      const email = req.query.email;
      const post = (
        await postcollection.find({ email: email }).toArray()
      ).reverse();
      res.send(post);
    });

    app.get("/user", async (req, res) => {
      const user = await usercollection.find().toArray();
      res.send(user);
    });

    app.patch("/userupdate/:email", async (req, res) => {
      const filter = req.params;
      const profile = req.body;
      const options = { upsert: true };
      const updateDoc = { $set: profile };
      // console.log(profile)
      const result = await usercollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });
  } catch (error) {
    console.log(error);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Twiller is working");
});

app.listen(port, () => {
  console.log(`Twiller clone is workingon ${port}`);
});
