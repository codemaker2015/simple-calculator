export default function Button({
  label,
  onClick,
  variant = "default",
  wide = false,
}) {
  const base =
    "flex items-center justify-center rounded-2xl text-xl font-medium h-16 select-none cursor-pointer transition-transform active:scale-95 focus:outline-none";

  const variants = {
    default: "bg-gray-700 text-white hover:bg-gray-600",
    operator: "bg-amber-400 text-white hover:bg-amber-300",
    action: "bg-gray-500 text-white hover:bg-gray-400",
    equals: "bg-amber-500 text-white hover:bg-amber-400",
  };

  return (
    <button
      className={`${base} ${variants[variant] ?? variants.default} ${wide ? "col-span-2" : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
