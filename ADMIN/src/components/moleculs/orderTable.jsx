import React from "react";
import { Pagination, Input } from "../atoms";
import { useState } from "react";

const OrderTable = ({ orders = [], onUpdateStatus, onUpdatePaymentStatus }) => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("semua");

  const filteredOrders = orders.filter((order) => {
    const matchStatus =
      statusFilter === "semua" ? true : order.status === statusFilter;

    const matchSearch =
      (order.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.phoneNumber || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchStatus && matchSearch;
  });
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const getStatusClass = (status) => {
    switch (status) {
      case "menunggu":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "diproses":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "diantar":
        return "bg-teal-100 text-teal-800 border-teal-200";
      case "selesai":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "lunas":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "menunggu":
        return "⏳";
      case "diproses":
        return "🧼";
      case "diantar":
        return "📦";
      case "selesai":
        return "✅";
      default:
        return "❌";
    }
  };

  const isBelumLunas = (paymentStatus) => {
    return paymentStatus !== "lunas";
  };

  return (
    <div className="w-full rounded-2xl">
      <div className="mb-4 mt-0 md:mt-4 flex flex-col md:flex-row md:justify-between gap-3">
        {/* Filter status */}
        <div className="relative inline-block w-full md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsOpen(false)}
            className="appearance-none border border-gray-300 rounded-xl px-3 py-2 pr-8 w-full focus:outline-none focus:ring-2 focus:ring-black transition duration-200 bg-white text-gray-700"
          >
            <option value="semua">Semua</option>
            <option value="menunggu">Menunggu</option>
            <option value="proses">Proses</option>
            <option value="selesai">Selesai</option>
          </select>

          <svg
            className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
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

        {/* Search */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <Input
            type="search"
            id="default-search"
            className="block w-full p-2.5 ps-10 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-black outline-none transition-all duration-200 bg-white text-gray-700"
            placeholder="Cari nama pelanggan atau nomor telepon....."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* TABEL - Desktop only */}
      <div className="hidden md:block">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full text-sm">
              <thead className="bg-black text-white">
                <tr>
                  <th className="py-4 px-6 text-left font-semibold">No</th>
                  <th className="py-4 px-6 text-left font-semibold">
                    Pelanggan
                  </th>
                  <th className="py-4 px-6 text-left font-semibold">Tanggal</th>
                  <th className="py-4 px-6 text-left font-semibold">Pesanan</th>
                  <th className="py-4 px-6 text-left font-semibold">
                    Subtotal
                  </th>
                  <th className="py-4 px-6 text-left font-semibold">
                    Total Harga
                  </th>
                  <th className="py-4 px-6 text-left font-semibold">Alamat</th>
                  <th className="py-4 px-6 text-left font-semibold">
                    Pembayaran
                  </th>
                  <th className="py-4 px-6 text-left font-semibold">Status</th>
                  <th className="py-4 px-6 text-center font-semibold">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {currentItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan="10"
                      className="text-center py-12 text-gray-500"
                    >
                      <div className="flex flex-col items-center space-y-3">
                        <div className="text-4xl">📋</div>
                        <p className="text-lg font-medium">Belum ada pesanan</p>
                        <p className="text-sm">Pesanan akan muncul di sini</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((order, index) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50/50 transition-all duration-200"
                    >
                      <td className="py-4 px-6">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-600 font-semibold text-sm">
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div>
                            <p className="font-medium text-gray-900 whitespace-nowrap">
                              {order.userId.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        <div className="space-y-1 whitespace-nowrap text-sm">
                          <p className="font-medium">
                            {new Date(order.dateOrder).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.dateOrder).toLocaleTimeString(
                              "id-ID",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm whitespace-nowrap">
                        <div className="space-y-2">
                          {order.itemsId.map((item, i) => (
                            <div key={i}>
                              <p className="font-medium text-gray-900">
                                {item.items}
                              </p>
                              {item.services?.title && (
                                <p className="text-xs text-blue-600 font-medium mt-1">
                                  {item.services.title}
                                </p>
                              )}
                              <div className="pt-6"></div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="space-y-2">
                          {order.itemsId.map((item, i) => (
                            <div key={i} className="">
                              <p className="font-semibold text-gray-900 mt-6">
                                Rp {item.subTotal.toLocaleString("id-ID")}
                              </p>
                              <div className=" pt-6"></div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                          <p className="text-sm font-medium text-blue-600 whitespace-nowrap">
                            Rp {order.totalPrice.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-sm text-gray-700 line-clamp-3">
                            {order.address}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex justify-center  px-3 py-1 rounded-full text-xs font-medium border w-24 ${getStatusClass(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium border w-24 ${getStatusClass(
                            order.status
                          )}`}
                        >
                          <span className="mr-1">
                            {getStatusIcon(order.status)}
                          </span>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col space-y-2">
                          <button
                            className={`inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                              order.status === "menunggu"
                                ? "bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                            }`}
                            disabled={order.status !== "menunggu"}
                            onClick={() =>
                              onUpdateStatus(order._id, "diproses")
                            }
                          >
                            Proses
                          </button>
                          <button
                            className={`inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                              order.status === "diproses"
                                ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border border-indigo-200"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                            }`}
                            disabled={order.status !== "diproses"}
                            onClick={() => onUpdateStatus(order._id, "diantar")}
                          >
                            Antar
                          </button>
                          <button
                            className={`inline-flex items-center justify-center px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                              ["diproses", "diantar"].includes(order.status)
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200"
                                : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                            }`}
                            disabled={
                              !["diproses", "diantar"].includes(order.status)
                            }
                            onClick={() => onUpdateStatus(order._id, "selesai")}
                          >
                            Selesai
                          </button>
                          <div className="border-t pt-2">
                            <p className="text-xs text-gray-500 mb-1">
                              konfirmasi
                            </p>

                            <button
                              className={`inline-flex items-center justify-center w-full px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                isBelumLunas(order.paymentStatus)
                                  ? "bg-green-100 text-green-800 hover:bg-green-200 border border-green-200"
                                  : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                              }`}
                              onClick={() =>
                                onUpdatePaymentStatus(order._id, "lunas")
                              }
                              disabled={!isBelumLunas(order.paymentStatus)}
                            >
                              Pembayaran
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <Pagination
          currentPage={currentPage}
          totalItems={filteredOrders.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* CARD - Mobile only */}
      <div className="md:hidden space-y-6">
        {currentItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              Belum ada pesanan
            </p>
            <p className="text-sm text-gray-500">Pesanan akan muncul di sini</p>
          </div>
        ) : (
          currentItems.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              {/* Header Card */}
              <div className="bg-gray-100 p-4 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {order.userId.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.dateOrder).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`inline-flex justify-center px-3 py-1 rounded-full text-xs font-medium border mb-2 ${getStatusClass(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusClass(
                        order.status
                      )}`}
                    >
                      <span className="mr-1">
                        {getStatusIcon(order.status)}
                      </span>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Items */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    Pesanan
                  </h4>
                  <div className="space-y-2">
                    {order.itemsId.map((item, i) => (
                      <div
                        key={i}
                        className="bg-gray-50 rounded-xl p-3 border border-gray-200"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {item.items}
                            </p>
                            {item.services?.title && (
                              <p className="text-xs text-blue-600 font-medium mt-1">
                                {item.services.title}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 mt-2 pr-2">
                              Rp {item.subTotal.toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                    Alamat Pengiriman
                  </h4>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                    <p className="text-sm text-gray-700">{order.address}</p>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">
                      Total Harga:
                    </span>
                    <span className="text-xl font-bold text-blue-900">
                      Rp {order.totalPrice.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <button
                    disabled={order.status !== "menunggu"}
                    className={`inline-flex items-center justify-center px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                      order.status === "menunggu"
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                    }`}
                    onClick={() => onUpdateStatus(order._id, "diproses")}
                  >
                    Proses
                  </button>
                  <button
                    className={`inline-flex items-center justify-center px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                      order.status === "diproses"
                        ? "bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border border-indigo-200"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                    }`}
                    disabled={order.status !== "diproses"}
                    onClick={() => onUpdateStatus(order._id, "diantar")}
                  >
                    Antar
                  </button>
                  <button
                    className={`inline-flex items-center justify-center px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                      ["diproses", "diantar"].includes(order.status)
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                    }`}
                    disabled={!["diproses", "diantar"].includes(order.status)}
                    onClick={() => onUpdateStatus(order._id, "selesai")}
                  >
                    Selesai
                  </button>
                </div>
                <button
                  className={`w-full inline-flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isBelumLunas(order.paymentStatus)
                      ? "bg-green-100 text-green-800 hover:bg-green-200 border border-green-200"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  }`}
                  onClick={() => onUpdatePaymentStatus(order._id, "lunas")}
                  disabled={!isBelumLunas(order.paymentStatus)}
                >
                  Konfirmasi Pembayaran
                </button>
              </div>
            </div>
          ))
        )}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredOrders.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default OrderTable;
