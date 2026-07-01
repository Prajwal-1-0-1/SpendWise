import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-indigo-600">404</h1>
        <p className="mt-4 text-lg text-gray-600">Page not found</p>
        <Link
          to="/dashboard"
          className="mt-6 inline-block py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-150"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
