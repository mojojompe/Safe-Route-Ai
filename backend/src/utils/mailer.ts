import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.MAIL_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
})

export async function sendOtpEmail(to: string, name: string, code: string, type: 'signup' | 'reset') {
    const subject = type === 'signup'
        ? `Your Safe Route AI verification code: ${code}`
        : `Reset your Safe Route AI password: ${code}`

    const html = `
  <!DOCTYPE html>
  <html>
  <head><meta charset="UTF-8"/></head>
  <body style="margin:0;padding:0;background:#0a0f14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f14;min-height:100vh;">
      <tr><td align="center" style="padding:40px 20px;">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#111820;border-radius:20px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0a1a0f,#0d2018);padding:32px;text-align:center;border-bottom:1px solid rgba(0,211,90,0.15);">
              <div style="display:inline-block;width:60px;height:60px;background:rgba(0,211,90,0.12);border:2px solid #00d35a;border-radius:18px;line-height:60px;font-size:28px;margin-bottom:12px;">📍</div>
              <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:800;letter-spacing:-0.3px;">Safe Route AI</h1>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.5);font-size:12px;letter-spacing:1px;text-transform:uppercase;">Navigate Safely</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px;">
              <p style="margin:0 0 8px;color:rgba(255,255,255,0.6);font-size:14px;">Hi ${name},</p>
              <h2 style="margin:0 0 16px;color:#ffffff;font-size:22px;font-weight:700;">
                ${type === 'signup' ? 'Verify your email' : 'Reset your password'}
              </h2>
              <p style="margin:0 0 28px;color:rgba(255,255,255,0.55);font-size:15px;line-height:1.6;">
                ${type === 'signup'
            ? 'Enter the code below to verify your email and activate your Safe Route AI account.'
            : 'Enter this code to reset your password. Never share this with anyone.'}
              </p>

              <!-- OTP CODE -->
              <div style="background:rgba(0,211,90,0.08);border:2px dashed rgba(0,211,90,0.4);border-radius:16px;padding:24px;text-align:center;margin-bottom:28px;">
                <p style="margin:0 0 4px;color:rgba(255,255,255,0.4);font-size:11px;letter-spacing:2px;text-transform:uppercase;">Your verification code</p>
                <p style="margin:0;color:#00d35a;font-size:42px;font-weight:900;letter-spacing:10px;font-variant-numeric:tabular-nums;">${code}</p>
              </div>

              <p style="margin:0;color:rgba(255,255,255,0.4);font-size:13px;text-align:center;">
                ⏱ This code expires in <strong style="color:rgba(255,255,255,0.6);">3 minutes</strong>
              </p>
            </td>
          </tr>

          <!-- Safety tip -->
          <tr>
            <td style="padding:0 32px 32px;">
              <div style="background:rgba(255,255,255,0.03);border-radius:12px;border:1px solid rgba(255,255,255,0.06);padding:16px;">
                <p style="margin:0;color:rgba(255,255,255,0.4);font-size:12px;line-height:1.6;">
                  🛡️ <strong style="color:rgba(255,255,255,0.6);">Safety tip:</strong> Safe Route AI will never ask for your password or OTP via phone or chat. If you didn't request this, please ignore this email.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
              <p style="margin:0;color:rgba(255,255,255,0.25);font-size:11px;">
                © 2026 Safe Route AI · Nigeria's Route Safety Platform
              </p>
            </td>
          </tr>

        </table>
      </td></tr>
    </table>
  </body>
  </html>`

    await transporter.sendMail({
        from: process.env.MAIL_FROM || '"Safe Route AI" <saferouteai@gmail.com>',
        to,
        subject,
        html,
    })
}
