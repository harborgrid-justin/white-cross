export default function ResetPasswordLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header Skeleton */}
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
        </div>

        {/* Form Skeleton */}
        <div className="mt-8 space-y-6 animate-pulse">
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-24 mx-auto" />
        </div>
      </div>
    </div>
  );
}
