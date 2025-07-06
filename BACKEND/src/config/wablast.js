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
        `Kode OTP Anda: ${otpCode}\nJangan berikan kode ini ke siapapun.`
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
}

module.exports = new WablastService();
