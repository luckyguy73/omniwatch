export default function TvShowsTab({ theme }: { theme: string }) {
  return (
    <div>
      <h2 className={`text-xl font-semibold mb-4 ${theme === "dark" ? "text-blue-200" : "text-gray-800"}`}>Your TV Shows</h2>
      <p className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>List of selected TV shows will appear here.</p>
      <p className={theme === "dark" ? "text-gray-400" : "text-gray-500"}>Features like next episode info, network, and previous episodes will be added.</p>
    </div>
  );
}
