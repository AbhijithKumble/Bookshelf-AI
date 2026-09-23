"use client";

import { SignedOut, SignUpButton, useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function IntroPage() {
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      redirect('/');
    }
  }, [isLoaded, isSignedIn]);

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">📚 BookShelf AI</h2>
          <p className="text-gray-600">Preparing your reading journey...</p>
        </div>
      </div>
    ); 
  }

  // If user is signed in, don't render the intro page content
  if (isSignedIn) {
    return null;
  }

  return (
    <SignedOut>
      <main className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
        <nav className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-800">📚 BookShelf AI</h1>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-4 py-12">

          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Discover Your Next Great Read
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Snap a photo of your bookshelf and get personalized book recommendations based on your reading preferences
            </p>
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
              <div className="text-6xl mb-4">📱📖</div>
              <p className="text-gray-700 text-lg">
                Transform your bookshelf into smart recommendations
              </p>
            </div>
          </div>

          <div className="mb-16">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h3>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-transform">
                <div className="text-4xl mb-4">📸</div>
                <h4 className="text-xl font-semibold text-gray-800 mb-4">1. Take a Photo</h4>
                <p className="text-gray-600">
                  Simply snap a picture of your bookshelf or any book you own. Our AI will identify the books in your collection.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-transform">
                <div className="text-4xl mb-4">📊</div>
                <h4 className="text-xl font-semibold text-gray-800 mb-4">2. Upload Your Data</h4>
                <p className="text-gray-600">
                  Upload your Goodreads CSV file to help us understand your reading history and preferences better.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition-transform">
                <div className="text-4xl mb-4">✨</div>
                <h4 className="text-xl font-semibold text-gray-8800 mb-4">3. Get Recommendations</h4>
                <p className="text-gray-600">
                  Receive personalized book recommendations similar to the books you already love and own.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">Why BookShelf AI?</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <div className="text-2xl">🤖</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">AI-Powered Recognition</h4>
                  <p className="text-gray-600">Advanced computer vision to identify books from your photos</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-2xl">🎯</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Personalized Recommendations</h4>
                  <p className="text-gray-600">Tailored suggestions based on your unique reading taste</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-2xl">⚡</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Quick & Easy</h4>
                  <p className="text-gray-600">Get recommendations in seconds, not hours of browsing</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="text-2xl">📚</div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Goodreads Integration</h4>
                  <p className="text-gray-600">Leverage your existing reading data for better accuracy</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Find Your Next Favorite Book?</h3>
              <p className="text-lg mb-6 opacity-90">
                Join thousands of readers discovering amazing books with BookShelf AI
              </p>
              <SignUpButton>
                <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
                  Get Started Now
                </button>
              </SignUpButton>
            </div>
          </div>
        </div>

        <footer className="bg-gray-800 text-white py-8 mt-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p>&copy; 2025 BookShelf AI. Making book discovery smarter, one photo at a time.</p>
          </div>
        </footer>
      </main>
    </SignedOut>
  );
}