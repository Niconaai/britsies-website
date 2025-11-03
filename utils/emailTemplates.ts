// utils/emailTemplates.ts

// ... (hou die logoUrl, portalUrl, adminPortalUrl, mainColor konstantes) ...
const baseUrl = process.env.base_url;
const logoUrl = `${baseUrl}/wapen.png`;
const portalUrl = `${baseUrl}/aansoek`;
const adminPortalUrl = `${baseUrl}/admin`;
const mainColor = "#800000";

/**
 * 1. AANSOEK BEVESTIGING (OUER)
 */
interface ApplicationEmailProps {
  learnerName: string;
  humanReadableId: string;
}

// *** HERNOEM HIERDIE FUNKSIE ***
export function getApplicationConfirmationHtml(props: ApplicationEmailProps): string {
  const { learnerName, humanReadableId } = props;
  // ... (Die HTML vir die aansoek-e-pos bly presies dieselfde as in)
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
 * 2. ADMIN KENNISGEWING (bly dieselfde)
 *
 */
interface AdminEmailProps {
  learnerName: string;
  learnerGrade: string | null;
  parentEmail: string | null;
  humanReadableId: string;
}
export function getAdminNotificationHtml(props: AdminEmailProps): string {
  // ... (Die HTML vir die admin-e-pos bly presies dieselfde)
  const { learnerName, learnerGrade, parentEmail, humanReadableId } = props;
  const adminReviewUrl = adminPortalUrl; 
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

/**
 * 3. BESTELLING BEVESTIGING (KLIËNT) (NUUT)
 */
interface OrderEmailProps {
  customerName: string;
  orderRef: string;
  orderTotal: string;
  // Ons kan later 'n itemlys byvoeg
}

export function getOrderConfirmationHtml(props: OrderEmailProps): string {
  const { customerName, orderRef, orderTotal } = props;
  const winkelUrl = `${baseUrl}/winkel`; // `baseUrl` moet dalk ingevoer word

  return `
<!DOCTYPE html>
<html lang="af">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bestelling Bevestig</title>
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
              <p style="margin: 0 0 20px 0;">Goeiedag ${customerName},</p>
              <p style="margin: 0 0 25px 0;">
                Dankie vir jou bestelling! Ons bevestig hiermee dat ons jou bestelling <strong>#${orderRef}</strong> suksesvol ontvang het.
              </p>
              
              <div style="background-color: #f9f9f9; border: 1px solid #eeeeee; border-radius: 5px; padding: 20px; margin-bottom: 25px; text-align: center;">
                <p style="margin: 0; padding: 0;">
                  <strong style="display: block; color: #555; font-size: 14px; margin-bottom: 5px;">TOTALE BEDRAG BETAAL:</strong>
                  <span style="font-size: 24px; font-weight: bold; color: ${mainColor};">${orderTotal}</span>
                </p>
              </div>

              <p style="margin: 0 0 25px 0;">
                Jou bestelling se status is nou <strong>"Word Verwerk"</strong>. Ons sal jou in kennis stel sodra dit gereed is vir afhaal by die skool se klerebank.
              </p>
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding: 10px 0;">
                    <a href="${winkelUrl}" target="_blank" style="display: inline-block; padding: 13px 28px; font-size: 16px; font-weight: bold; color: #ffffff; background-color: ${mainColor}; text-decoration: none; border-radius: 5px;">
                      Terug na Winkel
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 40px 0 0 0;">
                Britsiegroete,
                <br />
                Die Britsie-Winkelspan
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 40px; font-size: 12px; color: #999999; border-top: 1px solid #eeeeee;">
              <p style="margin: 0 0 10px 0; font-style: italic;">Hierdie is 'n outomatiese stelsel-e-pos.</p>
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

interface ShopAdminEmailProps {
  customerName: string;
  orderRef: string;
  orderTotal: string;
  orderId: string; // Die UUID
  items: { product_name: string; quantity: number }[];
}

export function getShopAdminNotificationHtml(props: ShopAdminEmailProps): string {
  const { customerName, orderRef, orderTotal, orderId, items } = props;
  
  // Skakel direk na die admin-bestellingsbladsy
  const adminOrderUrl = `https://britsies-website.vercel.app/admin/winkel/bestellings/${orderId}`;

  // Bou die itemlys-HTML
  const itemsHtml = items
    .map(item => `
      <li style="padding: 5px 0; border-bottom: 1px solid #eee;">
        ${item.product_name} 
        <span style="color: #777;">(Hoeveelheid: ${item.quantity})</span>
      </li>
    `)
    .join('');

  return `
<!DOCTYPE html>
<html lang="af">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuwe Winkel Bestelling</title>
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
                <strong>NUWE WINKEL BESTELLING</strong>
              </p>
              <p style="margin: 0 0 25px 0;">
                'n Nuwe bestelling is ontvang en betaal. Dit is gereed om gepak te word.
              </p>
              
              <div style="background-color: #f9f9f9; border: 1px solid #eeeeee; border-radius: 5px; padding: 20px; margin-bottom: 25px;">
                <p style="margin: 0; padding: 0;">
                  <strong style="display: block; color: #555; font-size: 14px; margin-bottom: 5px;">Kliënt:</strong>
                  <span style="font-size: 16px; color: #000;">${customerName}</span>
                </p>
                <p style="margin: 15px 0 0 0; padding: 0;">
                  <strong style="display: block; color: #555; font-size: 14px; margin-bottom: 5px;">Bestel Nr:</strong>
                  <span style="font-size: 16px; color: #000;">#${orderRef}</span>
                </p>
                <p style="margin: 15px 0 0 0; padding: 0;">
                  <strong style="display: block; color: #555; font-size: 14px; margin-bottom: 5px;">Totaal Betaal:</strong>
                  <span style="font-size: 16px; color: #000; font-weight: bold;">${orderTotal}</span>
                </p>
              </div>

              <h3 style="font-size: 16px; font-weight: bold; color: #333; margin-top: 30px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">Items</h3>
              <ul style="list-style-type: none; padding-left: 0; margin: 0 0 30px 0;">
                ${itemsHtml}
              </ul>
              
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="padding: 10px 0;">
                    <a href="${adminOrderUrl}" target="_blank" style="display: inline-block; padding: 13px 28px; font-size: 16px; font-weight: bold; color: #ffffff; background-color: ${mainColor}; text-decoration: none; border-radius: 5px;">
                      Bestuur Bestelling in Admin
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 40px; font-size: 12px; color: #999999; border-top: 1px solid #eeeeee;">
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