import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getExpenses } from '../services/expenseService'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316']

function groupByCategory(expenses) {
  const map = {}
  expenses.forEach((exp) => {
    const cat = exp.category || 'Uncategorized'
    map[cat] = (map[cat] || 0) + Number(exp.amount)
  })
  return Object.entries(map).map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
}

export default function Dashboard() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    getExpenses()
      .then((data) => {
        if (!cancelled) setExpenses(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.detail || 'Failed to load expenses.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
        {error}
      </div>
    )
  }

  const totalExpenses = expenses.length
  const totalSpending = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0)
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.purchase_date || b.date) - new Date(a.purchase_date || a.date))
    .slice(0, 5)
  const chartData = groupByCategory(expenses)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500">Total Expenses</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{totalExpenses}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500">Total Spending</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            ${totalSpending.toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
          <p className="text-sm font-medium text-gray-500">Quick Actions</p>
          <Link
            to="/upload"
            className="mt-3 inline-block text-center py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-150"
          >
            Upload Receipt
          </Link>
        </div>
      </div>

      {/* Recent Expenses & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Expenses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Expenses</h2>
            <Link to="/expenses" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              View all
            </Link>
          </div>

          {recentExpenses.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">No expenses yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentExpenses.map((exp) => (
                <li key={exp.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{exp.merchant || exp.merchant_name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{exp.category || 'Uncategorized'}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    ${Number(exp.amount).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Category Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Spending by Category</h2>

          {chartData.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">No data to display.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
