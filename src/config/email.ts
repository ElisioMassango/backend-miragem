import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendWelcomeEmail = async (email: string, name: string) => {
  const emailHtml = `
  <!DOCTYPE html>
  <html lang="pt">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>Bem-vindo à Miragem</title>
  </head>
  
  <body style="margin:0;padding:0;background:#000000;">
    <!-- Preheader (hidden) -->
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      O seu registo foi recebido. Em breve, receberá os próximos passos.
    </div>
  
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background:#000000;">
      <tr>
        <td align="center" style="padding:56px 18px;">
  
          <!-- Outer Glow (email-safe via nested table + background color) -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;border-collapse:collapse;">
            <tr>
              <td style="
                background:#000000;
                padding:1px;
                ">
                <!-- Main Container -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="
                  border-collapse:collapse;
                  background:#070808;
                  border:1px solid rgba(239,209,159,0.16);
                  border-radius:10px;
                  overflow:hidden;
                ">
                  <!-- Top Halo Strip -->
                  <tr>
                    <td style="
                      background: radial-gradient(120% 120% at 50% 0%, rgba(3,70,56,0.55) 0%, rgba(0,0,0,0.92) 60%, #000000 100%);
                      padding:34px 40px 18px;
                    ">
                      <!-- Logo Image -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                        <tr>
                          <td align="center" style="padding:0 0 10px;">
                            <img
                              src="https://newsletter.miragemparfum.com/assets/logo_8@2x-CT9LhehC.png"
                              width="160"
                              alt="Miragem"
                              style="display:block;border:0;outline:none;text-decoration:none;height:auto;max-width:160px;"
                              onerror="this.style.display='none';"
                            />
                            <!-- Fallback (if image blocked) -->
                     
                        
                          </td>
                        </tr>
  
                        <tr>
                          <td align="center" style="padding:14px 0 0;">
                            <div style="width:56px;height:1px;background:linear-gradient(to right, transparent, rgba(239,209,159,0.9), transparent);"></div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
  
                  <!-- Body -->
                  <tr>
                    <td style="padding:34px 42px 22px;background:#070808;">
                      <div style="
                        font-family: Georgia, 'Times New Roman', Times, serif;
                        font-size:26px;
                        line-height:1.25;
                        color:#F6F0DF;
                        font-weight:400;
                        letter-spacing:0.5px;
                        margin:0 0 18px;
                      ">
                        Bem-vindo à Miragem${name ? `, ${name.split(' ')[0]}` : ''}
                      </div>

                      <div style="
                        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
                        font-size:15px;
                        line-height:1.9;
                        color:rgba(246,240,223,0.88);
                        font-weight:300;
                        margin:0 0 18px;
                      ">
                        Olá ${name},
                      </div>
  
                      <div style="
                        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
                        font-size:15px;
                        line-height:1.9;
                        color:rgba(246,240,223,0.88);
                        font-weight:300;
                        margin:0 0 18px;
                      ">
                        ${name ? `${name.split(' ')[0]}, ` : ''}O seu registo foi recebido com distinção.
                      </div>

                      <div style="
                        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
                        font-size:15px;
                        line-height:1.9;
                        color:rgba(246,240,223,0.88);
                        font-weight:300;
                        margin:0 0 22px;
                      ">
                        Foi adicionado(a) à lista de espera do <span style="color:#EFD19F;">Miragem Club</span> — um espaço reservado a quem será convidado
                        a entrar no nosso universo privado.
                      </div>
  
                      <!-- Accent Quote Block -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:26px 0 18px;">
                        <tr>
                          <td style="
                            border-left:2px solid rgba(239,209,159,0.55);
                            padding:6px 0 6px 16px;
                          ">
                            <div style="
                              font-family: Georgia, 'Times New Roman', Times, serif;
                              font-size:16px;
                              line-height:1.8;
                              color:rgba(239,209,159,0.92);
                              font-style:italic;
                              margin:0;
                            ">
                              Algumas experiências não se compram.<br/>
                              São concedidas.
                            </div>
                          </td>
                        </tr>
                      </table>
  
                      <div style="
                        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
                        font-size:15px;
                        line-height:1.9;
                        color:rgba(246,240,223,0.88);
                        font-weight:300;
                        margin:0 0 26px;
                      ">
                        ${name ? `${name.split(' ')[0]}, ` : ''}Em breve, receberá uma mensagem com os próximos passos e instruções para activar o seu acesso.
                      </div>
  
                      <!-- Subtle Signature -->
                      <div style="
                        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
                        font-size:13px;
                        line-height:1.9;
                        color:rgba(246,240,223,0.78);
                        font-weight:300;
                        margin:0;
                      ">
                        A Miragem aproxima-se.
                      </div>
                    </td>
                  </tr>
  
                  <!-- Footer -->
                  <tr>
                    <td style="padding:20px 42px 34px;background:#070808;">
                      <div style="height:1px;background:linear-gradient(to right, transparent, rgba(239,209,159,0.22), transparent);"></div>
  
                      <div style="
                        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
                        font-size:11px;
                        line-height:1.8;
                        color:rgba(246,240,223,0.55);
                        font-weight:300;
                        text-align:center;
                        margin:16px 0 0;
                      ">
                        Comunicações ocasionais, sempre com elegância.
                      </div>
  
                      <div style="
                        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;
                        font-size:10px;
                        line-height:1.8;
                        color:rgba(246,240,223,0.40);
                        font-weight:300;
                        text-align:center;
                        margin:8px 0 0;
                      ">
                        © Miragem. Todos os direitos reservados.
                      </div>
                    </td>
                  </tr>
  
                </table>
                <!-- /Main Container -->
              </td>
            </tr>
          </table>
  
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
  

  
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'Miragem <noreply@miragem.com>',
    to: email,
    subject: name ? `Bem-vindo à Miragem, ${name.split(' ')[0]}` : 'Bem-vindo à Miragem',
    html: emailHtml,
    text: `
Bem-vindo à Miragem${name ? `, ${name.split(' ')[0]}` : ''}

Olá ${name},

${name ? `${name.split(' ')[0]}, ` : ''}A sua inscrição foi recebida.

Foi adicionado(a) à lista de espera do Miragem Club — um espaço reservado a quem será convidado para entrar no nosso universo privado.

${name ? `${name.split(' ')[0]}, ` : ''}Em breve, receberá um e-mail com os seus próximos passos e instruções para activar o seu acesso.

Algumas experiências não se compram.
São concedidas.
A Miragem aproxima-se.

Comunicações ocasionais, sempre com elegância.
    `.trim(),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email enviado para: ${email}`);
    return true;
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return false;
  }
};
