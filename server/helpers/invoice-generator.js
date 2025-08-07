const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class InvoiceGenerator {
  constructor() {
    this.doc = new PDFDocument({
      size: 'A4',
      margin: 30
    });
  }

  generateInvoice(orderData, userData) {
    const doc = this.doc;
    
    // Add watermark as background (so it appears behind everything)
    this.addWatermark();
    
    // Add company header
    this.addHeader();
    
    // Add invoice details
    this.addInvoiceDetails(orderData);
    
    // Add customer information
    this.addCustomerInfo(userData, orderData.addressInfo);
    
    // Add order items
    this.addOrderItems(orderData.cartItems);
    
    // Add price breakdown
    this.addPriceBreakdown(orderData);
    
    // Add footer
    this.addFooter(orderData);
    
    return doc;
  }

  addWatermark() {
    const doc = this.doc;
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    
    // Save current state
    doc.save();
    
          // Try to load logo for watermark - only use full logo.png
      const possiblePaths = [
        path.join(__dirname, './logo.png'), // Only use full logo.png in server folder
        '/server/logo.png' // Absolute path in Docker container
      ];
    
    let logoPath = null;
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        logoPath = testPath;
        console.log('Logo watermark found at:', logoPath);
        break;
      }
    }
    
    if (logoPath) {
      try {
        doc.save();

        const imageWidth = 100;
        const imageHeight = 150;

        doc.translate(pageWidth / 2, pageHeight / 2);
        doc.opacity(0.30);
        doc.rotate(0);
        // Add logo with transparency effect - centered
        doc.image(logoPath, -imageWidth / 2, -imageHeight / 2, { 
          width: imageWidth, 
          height: imageHeight,
          align: 'center',
        });
        
      } catch (imageError) {
        console.log('Error adding logo watermark:', imageError.message);
        // Fallback to text watermark if image fails
        doc.fontSize(40)
           .font('Helvetica-Bold')
           .fillColor('#D3D3D3')
           .rotate(-45, { origin: [pageWidth / 2, pageHeight / 2] });
        
        doc.text('Shree Jewel Palace', pageWidth / 2 - 200, pageHeight / 2 - 35);
      }
    } else {
      // Fallback to text watermark if logo not found
      console.log('Logo not found for watermark, using text fallback');
      doc.fontSize(40)
         .font('Helvetica-Bold')
         .fillColor('#D3D3D3')
         .rotate(-45, { origin: [pageWidth / 2, pageHeight / 2] });
      
      doc.text('Shree Jewel Palace', pageWidth / 2 - 200, pageHeight / 2 - 35);
    }
    
    // Restore state
    doc.restore();
  }

  addHeader() {
    const doc = this.doc;
    
    // Company name (centered)
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .fillColor('#1f2937')
       .text('Shree Jewel Palace', 50, 60);
    
    doc.fontSize(12)
       .font('Helvetica')
       .fillColor('#6b7280')
       .text('Premium Silk Sarees & Traditional Wear', 50, 90);
    
    // Contact information
    doc.fontSize(10)
       .text('Email: Shreejewelpalace1983@gmail.com', 50, 110)
       .text('Phone: +91 99943 65510', 50, 125);
    
    // Add a line separator
    doc.moveTo(50, 150)
       .lineTo(550, 150)
       .strokeColor('#e5e7eb')
       .stroke();
  }



  addInvoiceDetails(orderData) {
    const doc = this.doc;
    
    // Invoice title
    doc.fontSize(18)
       .font('Helvetica-Bold')
       .fillColor('#1f2937')
       .text('INVOICE', 350, 60);
    
    // Invoice details
    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#374151');
    
    doc.text('Invoice Number:', 350, 90)
       .font('Helvetica-Bold')
       .text(orderData._id.toString().substring(0, 12) + '...', 450, 90);
    
    doc.font('Helvetica')
       .text('Order Date:', 350, 105)
       .font('Helvetica-Bold')
       .text(new Date(orderData.orderDate).toLocaleDateString(), 450, 105);
    
    doc.font('Helvetica')
       .text('Payment Method:', 350, 120)
       .font('Helvetica-Bold')
       .text(orderData.paymentMethod.toUpperCase(), 450, 120);
    
    doc.font('Helvetica')
       .text('Order Status:', 350, 135)
       .font('Helvetica-Bold')
       .text(orderData.orderStatus.toUpperCase(), 450, 135);
  }

  addCustomerInfo(userData, addressInfo) {
    const doc = this.doc;
    
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#1f2937')
       .text('Bill To:', 50, 200);
    
    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#374151')
       .text(userData.userName, 50, 225)
       .text(addressInfo.address, 50, 240);
    
    let yPos = 255;
    if (addressInfo.city && addressInfo.city.trim() !== '') {
      doc.text(addressInfo.city, 50, yPos);
      yPos += 15;
    }
    if (addressInfo.state && addressInfo.state.trim() !== '') {
      doc.text(addressInfo.state, 50, yPos);
      yPos += 15;
    }
    
    doc.text(addressInfo.country, 50, yPos)
       .text(`Pincode: ${addressInfo.pincode}`, 50, yPos + 15)
       .text(`Phone: ${addressInfo.phone}`, 50, yPos + 30);
    
    // Add a line separator
    doc.moveTo(50, yPos + 50)
       .lineTo(550, yPos + 50)
       .strokeColor('#e5e7eb')
       .stroke();
  }

  addOrderItems(cartItems) {
    const doc = this.doc;
    
    doc.fontSize(14)
       .font('Helvetica-Bold')
       .fillColor('#1f2937')
       .text('Order Items:', 50, 380);
    
    // Table headers
    const startY = 405;
    doc.fontSize(10)
       .font('Helvetica-Bold')
       .fillColor('#374151')
       .text('Item', 50, startY)
       .text('Quantity', 300, startY)
       .text('Price', 400, startY)
       .text('Total', 500, startY);
    
    // Add line under headers
    doc.moveTo(50, startY + 15)
       .lineTo(550, startY + 15)
       .strokeColor('#e5e7eb')
       .stroke();
    
    // Add items
    let currentY = startY + 25;
    cartItems.forEach((item, index) => {
      if (currentY > 700) {
        doc.addPage();
        currentY = 50;
        // Add watermark to new page
        this.addWatermark();
      }
      
      doc.fontSize(9)
         .font('Helvetica')
         .fillColor('#374151')
         .text(item.title, 50, currentY, { width: 240 })
         .text(item.quantity.toString(), 300, currentY)
         .text(`Rs. ${item.price}`, 400, currentY)
         .text(`Rs. ${(item.price * item.quantity).toFixed(2)}`, 500, currentY);
      
      currentY += 20;
    });
    
    // Add line after items
    doc.moveTo(50, currentY + 5)
       .lineTo(550, currentY + 5)
       .strokeColor('#e5e7eb')
       .stroke();
  }

  addPriceBreakdown(orderData) {
    const doc = this.doc;
    
    const startY = 600;
    
    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#374151');
    
    doc.text('Subtotal:', 400, startY)
       .font('Helvetica-Bold')
       .text(`Rs.${orderData.subtotal.toFixed(2)}`, 500, startY);
    
    doc.font('Helvetica')
       .text('Tax:', 400, startY + 15)
       .font('Helvetica-Bold')
       .text(`Rs.${orderData.taxAmount.toFixed(2)}`, 500, startY + 15);
    
    doc.font('Helvetica')
       .text('Shipping:', 400, startY + 30)
       .font('Helvetica-Bold')
       .text(`Rs.${orderData.shippingCharges.toFixed(2)}`, 500, startY + 30);
    
    // Total line
    doc.moveTo(400, startY + 45)
       .lineTo(550, startY + 45)
       .strokeColor('#1f2937')
       .stroke();
    
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .fillColor('#1f2937')
       .text('Total:', 400, startY + 55)
       .text(`Rs.${orderData.totalAmount.toFixed(2)}`, 500, startY + 55);
  }

  addFooter(orderData) {
    const doc = this.doc;
    
    doc.fontSize(10)
       .font('Helvetica')
       .fillColor('#6b7280')
       .text('Thank you for your purchase!', 50, 750)
       .text('For any queries, please contact us at Shreejewelpalace1983@gmail.com', 50, 765)
       .text('This is a computer generated invoice.', 50, 780)
       .text(`Full Invoice ID: ${orderData?._id?.toString() || 'N/A'}`, 50, 795);
  }

  generatePDFBuffer(orderData, userData) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      
      this.doc.on('data', chunk => chunks.push(chunk));
      this.doc.on('end', () => resolve(Buffer.concat(chunks)));
      this.doc.on('error', reject);
      
      this.generateInvoice(orderData, userData);
      this.doc.end();
    });
  }
}

module.exports = InvoiceGenerator; 