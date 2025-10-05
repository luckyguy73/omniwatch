import React from 'react';

export default function MoviesTab({ theme }: { theme: string }) {
  return (
    <div className={theme === "dark" ? "bg-gray-900 rounded-lg shadow p-6" : "bg-white rounded-lg shadow p-6"}>
      <h2 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-blue-200" : "text-gray-800"}`}>Your Movies</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Movie cards will go here */}
        <div className={theme === "dark" ? "bg-gray-800 rounded p-4 text-center text-gray-300" : "bg-gray-100 rounded p-4 text-center text-gray-600"}>
          List of selected movies will appear here.
        </div>
      </div>
    </div>
  );
}
