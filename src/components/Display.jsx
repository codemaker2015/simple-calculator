export default function Display({ expression, value }) {
  const fontSize =
    value.length > 12 ? "text-2xl" : value.length > 9 ? "text-3xl" : "text-4xl";

  return (
    <div className="bg-gray-900 rounded-2xl p-5 mb-4 min-h-[100px] flex flex-col items-end justify-end overflow-hidden">
      <p className="text-gray-400 text-sm h-5 truncate w-full text-right">
        {expression}
      </p>
      <p
        className={`text-white font-light mt-1 truncate w-full text-right ${fontSize}`}
      >
        {value}
      </p>
    </div>
  );
}
