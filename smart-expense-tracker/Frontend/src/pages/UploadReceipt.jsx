import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { uploadReceipt } from '../services/expenseService'

export default function UploadReceipt() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const reset = () => {
    setFile(null)
    setProgress(0)
    setMessage('')
    setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleFile = (selected) => {
    if (selected && selected[0]) {
      setFile(selected[0])
      setMessage('')
      setError('')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files)
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError('')
    setMessage('')

    try {
      setProgress(50)
      await uploadReceipt(file)
      setProgress(100)
      setMessage('Receipt uploaded successfully!')
      setTimeout(() => navigate('/expenses'), 1500)
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.')
      setProgress(0)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Upload Receipt</h1>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
          dragOver
            ? 'border-indigo-500 bg-indigo-50'
            : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => handleFile(e.target.files)}
          className="hidden"
        />

        {file ? (
          <div>
            <p className="text-sm font-medium text-gray-900">{file.name}</p>
            <p className="text-xs text-gray-500 mt-1">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
        ) : (
          <div>
            <p className="text-gray-500 text-sm">
              Drag and drop your receipt here, or click to browse
            </p>
            <p className="text-xs text-gray-400 mt-1">Supports images and PDF</p>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Loading Spinner */}
      {uploading && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          Uploading...
        </div>
      )}

      {/* Success */}
      {message && (
        <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
          {message}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium rounded-lg transition-colors duration-150 cursor-pointer"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
        <button
          onClick={reset}
          disabled={uploading}
          className="py-2 px-4 border border-gray-300 hover:bg-gray-50 text-sm font-medium rounded-lg transition-colors duration-150 cursor-pointer"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
