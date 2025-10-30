/**
 * @fileoverview Home Page Footer Component
 * 
 * Footer component for the homepage displaying copyright information
 * and platform description.
 * 
 * @module components/pages/HomePage/HomeFooter
 * @since 1.0.0
 */

/**
 * Home Footer Component
 * 
 * Renders the homepage footer with copyright and platform information.
 */
export function HomeFooter() {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-600">
          <p>&copy; 2025 White Cross Healthcare Platform. All rights reserved.</p>
          <p className="mt-2 text-sm">
            Enterprise healthcare platform for school nursing with HIPAA compliance.
          </p>
        </div>
      </div>
    </footer>
  );
}
