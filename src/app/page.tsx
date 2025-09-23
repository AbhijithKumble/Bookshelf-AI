import { auth } from "@clerk/nextjs/server";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import UploadImage from "@/components/UploadImage";
import UploadCSV from "@/components/UploadCSV";
import Link from "next/link";

export default async function HomePage() {
  const { userId } = await auth();
  if (!userId) redirect("/intro");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">📚 BookShelf AI</h1>
            </div>
            <div className="flex items-center space-x-4">
              {/* User Button shows profile picture and dropdown */}
              <UserButton afterSignOutUrl="/intro" />
              {/* Alternative: Simple Sign Out Button */}
              <SignOutButton redirectUrl="/intro">
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome back!</h2>
          <p className="text-lg text-gray-600">Ready to discover your next great read?</p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Upload Photo Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📸</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Bookshelf Photo</h3>
            <p className="text-gray-600 mb-4">Take a photo of your bookshelf to get started</p>
            <UploadImage />
          </div>

          {/* Upload CSV Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Import Goodreads Data</h3>
            <p className="text-gray-600 mb-4">Upload your Goodreads CSV file</p>
            <UploadCSV />
          </div>

          {/* View Recommendations Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">My Recommendations</h3>
            <p className="text-gray-600 mb-4">View your personalized book suggestions</p>
            <Link href="/recommendation">
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors" >
                View Recommendations
              </button>
            </Link>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {/* Activity Items */}
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl">📚</div>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">No recent activity yet</p>
                <p className="text-gray-600 text-sm">Start by uploading a photo of your bookshelf</p>
              </div>
              <div className="text-gray-400 text-sm">
                Just now
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 BookShelf AI. Making book discovery smarter.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
