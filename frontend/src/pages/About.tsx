import { MdVerifiedUser, MdLock, MdEmail } from 'react-icons/md'

export default function About() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-green-950 bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200">
      <main className="flex-1 p-6 lg:p-10">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-2 mb-8 text-center">
            <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
              About Safe Route AI
            </h1>
            <p className="text-gray-500 dark:text-green-600 text-lg font-normal leading-normal">
              Your trusted partner in navigating the world more safely.
            </p>
          </div>
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-green-700 mb-4">
                Our Mission
              </h2>

              <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-black/5 dark:bg-white/5 rounded-4xl backdrop-blur-sm border border-white/10">
                <div className="flex-shrink-0 text-primary">
                  <MdVerifiedUser className="!text-6xl text-green-600" />
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  At Safe Route AI, our mission is to empower individuals to
                  make safer travel choices, whether walking or driving. We
                  leverage cutting-edge AI and real-time data to analyze routes
                  for potential hazards, providing you with the safest possible
                  path to your destination. We believe that everyone deserves to
                  feel secure, and our technology is designed to provide peace
                  of mind for every journey.
                </p>
              </div>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-green-700 mb-4">
                Your Privacy is Our Priority
              </h2>
              <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-black/5 dark:bg-white/5 rounded-4xl backdrop-blur-sm border border-white/10">
                <div className="flex-shrink-0 text-primary">
                  <MdLock className="!text-6xl text-green-600" />
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  We are committed to protecting your privacy. Your location
                  data is used only to provide and improve our safety services
                  and is never shared with third parties without your explicit
                  consent. All data is anonymized and encrypted to ensure your
                  personal information remains secure. Your trust is the
                  foundation of our service.
                </p>
              </div>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-green-700 mb-4">
                Contact Us
              </h2>
              <div className="p-6 bg-black/5 dark:bg-white/5 rounded-4xl text-center backdrop-blur-sm border border-white/10">
                <p className="text-gray-600 dark:text-gray-300">
                  Have questions, feedback, or need support? Our team is here to
                  help.
                </p>
                <a
                  className="mt-4 inline-flex items-center gap-2 text-green-700 font-semibold hover:underline"
                  href="mailto:support@saferoute.ai"
                >
                  <MdEmail />
                  support@saferoute.ai
                </a>
              </div>
            </section>
          </div>
        </div>
        <footer className="w-full py-6 text-center text-slate-600 dark:text-slate-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Safe Route AI. All rights
            reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}
