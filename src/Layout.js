import React from "react";
import { Link, Outlet } from "react-router-dom";

const Layout = ({ isLoggedIn, profilePic, logout }) => {
  return (
    <div className="flex flex-col min-h-screen font-inter">
      {/* Header */}
      <header className="bg-gray-800 text-white px-6 py-4 shadow-md sticky top-0 z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          {/* Left side - Logo */}
          <Link to="/" className="text-xl font-bold">
            TX JOB HUB
          </Link>

          {/* Right side - Navigation */}
          <nav>
            <ul className="flex items-center space-x-6">
              <li>
                <Link to="/" className="hover:text-blue-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="hover:text-blue-400">
                  Contact Us
                </Link>
              </li>

              {isLoggedIn ? (
                <li className="relative group">
                  {/* Profile Picture */}
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer"
                  />

                  {/* Dropdown Menu */}
                  <ul className="absolute right-0 mt-2 w-40 bg-white text-gray-800 rounded-lg shadow-lg hidden group-hover:block">
                    <li>
                      <Link
                        to="/user/dashboard"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="hover:text-blue-400">
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="hover:text-blue-400">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content (scrollable body) */}
      <main className="flex-grow px-6 py-4 overflow-y-auto">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6">
        <p className="text-sm">
          &copy; 2025 TX Job Hub. All rights reserved.
        </p>
        <div className="mt-2 space-x-4">
          <Link to="/privacy-policy" className="hover:text-white">
            Privacy Policy
          </Link>
          <Link to="/terms-of-service" className="hover:text-white">
            Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
