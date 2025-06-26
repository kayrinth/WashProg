import PropTypes from "prop-types";

const HistoryTable = ({ orders = [], onUpdateStatus }) => {
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
    <div className="w-full">
      {/* TABEL - Desktop only */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-[700px] w-full bg-white shadow-md rounded-xl overflow-hidden text-sm">
          <thead className="bg-gray-100 text-gray-700 text-center">
            <tr>
              <th className="py-3 px-4">No</th>
              <th className="py-3 px-4">Tanggal Pesan</th>
              <th className="py-3 px-4">Item Pesanan</th>
              <th className="py-3 px-4">Subtotal</th>
              <th className="py-3 px-4">Total Harga</th>
              <th className="py-3 px-4">Detail Alamat</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  Belum ada pesanan.
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr
                  key={order.id}
                  className="border-t hover:bg-gray-50 transition text-center"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">
                    {new Date(order.dateOrder).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-4 text-left">
                    {order.itemsId.map((item, i) => (
                      <div key={i}>
                        <div>{item.items}</div>
                        <div className="text-gray-500 text-xs">
                          {item.services?.title}
                        </div>
                        <hr />
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-4">
                    {order.itemsId.map((item, i) => (
                      <div key={i} className="">
                        <div className="mb-2 mt-3">
                          Rp{" "}
                          {item.subTotal
                            ? item.subTotal.toLocaleString("id-ID")
                            : 0}
                        </div>
                        <hr />
                      </div>
                    ))}
                  </td>

                  <td className="py-3 px-4">
                    Rp {order.totalPrice.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3 px-4 text-start">{order.address}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 space-x-2">
                    <button
                      className={`text-white  bg-red-500 text-xs hover:bg-red-100 hover:text-red-800 px-4 py-1 rounded-full`}
                      // disabled={order.status !== "dibatalakan"}
                      onClick={() => onUpdateStatus(order._id, "dibatalkan")}
                    >
                      batalkan
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CARD - Mobile only */}
      <div className="md:hidden space-y-4 mt-10">
        {orders.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            Belum ada pesanan.
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-md rounded-xl p-4 border border-gray-100"
            >
              <div className="flex justify-between">
                <p className="text-sm text-gray-400">
                  {new Date(order.dateOrder).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <span
                  className={`px-3 py-2 rounded-full text-xs font-medium ${getStatusClass(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
              <p className="font-light">Pesanan:</p>
              <div className="text-sm mb-3 flex justify-start font-li">
                {order.itemsId.map((item, i) => (
                  <div key={i} className="ml-2 mb-1">
                    <div>{item.items}</div>
                    <div className="text-xs text-gray-500">
                      {item.services?.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      Rp{" "}
                      {item.subTotal
                        ? item.subTotal.toLocaleString("id-ID")
                        : 0}
                    </div>
                  </div>
                ))}
              </div>

              <p className="font-light text-sm">Detail Alamat:</p>
              <div className="text-sm mb-3 flex  justify-start font-li">
                {order.address}
              </div>

              <div className="text-sm font-medium mb-3">
                Total Harga: Rp {order.totalPrice.toLocaleString("id-ID")}
              </div>

              <div className="flex gap-2">
                <button
                  className={`text-white  bg-red-500 px-4 py-1 rounded-full hover:bg-red-100 hover:text-red-800 flex-1`}
                  // disabled={order.status !== "dibatlakan"}
                  onClick={() => onUpdateStatus(order.id, "dibatalkan")}
                >
                  Batalkan
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryTable;

HistoryTable.propTypes = {
  orders: PropTypes.array,
  onUpdateStatus: PropTypes.func,
};
