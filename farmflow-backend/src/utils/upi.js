const QRCode = require("qrcode");

const encode = (v) => encodeURIComponent(String(v || "").trim());

/**
 * Build a UPI URI: upi://pay?pa=...&pn=...&am=...&cu=INR&tn=...
 */
function buildUpiUri({ pa, pn, am, tn }) {
  const params = [
    `pa=${encode(pa)}`,       // payee VPA
    `pn=${encode(pn)}`,       // payee name
    `am=${encode(am)}`,       // amount
    `cu=INR`,                 // currency
  ];
  if (tn) params.push(`tn=${encode(tn)}`);  // note (optional)
  return `upi://pay?${params.join("&")}`;
}

async function generateUpiQrDataUrl(upiUri) {
  return QRCode.toDataURL(upiUri, { errorCorrectionLevel: "M", margin: 1, scale: 6 });
}

module.exports = { buildUpiUri, generateUpiQrDataUrl };
