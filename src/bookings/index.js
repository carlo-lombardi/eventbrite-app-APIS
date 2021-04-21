import express from "express";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 } from "cloudinary";
import uniqid from "uniqid";
import sgMail from "@sendgrid/mail";
const dataFolder = join(dirname(fileURLToPath(import.meta.url)), "../data");
const booksPath = join(dataFolder, "bookings.json");

/* const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: v2,
  params: {
    folder: "strive",
  },
}); */

/* const uploader = multer({ storage: cloudinaryStorage }); */

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const bookingsJson = await fs.readJSON(booksPath);
    res.send(bookingsJson);
  } catch (error) {
    next(error);
  }
});
router.post("/attendees", async (req, res, next) => {
  try {
    const bookingsJson = await fs.readJSON(booksPath);
    const newBooking = { ...req.body, ID: uniqid() };

    bookingsJson.push(newBooking);
    await fs.writeJSON(booksPath, bookingsJson);

    console.log(bookingsJson);
    res.send(bookingsJson);
  } catch (error) {
    next(error);
  }
});
router.post("/sendEmail", async (req, res, next) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: "lombardi.business@outlook.com", // Change to your recipient
      from: "mr.lombardi@outlook.com", // Change to your verified sender
      subject: "Sending with SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    };
    await sgMail.send(msg);
    res.send({ message: "email sent" });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default router;
