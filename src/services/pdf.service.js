const { jsPDF } = require('jspdf');
require('jspdf-autotable');

module.exports = {
  profilePdf: data => {
    const pdfDoc = new jsPDF();

    pdfDoc.text(`Hi ${data.name}`, 10, 10);
    pdfDoc.text('Here is your profile data.', 10, 20);

    pdfDoc.autoTable({
      startY: 30,
      body: [
        ['name', data.name],
        ['email', data.email],
        ['phone', data.phone || 'NA'],
        ['gender', data.gender || 'NA'],
      ],
    });

    return pdfDoc;
  },
};
