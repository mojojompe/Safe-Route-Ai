

export default function Profile() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold mb-6">Profile</h1>

      <div className="bg-[#0b2419] p-6 rounded-xl w-full max-w-md">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-700"></div>
          <div>
            <h2 className="text-xl font-semibold">Alex Chen</h2>
            <p className="text-slate-400">Safe Route AI Member</p>
          </div>
        </div>
      </div>

      <div className="bg-[#0b2419] p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">Preferences</h2>

        <p className="text-slate-300 mt-4">Preferred Travel Mode:</p>
        <select className="w-full bg-slate-800 p-3 rounded-lg mt-1">
          <option>Walking</option>
          <option>Driving</option>
        </select>
      </div>
    </div>
  );
}
