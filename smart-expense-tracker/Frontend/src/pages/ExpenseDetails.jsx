import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getExpense } from '../services/expenseService'

export default function ExpenseDetails() {
  const { id } = useParams()
  const [expense, setExpense] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    getExpense(id)
      .then((data) => {
        if (!cancelled) setExpense(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.detail || 'Failed to load expense.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Link to="/expenses" className="text-sm text-indigo-600 hover:text-indigo-800 mb-4 inline-block">
          &larr; Back to Expenses
        </Link>
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      </div>
    )
  }

  if (!expense) return null

  const detailRows = [
    { label: 'Merchant', value: expense.merchant || expense.merchant_name || 'Unknown' },
    { label: 'Amount', value: `₹${Number(expense.amount).toFixed(2)}` },
    { label: 'Category', value: expense.category || 'Uncategorized' },
    {
      label: 'Purchase Date',
      value: expense.purchase_date
        ? new Date(expense.purchase_date).toLocaleDateString()
        : '—',
    },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/expenses" className="text-sm text-indigo-600 hover:text-indigo-800 inline-block">
          &larr; Back to Expenses
        </Link>
        <Link
          to={`/expenses/${id}/edit`}
          className="text-sm py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-150"
        >
          Edit
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900">Expense Details</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
        {detailRows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <span className="text-sm font-medium text-gray-500">{row.label}</span>
            <span className="text-sm font-semibold text-gray-900">{row.value}</span>
          </div>
        ))}
      </div>

      {/* Receipt Information */}
      {expense.receipt_url && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Receipt</h2>
          <img
            src={expense.receipt_url}
            alt="Receipt"
            className="max-w-full rounded-lg border border-gray-200"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </div>
      )}

      {expense.receipt_filename && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Receipt Information</h2>
          <p className="text-sm text-gray-600">
            File: <span className="font-medium text-gray-900">{expense.receipt_filename}</span>
          </p>
        </div>
      )}
    </div>
  )
}
