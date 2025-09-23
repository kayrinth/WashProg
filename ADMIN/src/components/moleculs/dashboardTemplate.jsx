import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "../atoms";

export default function DashboardTemplate({
  orders = {
    totalOrders: 0,
    waitingOrders: 0,
    totalRevenue: 0,
    dailyRevenue: 0,
    revenueData: [],
    ordersData: [],
  },
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="h-full bg-gray-50 p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card title="Total Pesanan" value={orders.totalOrders} />
          <Card title="Pesanan Menunggu" value={orders.waitingOrders} />
          <Card
            title="Pendapatan Hari Ini"
            value={`Rp ${(orders.dailyRevenue ?? 0).toLocaleString("id-ID")}`}
          />
          <Card
            title="Total Pendapatan"
            value={`Rp ${(orders.totalRevenue ?? 0).toLocaleString("id-ID")}`}
          />
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-2">Pendapatan 7 Hari Terakhir</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={orders.revenueData}>
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={2}
              />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex mb-2">
          <p className="font-semibold">Pesanan Menunggu</p>
        </div>
        <div className="bg-white overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full text-sm">
              <thead className="bg-black text-white">
                <tr>
                  <th className="py-4 px-6 text-left font-semibold">No</th>
                  <th className="py-4 px-6 text-left font-semibold">
                    Pemesanan
                  </th>
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
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {orders.ordersData.length === 0 ? (
                  <tr>
                    <td
                      colSpan="10"
                      className="text-center py-12 text-gray-500"
                    >
                      <div className="flex flex-col items-center space-y-3">
                        <div className="text-4xl">📋</div>
                        <p className="text-lg font-medium">
                          Tidak ada pesanan menunggu
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orders.ordersData.map((order, index) => (
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
                          <p className="font-medium text-gray-900 whitespace-nowrap">
                            {order.method}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <p className="font-medium text-gray-900 whitespace-nowrap">
                            {order.userId ? order.userId.name : order.name}
                          </p>
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
                            {order.address ? order.address : "-"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
