import Link from 'next/link';
const LandingContent= () => {
    const features= [
      { title: "Free of charge", description: "Access all content without spending a penny" },
      { title: "Safe to use", description: "Secure browsing with no risk to your device" },
      { title: "Various genres", description: "Find manga from every genre and category" },
      { title: "High-quality scans", description: "Crystal clear images for the best reading experience" },
      { title: "Anti-overload server", description: "Fast loading times even during peak hours" },
      { title: "Fast updates", description: "Get the latest chapters as soon as they're released" },
      { title: "Zero ads & pop-ups", description: "Enjoy an uninterrupted reading experience" },
      { title: "Global access", description: "Read from anywhere without restrictions" },
      { title: "User-friendly interface", description: "Easy navigation and intuitive design" },
      { title: "Social sharing", description: "Share your favorite manga with friends" },
      { title: "Cross-device sync", description: "Continue reading across all your devices" },
      { title: "Unlimited reading", description: "No caps or limits on how much you can read" },
    ];
  
    return (
      <div className="bg-gray-900 mt-72 sm:mt-0 min-h-screen text-gray-100">
        <main className="max-w-4xl mx-auto px-6 py-16 -mt-10">
          {/* Introduction */}
          <div className="bg-gray-800 rounded-xl p-8 mb-12 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-violet-400">Manga for Everyone</h2>
            <div className="text-lg space-y-4">
              <p>
                {`Searching for a place to read manga online without breaking the bank? Whether you're looking to save on subscription costs or need a safer alternative to your current reading site, AI Manga Reader is your solution.`}
              </p>
              <p>
                {`We believe manga should be accessible to all fans, regardless of budget. That's why we've created a platform that's completely free, safe, and easy to use.`}
              </p>
            </div>
          </div>
  
          {/* Reading Guide */}
          <div className="bg-gray-800 rounded-xl p-8 mb-12 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-violet-400">How To Read Manga</h2>
            <div className="space-y-4">
              <p>{`New to manga? Don't worry! All our titles are available in English for your convenience. `}</p>
              <p>
                Unlike traditional western comics, Japanese manga is read right-to-left. Start with the frame in the upper
                right corner and end at the bottom left. We preserve this authentic reading style to give you the true manga
                experience.
              </p>
            </div>
          </div>
  
          {/* Features Section */}
          <div className="bg-gray-800 rounded-xl p-8 mb-12 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-violet-400">What Is AI Manga Reader?</h2>
            <p className="mb-6">
              {`We're an ad-free platform offering thousands of manga titles across all genres. Our database is constantly growing, and we provide premium features at no cost `}
            </p>
            <h3 className="text-xl font-semibold mb-4 text-violet-400">Our Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
              {features.map((feature, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition duration-300">
                  <h4 className="font-medium text-violet-400 mb-1">{feature.title}</h4>
                  <p className="text-sm text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
  
          {/* Safety Section */}
          <div className="bg-gray-800 rounded-xl p-8 mb-12 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-violet-400">Safe & Secure Reading</h2>
            <div className="space-y-4">
              <p>
                Unlike most free manga sites filled with intrusive ads and pop-ups, AI Manga Reader is completely ad-free. We
                prioritize your security and privacy.
              </p>
              <p>
                With no registration required, you can start reading immediately without sharing any personal information.
                Your data stays private, and your devices remain protected.
              </p>
              <p className="text-lg font-semibold text-violet-400 mt-6">
                The safest manga reading experience available online — period.
              </p>
            </div>
          </div>
        </main>
  
        {/* Footer */}
        <footer className="bg-gray-800 py-12">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h4 className="text-lg font-bold text-white mb-4">About Us</h4>
                <p className="text-gray-300">
                  AI Manga Reader is dedicated to bringing free, high-quality manga to readers around the world.
                </p>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    <Link href="/manga-list" className="hover:text-violet-400 transition duration-200">
                      Browse Manga
                    </Link>
                  </li>
                  <li>
                    <Link href="/completed" className="hover:text-violet-400 transition duration-200">
                      Completed Series
                    </Link>
                  </li>
                  <li>
                    <Link href="/genres" className="hover:text-violet-400 transition duration-200">
                      Genres
                    </Link>
                  </li>
                  <li>
                    <Link href="/latest" className="hover:text-violet-400 transition duration-200">
                      Latest Updates
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>
                    <Link href="/terms" className="hover:text-violet-400 transition duration-200">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="hover:text-violet-400 transition duration-200">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/dmca" className="hover:text-violet-400 transition duration-200">
                      DMCA
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-violet-400 transition duration-200">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
  
            <div className="text-center border-t border-gray-700 pt-6 text-gray-400 text-sm">
              <p className="mb-2">
                AI Manga Reader does not store any files on our server, we only link to media hosted on third-party services.
              </p>
              <p>© AI Manga Reader {new Date().getFullYear()} - All Rights Reserved</p>
            </div>
          </div>
        </footer>
      </div>
    );
  };

  export default LandingContent