

export default function Resources() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Resources</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0b2419] p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-3">Safety Checklist</h2>
          <ul className="text-slate-300 list-disc list-inside space-y-1">
            <li>Stay alert at night</li>
            <li>Share your route with someone</li>
            <li>Stick to populated areas</li>
            <li>Check estimated arrival time</li>
          </ul>
        </div>

        <div className="bg-[#0b2419] p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-3">Driving Tips</h2>
          <p className="text-slate-300">
            Avoid dangerous shortcuts, keep your headlights on at night,
            maintain safe speed levels, and watch out for sudden lane changes.
          </p>
        </div>
      </div>
    </div>
  );
}
