const path = require("path");
const express = require("express");
const mysql = require("mysql2/promise");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const port = Number(process.env.PORT || 3000);

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "shash_company",
    waitForConnections: true,
    connectionLimit: 10
});

const mailTransport = process.env.SMTP_HOST
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: process.env.SMTP_USER && process.env.SMTP_PASS
            ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
            : undefined
    })
    : null;

app.use(express.json({ limit: "20kb" }));
app.use(express.static(__dirname));

function cleanText(value, maxLength) {
    if (typeof value !== "string") {
        return "";
    }

    return value.trim().slice(0, maxLength);
}

function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function sendNotification(subject, lines) {
    if (!mailTransport || !process.env.NOTIFY_TO) {
        return;
    }

    await mailTransport.sendMail({
        from: process.env.NOTIFY_FROM || process.env.SMTP_USER,
        to: process.env.NOTIFY_TO,
        subject,
        text: lines.join("\n")
    });
}

app.post("/api/contact", async (req, res) => {
    const name = cleanText(req.body.name, 100);
    const email = cleanText(req.body.email, 150);
    const message = cleanText(req.body.message, 2000);

    if (!name || !isEmail(email) || !message) {
        return res.status(400).json({ error: "Please enter a valid name, email, and message." });
    }

    try {
        await pool.execute(
            "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)",
            [name, email, message]
        );

        await sendNotification("New website contact enquiry", [
            `Name: ${name}`,
            `Email: ${email}`,
            `Message: ${message}`
        ]);

        res.status(201).json({ ok: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not save the message right now." });
    }
});

app.post("/api/careers", async (req, res) => {
    const firstName = cleanText(req.body.firstName, 80);
    const lastName = cleanText(req.body.lastName, 80);
    const email = cleanText(req.body.email, 150);
    const phone = cleanText(req.body.phone, 30);
    const internshipCode = cleanText(req.body.internshipCode, 30);
    const message = cleanText(req.body.message, 2000);

    if (!firstName || !lastName || !isEmail(email) || !message) {
        return res.status(400).json({ error: "Please enter a valid name, email, and message." });
    }

    try {
        await pool.execute(
            `INSERT INTO career_applications
                (first_name, last_name, email, phone, internship_code, message)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [firstName, lastName, email, phone || null, internshipCode || null, message]
        );

        await sendNotification("New career application enquiry", [
            `First Name: ${firstName}`,
            `Last Name: ${lastName}`,
            `Email: ${email}`,
            `Phone: ${phone || "Not provided"}`,
            `Internship Code: ${internshipCode || "Not provided"}`,
            `Message: ${message}`
        ]);

        res.status(201).json({ ok: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not save the application right now." });
    }
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
    console.log(`Website running at http://localhost:${port}`);
});
