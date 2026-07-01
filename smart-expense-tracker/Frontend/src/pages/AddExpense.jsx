import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { addExpense, updateExpense, getExpense } from '../services/expenseService'

export default function AddExpense() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [form, setForm] = useState({
    merchant: '',
    amount: '',
    category: '',
    purchase_date: '',
  })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEditing)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEditing) return
    let cancelled = false
    getExpense(id)
      .then((data) => {
        if (!cancelled) {
          setForm({
            merchant: data.merchant || '',
            amount: data.amount ?? '',
            category: data.category || '',
            purchase_date: data.purchase_date || '',
          })
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.detail || 'Failed to load expense.')
      })
      .finally(() => {
        if (!cancelled) setFetching(false)
      })
    return () => { cancelled = true }
  }, [id, isEditing])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload = {
        merchant: form.merchant,
        amount: parseFloat(form.amount),
        category: form.category,
        purchase_date: form.purchase_date,
      }

      if (isEditing) {
        await updateExpense(id, payload)
      } else {
        await addExpense(payload)
      }

      navigate('/expenses')
    } catch (err) {
      const msg =
        err.response?.data?.detail || err.message || 'Something went wrong.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {isEditing ? 'Edit Expense' : 'Add Expense'}
      </h1>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Merchant</label>
          <input
            type="text"
            name="merchant"
            required
            value={form.merchant}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="e.g. Walmart"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
          <input
            type="number"
            name="amount"
            required
            step="0.01"
            min="0"
            value={form.amount}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <input
            type="text"
            name="category"
            required
            value={form.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="e.g. Groceries"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
          <input
            type="date"
            name="purchase_date"
            required
            value={form.purchase_date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-colors duration-150 cursor-pointer"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Expense' : 'Add Expense'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/expenses')}
            className="py-2 px-4 border border-gray-300 hover:bg-gray-50 text-sm font-medium rounded-lg transition-colors duration-150 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
