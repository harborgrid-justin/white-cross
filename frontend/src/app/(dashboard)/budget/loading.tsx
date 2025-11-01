export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-64"></div>
        <div className="h-4 bg-gray-200 rounded w-96"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border rounded-lg p-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-8 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}