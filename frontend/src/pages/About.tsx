

export default function About() {
  return (
    <div className="space-y-10">
      <h1 className="text-4xl font-bold">About Safe Route AI</h1>

      <section className="bg-[#0b2419] p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
        <p className="text-slate-300 leading-relaxed">
          Safe Route AI empowers users to make safer walking and driving
          decisions by analyzing real-time risk factors, lighting conditions,
          traffic patterns, and historical data.
        </p>
      </section>

      <section className="bg-[#0b2419] p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-3">Privacy First</h2>
        <p className="text-slate-300 leading-relaxed">
          Your location data is stored securely and never shared with third
          parties. Your information is encrypted, anonymized, and used strictly
          to enhance route safety analytics.
        </p>
      </section>

      <section className="bg-[#0b2419] p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
        <p className="text-slate-300">support@saferoute.ai</p>
      </section>
    </div>
  );
}
