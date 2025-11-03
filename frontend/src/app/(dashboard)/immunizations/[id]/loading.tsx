export default function ImmunizationDetailLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-gray-200 rounded" />
          <div className="h-32 bg-gray-200 rounded" />
          <div className="h-48 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
