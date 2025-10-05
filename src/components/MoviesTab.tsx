import React from 'react';

export default function MoviesTab({ theme, items = [] }: { theme: string; items?: any[] }) {
  return (
    <div className={theme === "dark" ? "bg-gray-900 rounded-lg shadow p-6" : "bg-white rounded-lg shadow p-6"}>
      <h2 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-blue-200" : "text-gray-800"}`}>Your Movies</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.length === 0 ? (
          <div className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>No movies found.</div>
        ) : (
          items.map(item => (
            <div key={item.id} className={theme === "dark" ? "bg-gray-800 rounded-lg p-4 shadow text-blue-100" : "bg-gray-100 rounded-lg p-4 shadow text-gray-800"}>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
