export default function Skills() {
  return (
    <div className="flex flex-col items-start h-screen lg:px-32">
      <div className="flex flex-col items-end lg:items-start lg:justify-start pt-10 w-full">
        <h1 className="text-2xl font-light text-gray-600 ">Learning Path</h1>
        <p className="text-3xl font-bold text-[#303481] lg:text-5xl xl:text-6xl">
          Education & Skills
        </p>
      </div>

      <div className=" flex flex-row border-t border-gray-300 w-full mt-8 pt-8">
        <div className="w-1/2">
          <div>
            <h1 className="text-2xl font-bold text-[#303481]">
              AMIKOM Yogyakarta University
            </h1>
            <p className="text-gray-600">Bachelor in Information Systems</p>
            <p className="text-gray-600">2022 - present</p>
          </div>
          <div className="mt-8">
            <h1 className="text-2xl font-bold text-[#303481]">
              Study Independent At Vocasia
            </h1>
            <p className="text-gray-600">MERN Stack</p>
            <p className="text-gray-600">
              06 September 2024 - 31 December 2024
            </p>
          </div>
        </div>
        <div className="w-1/2">
          <div>
            <h1 className="text-2xl font-bold text-[#303481]">
              AMIKOM Yogyakarta University
            </h1>
            <p className="text-gray-600">Bachelor in Information Systems</p>
            <p className="text-gray-600">2022 - present</p>
          </div>
          <div className="mt-8">
            <h1 className="text-2xl font-bold text-[#303481]">
              Study Independent At Vocasia
            </h1>
            <p className="text-gray-600">MERN Stack</p>
            <p className="text-gray-600">
              06 September 2024 - 31 December 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
