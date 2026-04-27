import Calculator from "./components/Calculator";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <main className="flex-1 flex items-center justify-center p-6">
        <Calculator />
      </main>
      <footer className="py-4 text-center text-sm text-gray-500 border-t border-gray-800">
        Powered by AI.CoE Japan 2026
      </footer>
    </div>
  );
}
