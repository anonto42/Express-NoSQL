import { ICreateAccount, IResetPassword } from '../types/emailTamplate';

const createAccount = (values: ICreateAccount) => {
  const data = {
    to: values.email,
    subject: 'Verify your account',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #277E16; font-size: 24px; margin-bottom: 20px;">Hello, ${values.name}!</h2>
        <div style="text-align: center;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Thank you for registering with us. To complete your account setup, please verify your email by entering the OTP below:</p>
            <div style="background-color: #277E16; width: 80px; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 25px; letter-spacing: 2px; margin: 20px auto;">${values.otp}</div>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This OTP is valid for 3 minutes. Please use it to confirm your email address and activate your account.</p>
            <p style="color: #555; font-size: 16px; line-height: 1.5;">If you did not create an account with us, please ignore this email.</p>
        </div>
    </div>
</body>
`,
  };
  return data;
};

const resetPassword = (values: IResetPassword) => {
  const data = {
    to: values.email,
    subject: 'Reset your password',
    html: `
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px; color: #333;">
    <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; padding: 25px 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <h2 style="text-align: center; color: #222;">Reset Password</h2>
        <p style="font-size: 15px; text-align: center;">Use the code below to reset your password:</p>
        <div style="background-color: #277E16; width: 100px; margin: 20px auto; padding: 12px 0; border-radius: 6px; color: #fff; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 2px;">
            ${values.otp}
        </div>
        <p style="font-size: 14px; text-align: center; color: #555;">This code is valid for <strong>5 minutes</strong>.</p>
        <p style="font-size: 13px; color: #999; margin-top: 25px; line-height: 1.6;">
            If you didn’t request this code, you can safely ignore this email. Someone may have entered your email by mistake.
        </p>
    </div>
</body>
    `,
  };
  return data;
};


export const serverHome = () => (
  `<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Server Was Hacked</title>
  <style>
    @keyframes rotateGradient {
      0% {
        transform: rotate(0deg);
        opacity: 0.7;
      }
      50% {
        opacity: 1;
      }
      100% {
        transform: rotate(360deg);
        opacity: 0.7;
      }
    }
 
    @keyframes colorShift {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
 
    @keyframes glowText {
      0%, 100% {
        text-shadow:
          0 0 20px #00ffea,
          0 0 40px #00ffea,
          0 0 80px #00ffd5,
          0 0 120px #00ffd5;
        color: #00ffe0;
        transform: scale(1);
      }
      50% {
        text-shadow:
          0 0 60px #00ffd5,
          0 0 100px #00ffd5,
          0 0 140px #00ffd5;
        color: #00fff5;
        transform: scale(1.05);
      }
    }
 
    @keyframes pulseBounce {
      0%, 100% {
        transform: scale(1) translateY(0);
      }
      50% {
        transform: scale(1.1) translateY(-10px);
      }
    }
 
    @keyframes pulseRing {
      0%, 100% {
        box-shadow:
          0 0 25px #00ff00,
          0 0 40px #ffff00,
          0 0 60px #00ff00;
      }
      50% {
        box-shadow:
          0 0 50px #ffff00,
          0 0 70px #00ff00,
          0 0 100px #ffff00;
      }
    }
 
    /* Floating particles */
    @keyframes floatParticles {
      0% {
        transform: translateY(0) translateX(0);
        opacity: 0.7;
      }
      50% {
        transform: translateY(-20px) translateX(15px);
        opacity: 1;
      }
      100% {
        transform: translateY(0) translateX(0);
        opacity: 0.7;
      }
    }
 
    body {
      margin: 0;
      height: 100vh;
      background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'Orbitron', sans-serif;
      text-align: center;
      overflow: hidden;
      color: #00ffe0;
      position: relative;
    }
 
    /* Ambient floating particles */
    .particle {
      position: absolute;
      border-radius: 50%;
      background: #00ffe0;
      opacity: 0.7;
      filter: blur(3px);
      animation: floatParticles 6s ease-in-out infinite;
    }
 
    .particle:nth-child(1) {
      width: 12px;
      height: 12px;
      top: 15%;
      left: 20%;
      animation-delay: 0s;
    }
    .particle:nth-child(2) {
      width: 8px;
      height: 8px;
      top: 30%;
      left: 75%;
      animation-delay: 2s;
    }
    .particle:nth-child(3) {
      width: 10px;
      height: 10px;
      top: 60%;
      left: 40%;
      animation-delay: 4s;
    }
    .particle:nth-child(4) {
      width: 6px;
      height: 6px;
      top: 80%;
      left: 65%;
      animation-delay: 3s;
    }
    .particle:nth-child(5) {
      width: 14px;
      height: 14px;
      top: 50%;
      left: 10%;
      animation-delay: 1s;
    }
 
    /* Wrapper to hold container and animated glowing ring */
    .container-wrapper {
      position: relative;
      width: 640px;
      height: 640px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
 
    /* Pulsating glow behind container */
    .glow-pulse {
      position: absolute;
      inset: -40px;
      border-radius: 50%;
      background: radial-gradient(circle at center, #00ff00, transparent 70%);
      animation: pulseRing 4s ease-in-out infinite;
      filter: blur(40px);
      z-index: 0;
    }
 
    /* The glowing ring that rotates behind the container with color shift */
    .glowing-ring {
      position: absolute;
      inset: -20px;
      border-radius: 50%;
      padding: 20px;
      background: conic-gradient(
        from 0deg,
        #00ff00,
        #ffff00,
        #00ff00,
        #ffff00,
        #00ff00
      );
      animation: rotateGradient 6s linear infinite, colorShift 20s linear infinite;
      -webkit-mask:
        radial-gradient(farthest-side, transparent calc(100% - 20px), black calc(100% - 19px));
      mask:
        radial-gradient(farthest-side, transparent calc(100% - 20px), black calc(100% - 19px));
      z-index: 1;
      filter:
        drop-shadow(0 0 25px #00ff00)
        drop-shadow(0 0 40px #ffff00)
        drop-shadow(0 0 60px #00ff00);
      opacity: 0.8;
    }
 
    /* The circular container */
    .container {
      position: relative;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.75);
      box-sizing: border-box;
      padding: 50px;
      z-index: 2;
 
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      user-select: none;
    }
 
    .icon {
      font-size: 140px;
      margin-bottom: 20px;
      animation: glowText 3s ease-in-out infinite, pulseBounce 3s ease-in-out infinite;
      will-change: transform, text-shadow;
    }
 
    h1 {
      font-size: 4rem;
      margin: 0;
      letter-spacing: 0.1em;
      animation: glowText 4s ease-in-out infinite;
      will-change: text-shadow, transform;
    }
 
    p {
      font-size: 1.5rem;
      font-weight: 400;
      color: #a0fff5cc;
      margin: 0 20px;
      line-height: 1.5;
    }
  </style>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap" rel="stylesheet" />
</head>
<body>
  <!-- Floating ambient particles -->
  <div class="particle"></div>
  <div class="particle"></div>
  <div class="particle"></div>
  <div class="particle"></div>
  <div class="particle"></div>
 
  <div class="container-wrapper">
    <div class="glow-pulse"></div>
    <div class="glowing-ring"></div>
    <div class="container">
      <div class="icon">⚡</div>
      <h1>Server is Running</h1>
      <p>Everything is online and fully operational. Ready for your requests!</p>
    </div>
  </div>
</body>
</html>
`
)

export const emailTemplate = {
  createAccount,
  resetPassword
};
