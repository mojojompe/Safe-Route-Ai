

export default function Emergency() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Emergency Contacts</h1>

      <div className="bg-[#0b2419] p-6 rounded-xl space-y-4">
        <div>
          <p className="text-slate-300">Emergency Hotline</p>
          <h2 className="text-2xl font-bold">+1 911</h2>
        </div>

        <div>
          <p className="text-slate-300">Local Police</p>
          <h2 className="text-xl font-semibold">+1 (555) 200-3000</h2>
        </div>

        <button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl">
          Call for Help
        </button>
      </div>
    </div>
  );
}
