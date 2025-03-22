import profile from "../../assets/profile.jpg";

export default function About() {
  return (
    <div className="flex flex-row items-center justify-center h-screen  lg:px-32">
      {/* Profile Picture */}
      <div className="flex justify-center w-1/2">
        <img
          src={profile}
          alt="Damar Adi Nugroho"
          className="rounded-full w-96 shadow-2xl border-4 border-white"
        />
      </div>

      <div className="flex flex-col w-2/3 items-center">
        {/* Contact Section */}
        <div className="w-full max-w-lg bg-gray-200 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 ">
            Social Media
          </h2>
        </div>

        {/* Form Section */}
        <div className="w-full max-w-lg bg-gray-200 p-6 rounded-lg shadow-lg">
          <form>
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Contact Me
            </h2>
            <div className="grid grid-cols- gap-y-8">
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="w-full p-2 rounded-md border focus:outline-indigo-200"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full p-2 rounded-md border focus:outline-indigo-200"
              />
              <textarea
                name="message"
                rows="4"
                placeholder="Message"
                className="w-full p-2 rounded-md border focus:outline-indigo-200"
              ></textarea>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
