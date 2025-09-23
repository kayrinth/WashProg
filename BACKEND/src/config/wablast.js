const axios = require("axios");
const { wablasKey, wablasToken } = require("./env");

class WablastService {
  constructor() {
    this.baseURL = "https://sby.wablas.com/api";
    this.token = wablasToken;
    this.secretKey = wablasKey;
  }

  async sendOTP(phoneNumber, otpCode) {
    try {
      const formattedPhone = phoneNumber.replace(/^\+|\s/g, "");

      // Data payload sesuai spesifikasi Wablas
      const payload = new URLSearchParams();
      payload.append("phone", formattedPhone);
      payload.append(
        "message",
        `*Kode OTP Anda: ${otpCode}*\nJangan berikan kode ini ke siapapun!\n_Kode OTP ini hanya berlaku selama 5 menit._\n\n_Pesan ini dikirim otomatis oleh sistem, mohon tidak dibalas._`
      );

      const response = await axios.post(
        `${this.baseURL}/send-message`,
        payload.toString(),
        {
          headers: {
            Authorization: `${this.token}.${this.secretKey}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          timeout: 5000,
        }
      );

      console.log("Response Wablas:", response.data);
      return response.data;
    } catch (error) {
      console.error("[WABLAS ERROR DETAILS]:", {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
        request: error.config?.data,
      });
      throw new Error(
        `Gagal mengirim OTP: ${error.response?.data?.message || error.message}`
      );
    }
  }
  async sendMessage(name, services, address, totalPrice, dateOrder) {
    try {
      const adminPhone = process.env.ADMIN_PHONE;
      const formattedPhoneAdmin = adminPhone.replace(/^\+|\s/g, "");

      const payload = new URLSearchParams();
      payload.append("phone", formattedPhoneAdmin);

      payload.append(
        "message",
        `*📦 Pesanan Baru Masuk!*\n\n` +
          `👤 *Nama Pelanggan:* ${name}\n` +
          `📌 *Pesanan:*\n${services}\n` +
          `📍 *Alamat:* ${address}\n` +
          `💰 *Total Harga:* Rp ${totalPrice}\n` +
          `🕒 *Tanggal Order:* ${new Date(dateOrder).toLocaleString("id-ID", {
            timeZone: "Asia/Jakarta",
          })}\n\n` +
          `_Segera diproses ya 👍_`
      );

      const response = await axios.post(
        `${this.baseURL}/send-message`,
        payload.toString(),
        {
          headers: {
            Authorization: `${this.token}.${this.secretKey}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          timeout: 5000,
        }
      );

      console.log("Response Wablas:", response.data);
      return response.data;
    } catch (error) {
      console.error("[WABLAS ERROR DETAILS]:", {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
        request: error.config?.data,
      });
      throw new Error(
        `Gagal mengirim Message: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  }
}

module.exports = new WablastService();
