import nodemailer from 'nodemailer';

interface BookingDetails {
  reservationId: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  totalAmount: string;
  guests: number;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configure email transporter (using Gmail as example)
    this.transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-hotel@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password',
      },
    });
  }

  async sendBookingConfirmation(bookingDetails: BookingDetails): Promise<boolean> {
    try {
      const {
        reservationId,
        guestName,
        guestEmail,
        checkIn,
        checkOut,
        roomType,
        totalAmount,
        guests,
      } = bookingDetails;

      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@kiyakuhotel.com',
        to: guestEmail,
        subject: `Booking Confirmation - ${reservationId} | Kiyaku Smart Hotel`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2c3e50; margin: 0;">Kiyaku Smart Hotel</h1>
                <p style="color: #7f8c8d; margin: 5px 0;">Tokyo, Japan</p>
              </div>
              
              <h2 style="color: #27ae60; text-align: center; margin-bottom: 20px;">Booking Confirmed!</h2>
              
              <div style="background-color: #ecf0f1; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
                <h3 style="color: #2c3e50; margin-top: 0;">Reservation Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #34495e;">Confirmation Number:</td>
                    <td style="padding: 8px 0; color: #2c3e50;">${reservationId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #34495e;">Guest Name:</td>
                    <td style="padding: 8px 0; color: #2c3e50;">${guestName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #34495e;">Check-in:</td>
                    <td style="padding: 8px 0; color: #2c3e50;">${checkIn}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #34495e;">Check-out:</td>
                    <td style="padding: 8px 0; color: #2c3e50;">${checkOut}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #34495e;">Room Type:</td>
                    <td style="padding: 8px 0; color: #2c3e50;">${roomType}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #34495e;">Guests:</td>
                    <td style="padding: 8px 0; color: #2c3e50;">${guests}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold; color: #34495e;">Rate per night:</td>
                    <td style="padding: 8px 0; color: #2c3e50;">$${totalAmount}</td>
                  </tr>
                </table>
              </div>
              
              <div style="background-color: #3498db; color: white; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <h3 style="margin-top: 0; color: white;">What's Included</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  <li>Complimentary WiFi</li>
                  <li>Daily breakfast</li>
                  <li>24-hour room service</li>
                  <li>Fitness center access</li>
                  <li>Concierge service</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1;">
                <p style="color: #7f8c8d; margin: 5px 0;">Thank you for choosing Kiyaku Smart Hotel!</p>
                <p style="color: #7f8c8d; margin: 5px 0;">123 Tokyo Street, Shibuya, Tokyo, Japan</p>
                <p style="color: #7f8c8d; margin: 5px 0;">Phone: +81-3-1234-5678 | Email: reservations@kiyakuhotel.com</p>
              </div>
            </div>
          </div>
        `,
        text: `
Booking Confirmation - Kiyaku Smart Hotel

Dear ${guestName},

Your reservation has been confirmed!

Confirmation Number: ${reservationId}
Check-in: ${checkIn}
Check-out: ${checkOut}
Room Type: ${roomType}
Guests: ${guests}
Rate per night: $${totalAmount}

Includes: Complimentary WiFi, Daily breakfast, 24-hour room service, Fitness center access, Concierge service

Thank you for choosing Kiyaku Smart Hotel!
123 Tokyo Street, Shibuya, Tokyo, Japan
Phone: +81-3-1234-5678
        `,
      };

      await this.transporter.sendMail(mailOptions);
      console.log('✅ Booking confirmation email sent to:', guestEmail);
      return true;
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();