export default function Profile() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-gray-800 dark:text-gray-200">
      <div className="flex h-full min-h-screen grow">
        <main className="flex-1 p-6 lg:p-10">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col gap-2 mb-8 text-center">
              <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Your Profile</h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-normal leading-normal">Manage your account settings and preferences.</p>
            </div>

            <div className="bg-black/5 dark:bg-white/5 rounded-xl p-8 flex flex-col items-center gap-6">
              <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-32" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCbpePpAYs3whPbw9byr0pPQSdecansQBiswcwF1tbYt3QT-9fLJUdD_dGvJAsGOpugLc231FTJyko5EFZDLRvFo5y8t6vlwsrGmnTksC7qwtGfVaiycqWeO7fJJrsNZ5aVUu05qbumVC9BIim9YnjP8KIc84mAmmqYG49blACV1m0oVsl0dl8NfCFnjxVkq9fDaLJ1fJLIlO3_4M35k54jTXsnnSZv8UGd-ndJ-Nf8TjYpWfA_rutxHPgk7KdCySLjAKYbCn-ahCwo")' }}></div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Alex Chen</h2>
                <p className="text-gray-500 dark:text-gray-400">alex.chen@example.com</p>
              </div>

              <div className="w-full max-w-md flex flex-col gap-4">
                <button className="w-full py-3 px-4 rounded-lg bg-primary text-background-dark font-bold hover:bg-primary/90 transition-colors">
                  Edit Profile
                </button>
                <button className="w-full py-3 px-4 rounded-lg border border-black/10 dark:border-white/10 text-gray-900 dark:text-white font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                  Change Password
                </button>
                <button className="w-full py-3 px-4 rounded-lg border border-red-500/20 text-red-500 font-medium hover:bg-red-500/10 transition-colors">
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
