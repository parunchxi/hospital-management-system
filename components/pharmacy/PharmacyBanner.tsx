import { ShieldCheck } from "lucide-react";

export default function PharmacyBanner() {
  return (
    <section className="w-full flex flex-col items-center justify-center bg-blue-100 rounded-lg shadow mt-8 mb-10 py-10 px-4">
      <h1 className="text-4xl font-bold text-blue-800 mb-4">Pharmacy</h1>
      <div className="flex items-center gap-2 mt-2">
        <ShieldCheck className="w-6 h-6 text-blue-600" />
        <span className="text-lg font-semibold text-blue-700">100% Genuine Medicines</span>
      </div>
    </section>
  );
}
