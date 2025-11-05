import { useState } from "react";
import { MessageCircleQuestion } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      question: "Berapa lama layanan laundry sepatu?",
      answer:
        "Layanan laundry sepatu biasanya membutuhkan waktu sekitar 2-3 hari kerja untuk selesai, tergantung dari jumlah antrian dan jenis sepatu yang Anda.",
    },
    {
      question: "Apakah ada layanan express (1 hari jadi)?",
      answer:
        "ya, kami menyediakan layanan cuci extra wash dengan waktu pengerjaan 1x24 jam.",
    },
    {
      question: "Apakah menerima tas/topi selain sepatu?",
      answer:
        "Ya, kami menerima berbagai jenis tas dan topi sebagai layanan tambahan. untuk melihat detail layanan dan harga bisa dilihat di daftar menu.",
    },
    {
      question: "Apakah ada layanan antar-jemput?",
      answer:
        "Ada, kami menyediakan layanan antar-jemput secara gratis, untuk daerah sekitaran Sleman. untuk daerah diluar Sleman, kami mohon maaf layanan antar-jemput belum tersedia.",
    },
    {
      question: "Bagaimana cara menghubungi customer support?",
      answer:
        "Anda dapat menghubungi dengan nomor Whatsapp, sebagai berikut: 088221457899, Kami akan menjawab pertanyaan Anda secepatnya.",
    },
    {
      question: "Bisakah saya membatalkan pesanan?",
      answer:
        "Ya, Anda dapat membatalkan pesanan, dengan catatan pembatalan dapat dilakukan saat status pesanan masih menunggu. Setelah pesanan diproses, pembatalan tidak dapat dilakukan.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="md:py-16">
      <div className="p-10 md:p-12 w-full max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6 animate-pulse">
            <MessageCircleQuestion className="w-4 h-4" />
            <span>Pertanyaan Sering Ditanyakan</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black mb-4">
            Masih Ragu? Yuk, Temukan Jawabannya di Sini!
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Percayakan sepatu, tas, dann topi pada ahlinya. Temukan jawaban atas
            semua pertanyaanmu di sini.
          </p>
        </div>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                onClick={() => toggleFAQ(index)}
              >
                <h3 className="text-xs md:text-lg font-semibold text-gray-900 pr-8">
                  {faq.question}
                </h3>
                <div
                  className={`flex-shrink-0 transform transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                >
                  <svg
                    className="w-6 h-6 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-5">
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>
                  <p className="text-gray-700  text-sm md:text-base leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
