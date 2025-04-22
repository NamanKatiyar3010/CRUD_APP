export default function NoInternet() {
  return (
    <div className="flex items-center justify-center h-screen bg-red-50 text-red-700">
      <div className="text-center">
        <h1 className="text-3xl font-bold">🔌 No Internet Connection</h1>
        <p className="mt-2">Please check your network and try again.</p>
      </div>
    </div>
  );
}
