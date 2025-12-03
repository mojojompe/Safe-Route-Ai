import { MdLocalPolice, MdLocalHospital, MdPerson, MdCall } from 'react-icons/md'

export default function Emergency() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-sr-dark font-display text-gray-200">
      <div className="flex h-full min-h-screen grow">
        <main className="flex-1 p-6 lg:p-10">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col gap-2 mb-8 text-center">
              <h1 className="text-red-500 text-4xl font-black leading-tight tracking-[-0.033em]">Emergency Assistance</h1>
              <p className="text-gray-400 text-lg font-normal leading-normal">Quick access to emergency contacts and services.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex flex-col gap-4 items-center text-center">
                <div className="size-16 rounded-full bg-red-500 text-white flex items-center justify-center">
                  <MdLocalPolice className="text-3xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Police</h2>
                  <p className="text-red-500 font-bold text-3xl mt-2">911</p>
                </div>
                <button className="w-full py-3 px-4 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-colors">
                  Call Now
                </button>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex flex-col gap-4 items-center text-center">
                <div className="size-16 rounded-full bg-red-500 text-white flex items-center justify-center">
                  <MdLocalHospital className="text-3xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Medical</h2>
                  <p className="text-red-500 font-bold text-3xl mt-2">911</p>
                </div>
                <button className="w-full py-3 px-4 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-colors">
                  Call Now
                </button>
              </div>
            </div>

            <div className="mt-8 bg-white/5 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Emergency Contacts</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                      <MdPerson />
                    </div>
                    <div>
                      <p className="font-bold text-white">Mom</p>
                      <p className="text-sm text-gray-400">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <button className="p-2 rounded-full bg-green-500/10 text-green-500 hover:bg-green-500/20">
                    <MdCall />
                  </button>
                </div>
                <button className="w-full py-3 border-2 border-dashed border-gray-700 rounded-lg text-gray-400 font-medium hover:border-primary hover:text-primary transition-colors">
                  + Add Emergency Contact
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
