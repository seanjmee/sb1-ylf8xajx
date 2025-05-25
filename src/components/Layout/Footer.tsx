import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start">
            <Link to="/" className="text-blue-600 font-bold text-xl">
              StravaGPT
            </Link>
          </div>
          
          <div className="mt-4 md:mt-0">
            <p className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} StravaGPT. All rights reserved.
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex justify-center space-x-6">
            <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-900">
              Terms
            </Link>
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-900">
              Privacy
            </Link>
            <Link to="/contact" className="text-sm text-gray-500 hover:text-gray-900">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};