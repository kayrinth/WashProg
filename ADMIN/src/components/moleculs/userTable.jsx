const UserTable = ({ users = [] }) => {
  return (
    <div className="w-full">
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm bg-white shadow-md rounded-xl">
            <thead className="bg-gray-200 text-gray-700 text-center">
              <tr>
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4">Nama</th>
                <th className="py-3 px-4">Nomor Whatsapp</th>
                <th className="py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">
                    Belum ada pelanggan.
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-t hover:bg-gray-100 transition text-center"
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{user.name}</td>
                    <td className="py-3 px-4">{user.phoneNumber}</td>
                    <td className="py-3 px-4 space-x-2">
                      <button className="text-white bg-green-400 px-4 py-1 rounded-full hover:bg-green-100 hover:text-green-600">
                        Chat
                      </button>
                      <button className="text-white bg-red-400 px-4 py-1 rounded-full hover:bg-red-100 hover:text-red-600">
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden grid grid-cols-1 gap-4 mt-10">
        {users.length === 0 ? (
          <div className="text-center text-gray-500 py-6">
            Belum ada pelanggan.
          </div>
        ) : (
          users.map((user, index) => (
            <div
              key={user.id}
              className="bg-white shadow-md rounded-xl p-4 border border-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  {user.name}
                </h3>
                <span className="text-sm text-gray-500">#{index + 1}</span>
              </div>
              <div className="text-sm text-gray-700 space-y-1 mb-4">
                <p>
                  <span className="font-medium">Nomor WA:</span>{" "}
                  {user.phoneNumber}
                </p>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 text-white bg-green-400 px-4 py-1 rounded-full hover:bg-green-200 hover:text-green-600">
                  Chat
                </button>
                <button className="flex-1 text-white bg-red-400 px-4 py-1 rounded-full hover:bg-red-200 hover:text-red-600">
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserTable;
