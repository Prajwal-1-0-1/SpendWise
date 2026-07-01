import api from './api'

export async function getExpenses() {
  const res = await api.get('/crud/get_expenses')
  return res.data
}

export async function getExpense(id) {
  const res = await api.get(`/crud/get_expense/${id}`)
  return res.data
}

export async function deleteExpense(id) {
  const res = await api.delete(`/crud/delete_expenses/${id}`)
  return res.data
}

export async function addExpense(data) {
  const res = await api.post('/crud/add-expense', data)
  return res.data
}

export async function updateExpense(id, data) {
  const res = await api.put(`/crud/update_expense/${id}`, data)
  return res.data
}

export async function uploadReceipt(file) {
  const formData = new FormData()
  formData.append('file', file)

  const res = await api.post('/crud/upload-receipt', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}
