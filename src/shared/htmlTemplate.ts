import { ICreateAccount, IResetPassword } from "../types/emailTamplate";

export class HTMLTemplate {
  constructor() {}

  /**
   * Generate email data for account creation
   * @param values - name, email, otp
   */
  public createAccount(values: ICreateAccount) {
    return {
      to: values.email,
      subject: "Verify your account",
      html: `
        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
          <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
              <h2 style="color: #277E16; font-size: 24px; margin-bottom: 20px;">Hello, ${values.name}!</h2>
              <div style="text-align: center;">
                  <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                    Thank you for registering with us. To complete your account setup, please verify your email by entering the OTP below:
                  </p>
                  <div style="background-color: #277E16; width: 80px; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 25px; letter-spacing: 2px; margin: 20px auto;">
                    ${values.otp}
                  </div>
                  <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                    This OTP is valid for 3 minutes. Please use it to confirm your email address and activate your account.
                  </p>
                  <p style="color: #555; font-size: 16px; line-height: 1.5;">
                    If you did not create an account with us, please ignore this email.
                  </p>
              </div>
          </div>
        </body>
      `,
    };
  }

  /**
   * Generate email data for resetting password
   * @param values - email, otp
   */
  public resetPassword(values: IResetPassword) {
    return {
      to: values.email,
      subject: "Reset your password",
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
  }

  /**
   * Return HTML page for server home
   */
  public serverHome(): string {
    return `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <title>System is on</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Rajdhani:wght@500&display=swap');
            * { margin:0; padding:0; box-sizing:border-box; }
            body {
              height:100vh;
              overflow:hidden;
              font-family:'Orbitron',sans-serif;
              display:flex; align-items:center; justify-content:center;
              background: linear-gradient(135deg, #0b0f20, #05070c);
              position:relative;
            }
            .particles {
              position:absolute; width:100%; height:100%; background:#05070c;
              background: radial-gradient(circle at center, #001022 0%, #000 80%);
              z-index:0; overflow:hidden;
            }
            .particle {
              position:absolute; background:#00f6ff;
              opacity:0.6; border-radius:50%;
              animation: drift 6s ease-in-out infinite;
            }
            @keyframes drift {
              0% { transform: translate(0,0) scale(0.5); }
              50% { transform: translate(var(--dx), var(--dy)) scale(1); }
              100% { transform: translate(0,0) scale(0.5); }
            }
            .main {
              position:relative; z-index:2;
              background: rgba(0,0,0,0.5);
              padding:3rem 4rem;
              border:2px solid #00f6ff; border-radius:20px;
              box-shadow:
                0 0 20px #00f6ff,
                0 0 40px #ff00ff,
                0 0 80px #00f6ff;
              animation: pulseBox 5s ease-in-out infinite;
              text-align:center;
            }
            @keyframes pulseBox {
              0%,100% { transform:scale(1); box-shadow:0 0 20px #00f6ff,0 0 40px #ff00ff; }
              50% { transform:scale(1.05); box-shadow:0 0 60px #00f6ff,0 0 80px #ff00ff; }
            }
            .icon {
              font-size:6rem; color:#00f6ff;
              text-shadow:0 0 30px #00f6ff,0 0 60px #ff00ff;
              animation: rotateGlow 7s linear infinite;
            }
            @keyframes rotateGlow { 0%{transform:rotate(0deg);}100%{transform:rotate(360deg);} }
            h1 {
              margin:1rem 0; font-size:3rem; color:#fff;
              text-shadow:0 0 20px #00f6ff,0 0 40px #ff00ff;
              animation: flicker 4s infinite;
            }
            @keyframes flicker {
              0%,100% { opacity:1; }
              40%,60% { opacity:0.7; }
            }
            p {
              color:#ccc; font-family:'Rajdhani',sans-serif;
              font-size:1.3rem;
            }
          </style>
        </head>
        <body>
          <div class="particles" id="particles"></div>
          <div class="main">
            <div class="icon">🚀</div>
            <h1>Server Is Online</h1>
            <p>System fully operational. All channels green, ready for hyperspace requests!</p>
          </div>
          <script>
            const container = document.getElementById('particles');
            for(let i=0;i<15;i++){
              const p=document.createElement('div');
              p.classList.add('particle');
              const size=Math.random()*8+4;
              p.style.width=\`\${size}px\`;
              p.style.height=\`\${size}px\`;
              p.style.top=\`\${Math.random()*100}%\`;
              p.style.left=\`\${Math.random()*100}%\`;
              p.style.setProperty('--dx', (Math.random()*200-100)+'px');
              p.style.setProperty('--dy', (Math.random()*200-100)+'px');
              p.style.animationDelay=\`\${Math.random()*3}s\`;
              container.appendChild(p);
            }
          </script>
        </body>
        </html>`;
  }
}

export const htmlTemplate = new HTMLTemplate();