import nodemailer from 'nodemailer';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { NextRequest, NextResponse } from 'next/server';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Build PDF
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([612, 792]);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    let y = 750;
    const margin = 50;

    const draw = (label: string, value: string) => {
      if (y < 80) {
        page = pdfDoc.addPage([612, 792]);
        y = 750;
      }
      page.drawText(label + ':', { x: margin, y, font: bold, size: 10, color: rgb(0.12, 0.16, 0.29) });
      const displayValue = value || '—';
      const words = displayValue.split(' ');
      let line = '';
      let firstLine = true;
      for (const word of words) {
        const testLine = line ? line + ' ' + word : word;
        if (font.widthOfTextAtSize(testLine, 10) > 350 && line) {
          page.drawText(line, { x: 210, y: firstLine ? y : y, font, size: 10, color: rgb(0.2, 0.2, 0.2) });
          y -= 16;
          if (y < 80) { page = pdfDoc.addPage([612, 792]); y = 750; }
          line = word;
          firstLine = false;
        } else {
          line = testLine;
        }
      }
      if (line) {
        page.drawText(line, { x: 210, y, font, size: 10, color: rgb(0.2, 0.2, 0.2) });
      }
      y -= 20;
    };

    page.drawText('iCANS — Job Application', { x: margin, y, font: bold, size: 14, color: rgb(0.13, 0.47, 0.23) });
    y -= 10;
    page.drawLine({ start: { x: margin, y }, end: { x: 562, y }, thickness: 1, color: rgb(0.13, 0.47, 0.23) });
    y -= 24;

    const fields: [string, string][] = [
      ['First name',         data.firstName],
      ['Last name',          data.lastName],
      ['Email',              data.email],
      ['Phone',              data.phone],
      ['Location',           data.location],
      ['LinkedIn/Portfolio', data.linkedinOrPortfolio],
      ['Role',               data.roleApplyingFor],
      ['How did you hear',   data.howDidYouHear],
      ['Engagement type',    data.engagementType],
      ['Start date',         data.availableStartDate],
      ['Compensation',       data.compensationExpectation],
      ['Hours/week',         data.hoursPerWeek],
      ['Work auth',          data.workAuthorization],
      ['Sponsorship',        data.requiresSponsorship],
      ['Years experience',   data.yearsOfExperience],
      ['Skills',             data.relevantSkills],
      ['Why iCANS',          data.whyICANS],
      ['Resume link',        data.resumeLink],
      ['Equity openness',    data.equityOpenness],
      ['Reference 1',        data.reference1],
      ['Reference 2',        data.reference2],
      ['Additional notes',   data.additionalComments],
    ];

    fields.forEach(([label, value]) => draw(label, value));

    const pdfBytes = await pdfDoc.save();

    await transporter.sendMail({
      from: `"iCANS Applications" <${process.env.GMAIL_USER}>`,
      to: 'onboarding@icans.ai',
      replyTo: `"${data.firstName} ${data.lastName}" <${data.email}>`,
      subject: `New Application — ${data.firstName} ${data.lastName} (${data.roleApplyingFor})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1e2a4a; padding: 24px; border-radius: 8px 8px 0 0;">
            <h1 style="color: #22c55e; margin: 0; font-size: 20px;">iCANS — New Job Application</h1>
          </div>
          <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; color: #6b7280; width: 140px;">Name</td><td style="padding: 6px 0; font-weight: 600;">${data.firstName} ${data.lastName}</td></tr>
              <tr><td style="padding: 6px 0; color: #6b7280;">Email</td><td style="padding: 6px 0;">${data.email}</td></tr>
              <tr><td style="padding: 6px 0; color: #6b7280;">Role</td><td style="padding: 6px 0; font-weight: 600;">${data.roleApplyingFor}</td></tr>
              <tr><td style="padding: 6px 0; color: #6b7280;">Engagement</td><td style="padding: 6px 0;">${data.engagementType}</td></tr>
              <tr><td style="padding: 6px 0; color: #6b7280;">Work Auth</td><td style="padding: 6px 0;">${data.workAuthorization}</td></tr>
              <tr><td style="padding: 6px 0; color: #6b7280;">Sponsorship</td><td style="padding: 6px 0;">${data.requiresSponsorship}</td></tr>
              <tr><td style="padding: 6px 0; color: #6b7280; vertical-align: top;">Why iCANS</td><td style="padding: 6px 0;">${data.whyICANS}</td></tr>
            </table>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
            <p style="color: #6b7280; font-size: 14px; margin: 0;">Full details attached as PDF.</p>
          </div>
        </div>`,
      attachments: [{
        filename: `application-${data.firstName}-${data.lastName}.pdf`,
        content: Buffer.from(pdfBytes),
      }],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Application submission error:', err);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}
