// src/emails/ApplicationConfirmationEmail.tsx
import * as React from 'react';

interface EmailTemplateProps {
  parentEmail: string;
  learnerName: string;
  applicationId: string;
}

const logoUrl = "https://britsies-website.vercel.app/wapen.png";
const portalUrl = "https://britsies-website.vercel.app/aansoek"; // Sal later hsbrits.co.za/aansoek word
const mainColor = "#800000"; // Skool se wynrooi

export const ApplicationConfirmationEmail: React.FC<Readonly<EmailTemplateProps>> = ({
  parentEmail,
  learnerName,
  applicationId,
}) => (
  <html lang="af">
  <head>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Aansoek Ontvang</title>
    <style>
      {`
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
        .wrapper { max-width: 600px; margin: 0 auto; }
        .content-card { background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { padding: 40px 40px 30px 40px; text-align: center; }
        .body-content { padding: 0 40px 30px 40px; font-size: 16px; line-height: 1.6; color: #333333; }
        .button-link { display: inline-block; padding: 13px 28px; font-size: 16px; font-weight: bold; color: #ffffff; background-color: ${mainColor}; text-decoration: none; border-radius: 5px; }
        .footer { padding: 20px 40px; font-size: 12px; color: #999999; border-top: 1px solid #eeeeee; text-align: center; }
        .footer p { margin: 0 0 10px 0; }
      `}
    </style>
  </head>
  <body style={{ margin: '0', padding: '0', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4' }}>
    
    <table role="presentation" align="center" border={0} cellPadding={0} cellSpacing={0} width="100%" className="wrapper" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <tr>
        <td style={{ padding: '20px 0' }}>
          
          <table role="presentation" align="center" border={0} cellPadding={0} cellSpacing={0} width="100%" className="content-card" style={{ backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            
            <tr>
              <td className="header" style={{ padding: '40px 40px 30px 40px', textAlign: 'center' }}>
                <img src={logoUrl} alt="Hoërskool Brits Wapen" width="100" style={{ display: 'block', border: '0', margin: '0 auto' }} />
              </td>
            </tr>
            
            <tr>
              <td className="body-content" style={{ padding: '0 40px 30px 40px', fontSize: '16px', lineHeight: 1.6, color: '#333333' }}>
                <p style={{ margin: '0 0 20px 0' }}>Goeiedag,</p>
                
                <p style={{ margin: '0 0 25px 0' }}>
                  Baie dankie. Ons bevestig hiermee dat ons die aanlyn aansoek vir <strong>{learnerName}</strong> suksesvol ontvang het.
                </p>

                <p style={{ margin: '0 0 25px 0' }}>
                  Jou verwysingsnommer is: <strong>{applicationId}</strong>.
                </p>

                <p style={{ margin: '0 0 25px 0' }}>
                  Ons administrasie-span sal die aansoek en opgelaaide dokumente nou hersien. U kan enige tyd by die portaal inteken om die status van u aansoek na te gaan.
                </p>
                
                <table role="presentation" border={0} cellPadding={0} cellSpacing={0} width="100%">
                  <tr>
                    <td align="center" style={{ padding: '10px 0' }}>
                      <a href={portalUrl} target="_blank" className="button-link" style={{ display: 'inline-block', padding: '13px 28px', fontSize: '16px', fontWeight: 'bold', color: '#ffffff', backgroundColor: mainColor, textDecoration: 'none', borderRadius: '5px' }}>
                        Gaan na Aansoek Portaal
                      </a>
                    </td>
                  </tr>
                </table>
                
                <p style={{ margin: '40px 0 0 0' }}>
                  Dankie,
                  <br />
                  Die Hoërskool Brits Adminspan
                </p>
              </td>
            </tr>
            
            <tr>
              <td className="footer" style={{ padding: '20px 40px', fontSize: '12px', color: '#999999', borderTop: '1px solid #eeeeee', textAlign: 'center' }}>
                <p style={{ margin: '0 0 10px 0', fontStyle: 'italic' }}>Hierdie is 'n outomatiese stelsel-e-pos. Foute en onduidelikhede moet asseblief dadelik aan die skool se administrasie gekommunikeer word.</p>
                <p style={{ margin: 0 }}>Hoërskool Brits &copy; 2025. Alle regte voorbehou.</p>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
);