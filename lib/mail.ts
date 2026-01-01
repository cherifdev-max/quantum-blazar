import nodemailer from "nodemailer";

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
    const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM, SMTP_PORT } = process.env;

    let transporter;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        console.log("⚠️ Aucune config SMTP trouvée. Passage en mode Simulation Locale (Offline).");

        // Always use JSON Transport for demo to avoid network/SSL issues
        transporter = nodemailer.createTransport({
            jsonTransport: true
        });
    } else {
        transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: Number(SMTP_PORT) || 587,
            secure: Number(SMTP_PORT) === 465,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
            },
        });
    }

    try {
        const info = await transporter.sendMail({
            from: SMTP_FROM || '"SST Manager" <no-reply@sst-manager.com>',
            to,
            subject,
            html,
        });

        console.log("Message sent: %s", info.messageId);

        // Log content for JSON Transport (Offline Mode)
        // This is where the user will see the mail content in the terminal
        if ((info as any).message) {
            console.log("-----------------------------------------");
            console.log("📧 [MOCK EMAIL] Contenu simulé :");
            console.log((info as any).message);
            console.log("-----------------------------------------");
        }

        // Log Preview URL for Ethereal
        const previewUrl = nodemailer.getTestMessageUrl(info);
        if (previewUrl) {
            console.log("🔴 Email de test envoyé ! Cliquez ici pour le voir : %s", previewUrl);
        }

        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
}
