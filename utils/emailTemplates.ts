// src/utils/emailTemplates.ts

// Konstantes vir albei e-posse
const logoUrl = "https://britsies-website.vercel.app/wapen.png";
const mainColor = "#800000"; // Skool se wynrooi
const portalUrl = "https://britsies-website.vercel.app/aansoek"; // Sal later hsbrits.co.za/aansoek word
const adminPortalUrl = `https://britsies-website.vercel.app/admin`;

/**
 * 1. AANSOEK BEVESTIGING (OUER)
 */
interface ParentEmailProps {
  learnerName: string;
  humanReadableId: string;
}

export function getParentConfirmationHtml(props: ParentEmailProps): string {
  const { learnerName, humanReadableId } = props;

  // Gebruik 'n template literal (` `` `) om die HTML-string te bou
  return `
<!DOCTYPE html>
<html lang="af">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aansoek Ontvang</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto;">
    <tr>
      <td style="padding: 20px 0;">
        <table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <tr>
            <td align="center" style="padding: 40px 40px 30px 40px;">
              <img src="${logoUrl}" alt="Hoërskool Brits Wapen" width="100" style="display: block; border: 0; margin: 0 auto;">
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 30px 40px; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333;">
              <p style="margin: 0 0 20px 0;">Goeiedag,</p>
              <p style="margin: 0 0 25px 0;">
                Baie dankie. Ons bevestig hiermee dat ons die aanlyn aansoek vir <strong>${learnerName}</strong> suksesvol ontvang het.
              </p>
              <p style="margin: 0 0 25px 0;">
                Jou verwysingsnommer is: <strong>${humanReadableId}</strong>.
              </p>
              <p style="margin: 0 0 25px 0;">
                Ons administrasie-span sal die aansoek en opgelaaide dokumente nou hersien. U kan enige tyd by die portaal inteken om die status van u aansoek na te gaan.
              </p>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding: 10px 0;">
                    <a href="${portalUrl}" target="_blank" style="display: inline-block; padding: 13px 28px; font-size: 16px; font-weight: bold; color: #ffffff; background-color: ${mainColor}; text-decoration: none; border-radius: 5px;">
                      Gaan na Aansoek Portaal
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 40px 0 0 0;">
                Britsiegroete,
                <br />
                Hoërskool Brits Aansoeke
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 40px; font-size: 12px; color: #999999; border-top: 1px solid #eeeeee;">
              <p style="margin: 0 0 10px 0; font-style: italic;">Hierdie is 'n outomatiese stelsel-e-pos. Foute en onduidelikhede moet asseblief dadelik aan die skool se administrasie gekommunikeer word.</p>
              <p style="margin: 0;">Hoërskool Brits &copy; 2025. Alle regte voorbehou.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}


/**
 * 2. NUWE AANSOEK KENNISGEWING (ADMIN)
 */
interface AdminEmailProps {
  learnerName: string;
  learnerGrade: string | null;
  parentEmail: string | null;
  humanReadableId: string;
}

export function getAdminNotificationHtml(props: AdminEmailProps): string {
  const { learnerName, learnerGrade, parentEmail, humanReadableId } = props;
  
  // TODO: Ons moet hierdie URL later opdateer om na die spesifieke aansoek te wys
  // const adminReviewUrl = `${adminPortalUrl}/applications/${applicationId}`;
  const adminReviewUrl = adminPortalUrl; // Vir eers

  return `
<!DOCTYPE html>
<html lang="af">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuwe Aansoek Ontvang</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto;">
    <tr>
      <td style="padding: 20px 0;">
        <table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <tr>
            <td align="center" style="padding: 40px 40px 30px 40px;">
              <img src="${logoUrl}" alt="Hoërskool Brits Wapen" width="100" style="display: block; border: 0; margin: 0 auto;">
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 30px 40px; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333333;">
              <p style="margin: 0 0 25px 0; font-size: 20px; font-weight: bold;">
                <strong>NUWE AANLYN AANSOEK</strong>
              </p>
              <p style="margin: 0 0 25px 0;">
                'n Nuwe aansoek is sopas ingedien en wag vir hersiening in die Admin Paneelblad.
              </p>
              
              <div style="background-color: #f9f9f9; border: 1px solid #eeeeee; border-radius: 5px; padding: 20px; margin-bottom: 25px;">
                <p style="margin: 0; padding: 0;">
                  <strong style="display: block; color: #555; font-size: 14px; margin-bottom: 5px;">Leerder:</strong>
                  <span style="font-size: 16px; color: #000;">${learnerName}</span>
                </p>
                <p style="margin: 15px 0 0 0; padding: 0;">
                  <strong style="display: block; color: #555; font-size: 14px; margin-bottom: 5px;">Graad Aansoek:</strong>
                  <span style="font-size: 16px; color: #000;">Graad ${learnerGrade || 'N/A'}</span>
                </p>
                <p style="margin: 15px 0 0 0; padding: 0;">
                  <strong style="display: block; color: #555; font-size: 14px; margin-bottom: 5px;">Ouer E-pos:</strong>
                  <span style="font-size: 16px; color: #000;">${parentEmail || 'N/A'}</span>
                </p>
                <p style="margin: 15px 0 0 0; padding: 0;">
                  <strong style="display: block; color: #555; font-size: 14px; margin-bottom: 5px;">Verwysingsnommer:</strong>
                  <span style="font-size: 16px; color: #000;">${humanReadableId}</span>
                </p>
              </div>
              
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding: 10px 0;">
                    <a href="${adminReviewUrl}" target="_blank" style="display: inline-block; padding: 13px 28px; font-size: 16px; font-weight: bold; color: #ffffff; background-color: ${mainColor}; text-decoration: none; border-radius: 5px;">
                      Gaan na Admin Paneelblad
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 40px; font-size: 12px; color: #999999; border-top: 1px solid #eeeeee;">
              <p style="margin: 0 0 10px 0; font-style: italic;">Hierdie is 'n outomatiese stelsel-e-pos.</p>
              <p style="margin: 0;">Hoërskool Brits &copy; 2025</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}