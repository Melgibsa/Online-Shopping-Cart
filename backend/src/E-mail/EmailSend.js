const nodemailer = require("nodemailer");

const brl = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "BRL" }).format(value);

const formatDate = (iso) => iso.split("-").reverse().join("/");

const escape = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );

class EmailSend {
  constructor(config) {
    this.from = config.from;
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      auth: config.user ? { user: config.user, pass: config.pass } : undefined,
    });
  }

  async sendConfirmation({ orderId, name, email, items, total }) {
    const lines = items
      .map((i) => {
        const booking = i.booking
          ? ` (check-in: ${formatDate(i.booking.date)} at ${escape(i.booking.openingHour)})`
          : "";
        return `<li>${i.quantity}× ${escape(i.name)}${booking} — ${brl(i.subtotal)}</li>`;
      })
      .join("");

    await this.transporter.sendMail({
      from: this.from,
      to: email,
      subject: `Order confirmation #${orderId}`,
      html: `
        <h2>Thank you for your order, ${escape(name)}!</h2>
        <p>Order <strong>#${escape(orderId)}</strong></p>
        <ul>${lines}</ul>
        <p><strong>Total: ${brl(total)}</strong></p>
      `,
    });
    return true;
  }
}

module.exports = { EmailSend };