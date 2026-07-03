import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover opportunities from top companies and manage your applications in one place
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/register?role=student"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
            >
              Find Jobs
            </Link>
            <Link
              href="/register?role=hiring_manager"
              className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition text-lg font-semibold"
            >
              Post Jobs
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          {/* Feature 1 */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Search Jobs</h3>
            <p className="text-gray-600">
              Browse internal and external jobs from RemoteOK and Arbeitnow
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Applications</h3>
            <p className="text-gray-600">
              Track your job applications and interview progress in real-time
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Hire Talent</h3>
            <p className="text-gray-600">
              Post jobs and manage applicants with our intuitive hiring dashboard
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-white rounded-lg shadow-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <p className="text-gray-600 mb-8">
            Join thousands of job seekers and employers using Job Scraper Platform
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-semibold text-lg"
            >
              Already have an account? Login
            </Link>
            <span className="text-gray-400">|</span>
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-700 font-semibold text-lg"
            >
              Create new account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
