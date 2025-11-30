import { useState } from 'react'

export default function SafetyTips() {
  const [activeTab, setActiveTab] = useState('Walking')

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-green-950 dark:bg-background-dark font-display text-gray-800 dark:text-gray-200">
      <div className="flex h-full min-h-screen grow">
        <main className="flex-1 p-6 lg:p-10">
          <div className="mx-auto max-w-5xl">
            {/* PageHeading */}
            <div className="flex flex-wrap justify-between gap-3 mb-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Safety Tips</h1>
                <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">Your guide to safer journeys on foot and by car.</p>
              </div>
            </div>

            {/* Search and Tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-center gapy-10 px-4 mb-6">
              {/* SearchBar */}
              <div className="w-full sm:w-auto sm:max-w-xs">
                <label className="flex flex-col min-w-40 h-12 w-full">
                  <div className="flex w-full flex-1 items-stretch px-3 rounded-4xl h-full bg-black/5 dark:bg-white/5">
                    <div className="text-gray-500 dark:text-gray-400 flex items-center justify-center pl-4">
                      <span className="material-symbols-outlined">search</span>
                    </div>
                    <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden text-gray-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-gray-500 dark:placeholder:text-gray-400 pl-2 text-base font-normal leading-normal" placeholder="Search for a specific tip" />
                  </div>
                </label>
              </div>
              {/* Tabs */}
              <div className="w-full sm:w-auto">
                <div className="flex border-b border-black/10 dark:border-white/10 w-full">
                  <button
                    onClick={() => setActiveTab('Walking')}
                    className={`flex flex-1 items-center justify-center gap-2 border-b-[3px] pb-2.5 pt-2.5 sm:flex-initial sm:px-6 transition-colors ${activeTab === 'Walking' ? 'border-b-primary text-green-500' : 'border-b-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  >
                    <span className={`material-symbols-outlined ${activeTab === 'Walking' ? 'fill' : ''}`}>directions_walk</span>
                    <p className="text-sm font-bold leading-normal tracking-[0.015em]">Walking</p>
                  </button>
                  <button
                    onClick={() => setActiveTab('Driving')}
                    className={`flex flex-1 items-center justify-center gap-2 border-b-[3px] pb-2.5 pt-2.5 sm:flex-initial sm:px-6 transition-colors ${activeTab === 'Driving' ? 'border-b-primary text-green-500' : 'border-b-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  >
                    <span className={`material-symbols-outlined ${activeTab === 'Driving' ? 'fill' : ''}`}>directions_car</span>
                    <p className="text-sm font-bold leading-normal tracking-[0.015em]">Driving</p>
                  </button>
                </div>
              </div>
            </div>

            {/* ImageGrid as Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <div className="flex flex-col gap-3 rounded-3xl py- bg-black/5 dark:bg-white/5 py-10 px-4 transition-all hover:bg-black/10 dark:hover:bg-white/10">
                <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA5WGnvXoIGbfZ-ODqe5E3hK4Tf_73-yMf0-nXlPE2hiSfBI_zHOImAFiAV1dglrjex4hs5oR9kTsuD6fE_BXlBV8MurvhX6Xbh9mgG_9a8nimerzAbWBzaia0QNsDm_E2TZzvCLJgjzw_MpPxNed6ikpkNRTfIMkk3SsRaZEuSkz3VLalxeTrljQbhOs-A-DOp_9v5DrQ3SirHmvI648HBKUrGf11wactdsyGQ2dvNleIMC8wFCuMa5Czb9ILGbdABaXcKJZnb3nEt")' }}></div>
                <div>
                  <p className="text-gray-900 dark:text-white text-base font-medium leading-normal">Stay Aware</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal mt-1">Pay attention to your surroundings and avoid distractions like your phone.</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-3xl py- bg-black/5 dark:bg-white/5 py-10 px-4 transition-all hover:bg-black/10 dark:hover:bg-white/10">
                <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDO4FcTUaJpRkAKTHtxsuCTZOA3mWQt6BOFkP-xoS7iiW5quCdzztMKqL1vUrFXO3QlBNWaDAQBNlVSgYBJoBjXDijJEKyz9sPRT8s9JnuhAnaJsW3wRfhg1AP1ndBNHRxGfigcZr7I7HGc24EjSHoRSNufGN4tXMNAcsDDoq6KkJwHEvZA_2BZZlRP2cRtKz5R5eGVJSsL2jjNg1gt5ZvIwqgjczSWLQRQpOM4jGyLloRv51Lwi1i2bdqIz1Q7g1j5fsNIiI82QFA4")' }}></div>
                <div>
                  <p className="text-gray-900 dark:text-white text-base font-medium leading-normal">Share Your Route</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal mt-1">Let a friend or family member know your intended route and ETA.</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-3xl py- bg-black/5 dark:bg-white/5 py-10 px-4 transition-all hover:bg-black/10 dark:hover:bg-white/10">
                <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCo8ZN2a0Z4pFPu-3d-MJ4YjDEZF8Kz0VY17vEYrtaVXEhEwfUjENMfWA2hOp5YiObPrgBK8WFivb0VtiEqWZx91W61W6R1TGrv38RQgdkbatYAvkdp8OqoJlyj4sMpGeM0B6LnNyYXpGUuB9NBJ42hchaF2X3yXPKPoDDf52h_f5ciEiv1s2fRiwxkKCn5JLpHtYnZMRtMbtSOupXz7BYFa_SXFoDoEiwW6jPEmHLm4wBn-lXOMXNaLrzVEXIGL_JKttdq0lMn6U7q")' }}></div>
                <div>
                  <p className="text-gray-900 dark:text-white text-base font-medium leading-normal">Wear Bright Clothing</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal mt-1">Make yourself more visible to drivers, especially at night or in low light.</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-3xl py- bg-black/5 dark:bg-white/5 py-10 px-4 transition-all hover:bg-black/10 dark:hover:bg-white/10">
                <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDNQ0nyiX5v0qMDtF_f1HnRKYM-ZEoOrKR5rfk2KmjVb4lmect7amzTr8_gP451-pjeBvL5ZuFQBkC8woyFMI19_yvZFpSroxXXBs9cSVoum0RI6cRQtIkv3hsNQTTpbVPKIHxD1IppaNkUtKQIT8z6oWSqd1C6Vrq59HZC1_U2cvIBAudbFXuFY7Z6FKHs8kS7BTHcAFI7DqimTRaju0NLa-f6taLRzwulthYjAmNXYO7gpISJfryVXw8LP0wkiujXLF08Uuk_e87u")' }}></div>
                <div>
                  <p className="text-gray-900 dark:text-white text-base font-medium leading-normal">Stick to Well-Lit Paths</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal mt-1">When walking at night, choose routes that are well-illuminated and populated.</p>
                  <div className="mt-2 inline-flex items-center gap-1 rounded-4xl bg-green-900 text-green-500 px-3 py-1 font-medium text-1">
                    <span className="material-symbols-outlined">nightlight</span>
                    Contextual Tip
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-3xl py- bg-black/5 dark:bg-white/5 py-10 px-4 transition-all hover:bg-black/10 dark:hover:bg-white/10">
                <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDa7U7oDEMqQGo9FGefNUTzJffOmwKwdG070pZRZFifjo-6mFQg8KqI4Da42RtJEUmcdzrNrbQkOLqQIXDPFEYYJCQ5KMLc3W9h6eR4CZP0XIJwKIx4VIM2Dvfzxz45WFdVk3mfBiDx17QlSuwF93LRdbntv-hQc2j04HDfg7RGJplydRJ-fD8-_s4J8jFT_hMBMpZwHckA1TGp93y3qiB-J8_a1aS4k-uYxUj5on6Dh6Uvzu2ODdmd6YwspmHF7dL0jrYVnuU7yFAC")' }}></div>
                <div>
                  <p className="text-gray-900 dark:text-white text-base font-medium leading-normal">Use Crosswalks</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal mt-1">Always cross streets at designated crosswalks or intersections for safety.</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-3xl py- bg-black/5 dark:bg-white/5 py-10 px-4 transition-all hover:bg-black/10 dark:hover:bg-white/10">
                <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC1s5WK3_IahU0J3r5JQMEFCu5pAScsJSxRFrqwUHLy3qik1stapgTtsJGF0r4zLn436ce1RffrjrnCDFWEzs1FQmJmlMkJ4PL3EpYXhMEXK_qohEa1InPKBYM7TED8b4zZCh8juH9FhpkVdjQE0t1quC8LdeQAh9Rk01u5cw1sL0haAQdLOjP-rr-GXjFUWkOhh9l2iRAiGQc23Cf_GQgu6-MkmkiJ3OhFJevbk6H7IIKWMy2dQ1NtBMiog4HySH8aBwmtTa8_R9iq")' }}></div>
                <div>
                  <p className="text-gray-900 dark:text-white text-base font-medium leading-normal">Avoid Shortcuts</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal mt-1">Unknown shortcuts can be poorly lit or isolated. Stick to familiar paths.</p>
                </div>
              </div>
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
    </div>
  )
}
