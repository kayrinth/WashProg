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

  // async sendMessage(name, services, address, totalPrice, dateOrder, userPhone) {
  //   try {
  //     const formatPhone = (phone) => {
  //       return phone.trim().replace(/^0/, "62").replace(/\s+/g, "");
  //     };

  //     const adminPhone = formatPhone(process.env.ADMIN_PHONE);
  //     const customerPhone = formatPhone(userPhone);

  //     const formattedTotal = new Intl.NumberFormat("id-ID", {
  //       style: "currency",
  //       currency: "IDR",
  //       minimumFractionDigits: 0,
  //     }).format(totalPrice);

  //     const messageAdmin =
  //       `*📦 Pesanan Baru Masuk!*\n\n` +
  //       `*Nama Pelanggan:* ${name}\n` +
  //       `*Pesanan:*\n\t${services}\n` +
  //       `*Alamat:* ${address}\n` +
  //       `*Total Harga:* ${formattedTotal}\n` +
  //       `*Tanggal Order:* ${new Date(dateOrder).toLocaleString("id-ID", {
  //         timeZone: "Asia/Jakarta",
  //       })}\n\n` +
  //       `_Segera diproses ya 👍_`;

  //     const messageUser =
  //       `Halo ${name}! 👋\n\n` +
  //       `Terima kasih mau mencuci di *WashProg*\n\n` +
  //       `Berikut detail pesanan kamu:\n\n` +
  //       `*Services:*\n\t${services}\n` +
  //       `*Total Harga:* ${formattedTotal}\n` +
  //       `*Alamat:* ${address}\n` +
  //       `*Tanggal Order:* ${new Date(dateOrder).toLocaleString("id-ID", {
  //         timeZone: "Asia/Jakarta",
  //       })}\n\n` +
  //       `Pesanan kamu sedang kami proses. mohon ditunggu yaa 😊 \n atau kunjungi website kami untuk info lebih lanjut https://washprog.vercel.app/`;

  //     const headers = {
  //       Authorization: `${this.token}.${this.secretKey}`,
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     };

  //     // Kirim ke Admin
  //     const payloadAdmin = new URLSearchParams();
  //     payloadAdmin.append("phone", adminPhone);
  //     payloadAdmin.append("message", messageAdmin);

  //     const responseAdmin = await axios.post(
  //       `${this.baseURL}/send-message`,
  //       payloadAdmin.toString(),
  //       { headers }
  //     );

  //     // Kirim ke Pelanggan
  //     const payloadUser = new URLSearchParams();
  //     payloadUser.append("phone", customerPhone);
  //     payloadUser.append("message", messageUser);

  //     const responseUser = await axios.post(
  //       `${this.baseURL}/send-message`,
  //       payloadUser.toString(),
  //       { headers }
  //     );

  //     console.log("✅ Wablas Admin:", responseAdmin.data);
  //     console.log("✅ Wablas User:", responseUser.data);

  //     return { admin: responseAdmin.data, user: responseUser.data };
  //   } catch (error) {
  //     console.error("[WABLAS ERROR DETAILS]:", {
  //       url: error.config?.url,
  //       status: error.response?.status,
  //       data: error.response?.data,
  //       request: error.config?.data,
  //     });
  //     throw new Error(
  //       `Gagal mengirim Message: ${
  //         error.response?.data?.message || error.message
  //       }`
  //     );
  //   }
  // }
  async sendMessage(name, services, address, totalPrice, dateOrder, userPhone) {
    try {
      const formatPhone = (phone) => {
        return phone.trim().replace(/^0/, "62").replace(/\s+/g, "");
      };

      const adminPhone = formatPhone(process.env.ADMIN_PHONE);
      const customerPhone = formatPhone(userPhone);

      const formattedTotal = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(totalPrice);

      const messageAdmin =
        `*📦 Pesanan Baru Masuk!*\n\n` +
        `*Nama Pelanggan:* ${name}\n` +
        `*Pesanan:*\n\t${services}\n` +
        `*Alamat:* ${address}\n` +
        `*Total Harga:* ${formattedTotal}\n` +
        `*Tanggal Order:* ${new Date(dateOrder).toLocaleString("id-ID", {
          timeZone: "Asia/Jakarta",
        })}\n\n` +
        `_Segera diproses ya 👍_`;

      const messageUser =
        `Halo ${name}! 👋\n` +
        `Terima kasih mau mencuci di *WashProg*\n\n` +
        `Berikut detail pesanan kamu:\n\n` +
        `*Services:*\n\n${services}\n\n` +
        `*Total Harga:* ${formattedTotal}\n` +
        `*Alamat:* ${address}\n` +
        `*Tanggal Order:* ${new Date(dateOrder).toLocaleString("id-ID", {
          timeZone: "Asia/Jakarta",
        })}\n\n` +
        `Pesanan kamu sedang kami proses. mohon ditunggu yaa 😊 \natau kunjungi website kami untuk info lebih lanjut https://washprog.vercel.app/`;

      const headers = {
        Authorization: `${this.token}.${this.secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      };

      // Kirim ke Admin
      const payloadAdmin = new URLSearchParams();
      payloadAdmin.append("phone", adminPhone);
      payloadAdmin.append("message", messageAdmin);

      const responseAdmin = await axios.post(
        `${this.baseURL}/send-message`,
        payloadAdmin.toString(),
        { headers }
      );

      // Kirim ke Pelanggan
      const payloadUser = new URLSearchParams();
      payloadUser.append("phone", customerPhone);
      payloadUser.append("message", messageUser);

      const responseUser = await axios.post(
        `${this.baseURL}/send-message`,
        payloadUser.toString(),
        { headers }
      );

      console.log("✅ Wablas Admin:", responseAdmin.data);
      console.log("✅ Wablas User:", responseUser.data);

      return { admin: responseAdmin.data, user: responseUser.data };
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
