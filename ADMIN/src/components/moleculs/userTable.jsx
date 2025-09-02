import React from "react";

const UserTable = ({ users = [], onDeleteUser }) => {
  const handleWhatsAppChat = (phoneNumber) => {
    const formattedNumber = phoneNumber.startsWith("0")
      ? `62${phoneNumber.slice(1)}`
      : phoneNumber.startsWith("+62")
      ? phoneNumber.slice(1)
      : phoneNumber;

    const whatsappUrl = `https://wa.me/${formattedNumber}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="w-full rounded-2xl">
      {/* TABEL - Desktop only */}
      <div className="hidden md:block">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-black text-white">
                <tr>
                  <th className="py-4 px-6 text-left font-semibold">No</th>
                  <th className="py-4 px-6 text-left font-semibold">
                    Pelanggan
                  </th>
                  <th className="py-4 px-6 text-left font-semibold">
                    Nomor WhatsApp
                  </th>
                  <th className="py-4 px-6 text-left font-semibold">
                    Bergabung
                  </th>
                  <th className="py-4 px-6 text-center font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-500">
                      <div className="flex flex-col items-center space-y-3">
                        <div className="text-4xl">👥</div>
                        <p className="text-lg font-medium">
                          Belum ada pelanggan
                        </p>
                        <p className="text-sm">Pelanggan akan muncul di sini</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50/50 transition-all duration-200"
                    >
                      <td className="py-4 px-6">
                        <div className=" text-gray-600 font-semibold text-sm">
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {user.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.phoneNumber}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        <div className="space-y-1">
                          <p className="font-medium">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "Hari ini"}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2 justify-center">
                          <button
                            onClick={() => handleWhatsAppChat(user.phoneNumber)}
                            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200 border border-green-200 transition-all duration-200 "
                          >
                            Chat
                          </button>
                          <button
                            onClick={() =>
                              onDeleteUser && onDeleteUser(user.id)
                            }
                            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 border border-red-200 transition-all duration-200 "
                          >
                            Hapus
                          </button>
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

      {/* CARD - Mobile only */}
      <div className="md:hidden space-y-4">
        {users.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="text-4xl mb-4">👥</div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              Belum ada pelanggan
            </p>
            <p className="text-sm text-gray-500">
              Pelanggan akan muncul di sini
            </p>
          </div>
        ) : (
          users.map((user, index) => (
            <div
              key={user.id}
              className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
            >
              {/* Header Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user.name}
                      </h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-800 font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Contact Info */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-lg">📱</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 font-medium">
                        WhatsApp
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {user.phoneNumber}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Join Date */}
                {user.createdAt && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 text-lg">📅</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 font-medium">
                          Bergabung
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {new Date(user.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleWhatsAppChat(user.phoneNumber)}
                    className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium bg-green-100 text-green-800 hover:bg-green-200 border border-green-200 transition-all duration-200 hover:scale-105"
                  >
                    <span className="mr-2">💬</span>
                    Chat WhatsApp
                  </button>
                  <button
                    onClick={() => onDeleteUser && onDeleteUser(user.id)}
                    className="flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 border border-red-200 transition-all duration-200 hover:scale-105"
                  >
                    <span className="mr-2">🗑️</span>
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserTable;
