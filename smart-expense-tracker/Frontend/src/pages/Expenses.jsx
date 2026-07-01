import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getExpenses, deleteExpense } from '../services/expenseService'

export default function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [sortBy, setSortBy] = useState('date') // 'date' or 'amount'
  const [sortDir, setSortDir] = useState('desc')

  const fetchExpenses = () => {
    setLoading(true)
    setError('')
    getExpenses()
      .then((data) => setExpenses(data))
      .catch((err) => setError(err.response?.data?.detail || 'Failed to load expenses.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return
    try {
      await deleteExpense(id)
      setExpenses((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to delete expense.')
    }
  }

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortDir(field === 'date' ? 'desc' : 'desc')
    }
  }

  // derive unique categories
  const categories = [...new Set(expenses.map((e) => e.category).filter(Boolean))]

  // filter & sort
  const filtered = expenses
    .filter((e) => {
      const q = search.toLowerCase()
      const matchesSearch = !q ||
        (e.merchant || e.merchant_name || '').toLowerCase().includes(q) ||
        (e.category || '').toLowerCase().includes(q)
      const matchesCategory = !categoryFilter || e.category === categoryFilter
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      let cmp
      if (sortBy === 'date') {
        cmp = new Date(a.purchase_date || a.date) - new Date(b.purchase_date || b.date)
      } else {
        cmp = Number(a.amount) - Number(b.amount)
      }
      return sortDir === 'asc' ? cmp : -cmp
    })

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
        <Link
          to="/expenses/new"
          className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors duration-150"
        >
          + Add Expense
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by merchant or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-sm">No expenses found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Merchant</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Category</th>
                  <th
                    className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none"
                    onClick={() => toggleSort('amount')}
                  >
                    Amount {sortBy === 'amount' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th
                    className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none"
                    onClick={() => toggleSort('date')}
                  >
                    Purchase Date {sortBy === 'date' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                  </th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((exp) => (
                  <tr key={exp.id} className="hover:bg-gray-50 transition-colors duration-100">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {exp.merchant || exp.merchant_name || 'Unknown'}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {exp.category || 'Uncategorized'}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      ${Number(exp.amount).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {exp.purchase_date
                        ? new Date(exp.purchase_date).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-right space-x-3">
                      <Link
                        to={`/expenses/${exp.id}/edit`}
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="text-sm text-red-600 hover:text-red-800 font-medium cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
