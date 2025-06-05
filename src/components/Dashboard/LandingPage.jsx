import { useState, useEffect } from 'react';

function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navbar */}
      <nav className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-indigo-500 dark:text-indigo-300">Synapaxon</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="#" className="border-indigo-500 dark:border-indigo-300 text-gray-900 dark:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Home
                </a>
                <a href="#features" className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-indigo-500 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Features
                </a>
                <a href="#pricing" className="border-transparent text-gray-5 System: 00 dark:text-gray-400 hover:border-gray-300 dark:hover:border-indigo-500 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Pricing
                </a>
                <a href="#faq" className="border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-indigo-500 hover:text-gray-700 dark:hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  FAQ
                </a>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <a href="/login" className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-3 py-2 text-sm font-medium">
                Login
              </a>
              <a
                href="/signup"
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium shadow-sm text-white bg-indigo-500 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register
              </a>
              <button
                  onClick={toggleDarkMode}
                  className={`ml-3 relative inline-block w-12 h-6 rounded-full transition-all duration-300 bg-gradient-to-r bg-[length:200%_100%] ${
                    isDarkMode
                      ? 'from-gray-200 to-gray-800 bg-right'
                      : 'from-gray-200 to-gray-800 bg-left'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 bg-gradient-to-r bg-[length:200%_100%] ${
                      isDarkMode
                        ? 'left-[calc(100%-1.25rem-0.125rem)] from-gray-200 to-gray-800 bg-left'
                        : 'left-0.5 from-gray-200 to-gray-800 bg-right'
                    }`}
                  ></span>
                </button>



            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
            <div className="pt-2 pb-3 space-y-1">
              <a href="#" className="bg-indigo-50 dark:bg-indigo-900/50 border-indigo-500 dark:border-indigo-300 text-indigo-500 dark:text-indigo-300 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                Home
              </a>
              <a href="#features" className="border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-indigo-500 hover:text-gray-700 dark:hover:text-gray-200 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                Features
              </a>
              <a href="#pricing" className="border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-indigo-500 hover:text-gray-700 dark:hover:text-gray-200 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                Pricing
              </a>
              <a href="#faq" className="border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-indigo-500 hover:text-gray-700 dark:hover:text-gray-200 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">
                FAQ
              </a>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <a href="/login" className="block px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Login
                </a>
                <a
                  href="/signup"
                  className="block w-full px-4 py-2 mt-2 text-base font-medium text-center text-white bg-indigo-500 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500"
                >
                  Register
                </a>
                <button
                  onClick={toggleDarkMode}
                  className="block w-full px-4 py-2 mt-2 text-base font-medium text-center text-gray-900 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center transition-colors duration-200"
                >
                  {isDarkMode ? (
                    <>
                      <i className="fas fa-sun mr-2"></i> Light Mode
                    </>
                  ) : (
                    <>
                      <i className="fas fa-moon mr-2"></i> Dark Mode
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 shadow-md">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl lg:text-6xl">
            Elevate Your Learning Experience
          </h1>
          <p className="mt-6 max-w-lg mx-auto text-xl text-gray-500 dark:text-gray-300">
            The Most Powerfull Way To Learn Is To Create Your Own Content.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <a
              href="/signup"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium shadow-sm text-white bg-indigo-500 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500"
            >
              Get Started
            </a>
            <a
              href="#features"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium text-indigo-500 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50 hover:bg-indigo-200 dark:hover:bg-indigo-800"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-12 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-500 dark:text-indigo-300 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              Everything you need to learn effectively
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {/* Feature 1 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 bg-indigo-500 dark:bg-indigo-600 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Custom Quizzes</p>
                <p className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                  Create personalized quizzes with our intuitive builder. Add images, videos, and multiple question types.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 bg-indigo-500 dark:bg-indigo-600 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">User-Generated Content</p>
                {/* <p className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                  Share your quizzes with the community or keep them private. Discover content from other educators.
                </p> */}
              </div>

              {/* Feature 3 */}
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 bg-indigo-500 dark:bg-indigo-600 text-white">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Subscription Plans</p>
                <p className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-300">
                  Choose the plan that fits your needs. 
                  {/* Free forever option available with premium features for power users. */}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-16 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 text-center">Pricing Plans</h2>
            <p className="mt-5 text-xl text-gray-500 dark:text-gray-300 text-center">
              Start for free, upgrade when you need more.
            </p>
            <div className="relative mt-12 bg-transparent space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto">
              {/* Free Tier */}
              <div className="border border-gray-200 dark:border-gray-700 shadow-sm divide-y divide-gray-200 dark:divide-gray-700 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm">
                <div className="p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Free</h3>
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-300">Perfect for getting started</p>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">$0</span>
                    <span className="text-base font-medium text-gray-500 dark:text-gray-300">/month</span>
                  </p>
                  <a
                    href="/signup"
                    className="mt-8 block w-full py-3 px-6 border border-transparent text-center font-medium text-white bg-indigo-500 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500"
                  >
                    Get started
                  </a>
                </div>
                <div className="pt-6 pb-8 px-6">
                  <h4 className="sr-only">Features</h4>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <p className="ml-3 text-base text-gray-500 dark:text-gray-300">Up to 5 quizzes</p>
                    </li>
                    <li className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <p className="ml-3 text-base text-gray-500 dark:text-gray-300">Basic question types</p>
                    </li>
                    {/* <li className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <p className="ml-3 text-base text-gray-500 dark:text-gray-300">Community content access</p>
                    </li> */}
                  </ul>
                </div>
              </div>

              {/* Pro Tier */}
              <div className="border-2 border-indigo-500 dark:border-indigo-300 shadow-sm divide-y divide-gray-200 dark:divide-gray-700 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm">
                <div className="p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Pro</h3>
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-300">For serious learners and educators</p>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">$9</span>
                    <span className="text-base font-medium text-gray-500 dark:text-gray-300">/month</span>
                  </p>
                  <a
                    href="/signup"
                    className="mt-8 block w-full py-3 px-6 border border-transparent text-center font-medium text-white bg-indigo-500 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500"
                  >
                    Upgrade
                  </a>
                </div>
                <div className="pt-6 pb-8 px-6">
                  <h4 className="sr-only">Features</h4>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <p className="ml-3 text-base text-gray-500 dark:text-gray-300">Unlimited Questions Uploads</p>
                    </li>
                    <li className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <p className="ml-3 text-base text-gray-500 dark:text-gray-300">Advanced question types</p>
                    </li>
                    <li className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <p className="ml-3 text-base text-gray-500 dark:text-gray-300">Analytics dashboard</p>
                    </li>
                    <li className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <p className="ml-3 text-base text-gray-500 dark:text-gray-300">Priority support</p>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Enterprise Tier */}
              <div className="border border-gray-200 dark:border-gray-700 shadow-sm divide-y divide-gray-200 dark:divide-gray-700 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm">
                <div className="p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">Premium</h3>
                  <p className="mt-4 text-sm text-gray-500 dark:text-gray-300">For schools and organizations</p>
                  <p className="mt-8">
                    <span className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">$29</span>
                    <span className="text-base font-medium text-gray-500 dark:text-gray-300">/month</span>
                  </p>
                  <a
                    href="/contact"
                    className="mt-8 block w-full py-3 px-6 border border-transparent text-center font-medium text-white bg-indigo-500 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500"
                  >
                    Contact us
                  </a>
                </div>
                <div className="pt-6 pb-8 px-6">
                  <h4 className="sr-only">Features</h4>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <p className="ml-3 text-base text-gray-500 dark:text-gray-300">All Pro Features</p>
                    </li>
                    <li className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <p className="ml-3 text-base text-gray-500 dark:text-gray-300">Chat Bot Integration</p>
                    </li>
                    <li className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <p className="ml-3 text-base text-gray-500 dark:text-gray-300">Admin Priority Support</p>
                    </li>
                    <li className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <p className="ml-3 text-base text-gray-500 dark:text-gray-300">Email Updates</p>
                    </li>
                    {/* <li className="flex items-start">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <p className="ml-3 text-base text-gray-500 dark:text-gray-300">Dedicated account manager</p>
                    </li> */}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-500 dark:bg-indigo-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to transform your learning?</span>
            <span className="block">Start using Synapaxon today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200 dark:text-indigo-300">
            Join thousands of educators and learners who are already benefiting from our platform.
          </p>
          <a
            href="/signup"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium text-indigo-600 dark:text-white bg-white dark:bg-indigo-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-800 sm:w-auto"
          >
            Sign up for free
          </a>
        </div>
      </div>

      {/* FAQ Section */}
      <div id="faq" className="py-16 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-500 dark:text-indigo-300 font-semibold tracking-wide uppercase">FAQs</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              Frequently asked questions
            </p>
          </div>
          <div className="mt-12">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12">
              <div>
                <dt className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                  How do I create a quiz?
                </dt>
                <dd className="mt-2 text-base text-gray-500 dark:text-gray-300">
                  After signing up, click "Create Questions" in your dashboard. Our intuitive editor will guide you through adding questions, answers, and multimedia.
                </dd>
              </div>
              {/* <div>
                <dt className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                  Can I share my quizzes with others?
                </dt>
                <dd className="mt-2 text-base text-gray-500 dark:text-gray-300">
                  Absolutely! You can share via link, embed on websites, or contribute to our public library (optional).
                </dd>
              </div> */}
              <div>
                <dt className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                  What payment methods do you accept?
                </dt>
                <dd className="mt-2 text-base text-gray-500 dark:text-gray-300">
                  We accept all major credit cards (Visa, Mastercard, American Express) and Stripe.
                </dd>
              </div>
              <div>
                <dt className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                  How can I contact support?
                </dt>
                <dd className="mt-2 text-base text-gray-500 dark:text-gray-300">
                  Email us at support@synapaxon.com or use the chat widget in the app. Premium users get priority support.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
            <div className="px-5 py-2">
              <a href="#" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                Home
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#features" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                Features
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#pricing" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                Pricing
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#faq" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                FAQ
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="/contact" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                Contact
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="/privacy" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                Privacy
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="/terms" className="text-base text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">
                Terms
              </a>
            </div>
          </nav>
          <div className="mt-8 flex justify-center space-x-6">
            <a href="#" className="text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-100">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-100">
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
          <p className="mt-8 text-center text-base text-gray-400 dark:text-gray-300">
            &copy; 2023 Synapaxon. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;