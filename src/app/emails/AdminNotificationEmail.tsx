// src/emails/AdminNotificationEmail.tsx
import * as React from 'react';

interface EmailTemplateProps {
  learnerName: string;
  learnerGrade: string | null; // Grade is 'string | undefined' van textData
  parentEmail: string | null;
  applicationId: string;
}

const logoUrl = "https://britsies-website.vercel.app/wapen.png";
// TODO: Update this URL to point to the specific application review page
const adminPortalUrl = `https://britsies-website.vercel.app/admin`; 
const mainColor = "#800000";

export const AdminNotificationEmail: React.FC<Readonly<EmailTemplateProps>> = ({
  learnerName,
  learnerGrade,
  parentEmail,
  applicationId,
}) => (
  <html lang="af">
  <head>
    <meta charSet="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nuwe Aansoek Ontvang</title>
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
        .info-box { background-color: #f9f9f9; border: 1px solid #eeeeee; border-radius: 5px; padding: 20px; margin-bottom: 25px; }
        .info-box strong { display: block; color: #555; font-size: 14px; margin-bottom: 5px; }
        .info-box span { font-size: 16px; color: #000; }
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
                <p style={{ margin: '0 0 25px 0', fontSize: '20px', fontWeight: 'bold' }}>
                  <strong>NUWE AANLYN AANSOEK</strong>
                </p>
                
                <p style={{ margin: '0 0 25px 0' }}>
                  'n Nuwe aansoek is sopas ingedien en wag vir hersiening in die Admin Paneelblad.
                </p>

                <div className="info-box" style={{ backgroundColor: '#f9f9f9', border: '1px solid #eeeeee', borderRadius: '5px', padding: '20px', marginBottom: '25px' }}>
                  <p style={{ margin: 0, padding: 0 }}>
                    <strong style={{ display: 'block', color: '#555', fontSize: '14px', marginBottom: '5px' }}>Leerder:</strong>
                    <span style={{ fontSize: '16px', color: '#000' }}>{learnerName}</span>
                  </p>
                  <p style={{ margin: '15px 0 0 0', padding: 0 }}>
                    <strong style={{ display: 'block', color: '#555', fontSize: '14px', marginBottom: '5px' }}>Graad Aansoek:</strong>
                    <span style={{ fontSize: '16px', color: '#000' }}>Graad {learnerGrade || 'N/A'}</span>
                  </p>
                  <p style={{ margin: '15px 0 0 0', padding: 0 }}>
                    <strong style={{ display: 'block', color: '#555', fontSize: '14px', marginBottom: '5px' }}>Ouer E-pos:</strong>
                    <span style={{ fontSize: '16px', color: '#000' }}>{parentEmail || 'N/A'}</span>
                  </p>
                  <p style={{ margin: '15px 0 0 0', padding: 0 }}>
                    <strong style={{ display: 'block', color: '#555', fontSize: '14px', marginBottom: '5px' }}>Verwysingsnommer:</strong>
                    <span style={{ fontSize: '16px', color: '#000' }}>{applicationId}</span>
                  </p>
                </div>
                
                <table role="presentation" border={0} cellPadding={0} cellSpacing={0} width="100%">
                  <tr>
                    <td align="center" style={{ padding: '10px 0' }}>
                      <a href={adminPortalUrl} target="_blank" className="button-link" style={{ display: 'inline-block', padding: '13px 28px', fontSize: '16px', fontWeight: 'bold', color: '#ffffff', backgroundColor: mainColor, textDecoration: 'none', borderRadius: '5px' }}>
                        Gaan na Admin Paneelblad
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <tr>
              <td className="footer" style={{ padding: '20px 40px', fontSize: '12px', color: '#999999', borderTop: '1px solid #eeeeee', textAlign: 'center' }}>
                <p style={{ margin: '0 0 10px 0', fontStyle: 'italic' }}>Hierdie is 'n outomatiese stelsel-e-pos.</p>
                <p style={{ margin: 0 }}>Hoërskool Brits &copy; 2025</p>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
);