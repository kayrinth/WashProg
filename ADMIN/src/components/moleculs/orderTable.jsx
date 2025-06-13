// src/components/OrderTable.jsx
import React from "react";

const OrderTable = ({ orders = [] }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case "menunggu":
        return "bg-yellow-100 text-yellow-800";
      case "diproses":
        return "bg-blue-100 text-blue-800";
      case "selesai":
        return "bg-green-100 text-green-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[700px] w-full bg-white shadow-md rounded-xl overflow-hidden text-sm">
        <thead className="bg-gray-100 text-gray-700 text-left">
          <tr>
            <th className="py-3 px-4">No</th>
            <th className="py-3 px-4">Pelanggan</th>
            <th className="py-3 px-4">Tanggal Pesan</th>
            <th className="py-3 px-4">Item Pesanan</th>
            <th className="py-3 px-4">Subtotal</th>
            <th className="py-3 px-4">Total Harga</th>
            <th className="py-3 px-4">Layanan</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {!orders ? (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                Belum ada pesanan.
              </td>
            </tr>
          ) : (
            orders.map((order, index) => (
              <tr
                key={order.id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">{order.userId.name}</td>
                <td>
                  {new Date(order.dateOrder).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </td>

                <td className="py-3 px-4">
                  {order.itemsId.map((item, i) => (
                    <div key={i}>
                      <div>{item.items}</div>
                      <div className="text-gray-500 text-sm">
                        {item.services?.title}
                      </div>
                      <hr></hr>
                    </div>
                  ))}
                </td>
                <td className="py-3 px-4">
                  {order.itemsId.map((item, i) => (
                    <div key={i} className="">
                      <div className="mb-2 mt-3">
                        Rp {item.subTotal.toLocaleString("id-ID")}
                      </div>
                      <hr />
                    </div>
                  ))}
                </td>
                <td className="py-3 px-4">
                  Rp {order.totalPrice.toLocaleString("id-ID")}
                </td>
                <td className="py-3 px-4">{order.layanan}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-3 px-4 space-x-2">
                  <button
                    className={`text-yellow-800 text-xs bg-yellow-200 px-2 py-1 rounded-full hover:underline
                  ${
                    order.status !== "menunggu"
                      ? "opacity-50 cursor-not-allowed hover:no-underline"
                      : ""
                  }`}
                    disabled={order.status !== "menunggu"}
                  >
                    Diproses
                  </button>

                  <button
                    className={`text-green-800 text-xs bg-green-200 px-2 py-1 rounded-full hover:underline
                      ${
                        order.status !== "diproses"
                          ? "opacity-50 cursor-not-allowed hover:no-underline"
                          : ""
                      }`}
                    disabled={order.status !== "diproses"}
                  >
                    Selesaikan
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
