import { useEffect, useState } from 'react'
import api from '../services/api'

const initialForm = {
  lender_name: '',
  loan_amount: '',
  outstanding_balance: '',
  interest_rate: '',
  emi: '',
  loan_type: '',
}

function Dashboard() {
  const [loans, setLoans] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingLoanId, setEditingLoanId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [tableLoading, setTableLoading] = useState(false)
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [analysis, setAnalysis] = useState(null)
  const [analysisForm, setAnalysisForm] = useState({
    monthly_income: '',
    monthly_expenses: '',
    monthly_emi: '',
    outstanding_balance: '',
  })
  const [analysisMessage, setAnalysisMessage] = useState({ type: '', text: '' })
  const [predictionLoading, setPredictionLoading] = useState(false)
  const [prediction, setPrediction] = useState(null)
  const [predictionForm, setPredictionForm] = useState({
    financial_health_score: '',
    outstanding_balance: '',
  })
  const [predictionMessage, setPredictionMessage] = useState({ type: '', text: '' })
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState(null)
  const [aiForm, setAiForm] = useState({
    user_name: '',
    lender_name: '',
    loan_amount: '',
    outstanding_balance: '',
    monthly_income: '',
    monthly_expenses: '',
    financial_health_score: '',
    settlement_percentage: '',
    estimated_settlement_amount: '',
  })
  const [aiMessage, setAiMessage] = useState({ type: '', text: '' })

  const getCurrentUserId = () => {
    const token = localStorage.getItem('access_token')

    if (!token) {
      return 1
    }

    try {
      const payload = token.split('.')[1]
      const decoded = JSON.parse(atob(payload))
      return Number(decoded.sub) || 1
    } catch {
      return 1
    }
  }

  const normalizeNumericValue = (value) => {
    if (value === '' || value === null || value === undefined) {
      return undefined
    }

    const trimmedValue = String(value).trim()

    if (trimmedValue === '') {
      return undefined
    }

    const parsedValue = Number(trimmedValue)
    return Number.isNaN(parsedValue) ? undefined : parsedValue
  }

  const formatCurrency = (value) => `$${Number(value ?? 0).toFixed(2)}`

  const getErrorMessage = (error) => {
    const detail = error?.response?.data?.detail

    if (Array.isArray(detail)) {
      return detail.map((item) => item?.msg || item?.loc?.slice(-1)[0]).join(' ')
    }

    if (typeof detail === 'string') {
      return detail
    }

    if (detail?.message) {
      return detail.message
    }

    return 'Something went wrong. Please try again.'
  }

  const loadLoans = async () => {
    setTableLoading(true)
    try {
      const response = await api.get('/loans')
      setLoans(response.data || [])
    } catch (error) {
      setMessage({ type: 'error', text: getErrorMessage(error) })
    } finally {
      setTableLoading(false)
    }
  }

  useEffect(() => {
    loadLoans()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    if (message.text) {
      setMessage({ type: '', text: '' })
    }
  }

  const handleAnalysisChange = (event) => {
    const { name, value } = event.target
    setAnalysisForm((current) => ({ ...current, [name]: value }))
    if (analysisMessage.text) {
      setAnalysisMessage({ type: '', text: '' })
    }
  }

  const handlePredictionChange = (event) => {
    const { name, value } = event.target
    setPredictionForm((current) => ({ ...current, [name]: value }))
    if (predictionMessage.text) {
      setPredictionMessage({ type: '', text: '' })
    }
  }

  const handleAiChange = (event) => {
    const { name, value } = event.target
    setAiForm((current) => ({ ...current, [name]: value }))
    if (aiMessage.text) {
      setAiMessage({ type: '', text: '' })
    }
  }

  const resetForm = () => {
    setForm(initialForm)
    setEditingLoanId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const payload = {
        user_id: getCurrentUserId(),
        lender_name: form.lender_name.trim(),
        loan_amount: normalizeNumericValue(form.loan_amount),
        outstanding_balance: normalizeNumericValue(form.outstanding_balance),
        interest_rate: normalizeNumericValue(form.interest_rate),
        monthly_emi: normalizeNumericValue(form.emi),
        loan_type: form.loan_type.trim(),
        tenure: 12,
        status: 'Active',
      }

      if (editingLoanId) {
        await api.put(`/loan/${editingLoanId}`, {
          lender_name: payload.lender_name,
          loan_amount: payload.loan_amount,
          outstanding_balance: payload.outstanding_balance,
          interest_rate: payload.interest_rate,
          monthly_emi: payload.monthly_emi,
          loan_type: payload.loan_type,
          tenure: payload.tenure,
          status: payload.status,
        })
        setMessage({ type: 'success', text: 'Loan updated successfully.' })
      } else {
        await api.post('/loan', payload)
        setMessage({ type: 'success', text: 'Loan created successfully.' })
      }

      resetForm()
      await loadLoans()
    } catch (error) {
      setMessage({ type: 'error', text: getErrorMessage(error) })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (loan) => {
    setEditingLoanId(loan.id)
    setForm({
      lender_name: loan.lender_name || '',
      loan_amount: loan.loan_amount ?? '',
      outstanding_balance: loan.outstanding_balance ?? '',
      interest_rate: loan.interest_rate ?? '',
      emi: loan.monthly_emi ?? '',
      loan_type: loan.loan_type || '',
    })
    setMessage({ type: '', text: '' })
  }

  const handleDelete = async (loanId) => {
    if (!window.confirm('Delete this loan record?')) {
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      await api.delete(`/loan/${loanId}`)
      setMessage({ type: 'success', text: 'Loan deleted successfully.' })
      await loadLoans()
    } catch (error) {
      setMessage({ type: 'error', text: getErrorMessage(error) })
    } finally {
      setLoading(false)
    }
  }

  const handleAnalysisSubmit = async (event) => {
    event.preventDefault()
    setAnalysisLoading(true)
    setAnalysisMessage({ type: '', text: '' })
    setAnalysis(null)

    try {
      const payload = {
        monthly_income: normalizeNumericValue(analysisForm.monthly_income),
        monthly_expenses: normalizeNumericValue(analysisForm.monthly_expenses),
        monthly_emi: normalizeNumericValue(analysisForm.monthly_emi),
        outstanding_balance: normalizeNumericValue(analysisForm.outstanding_balance),
      }

      const response = await api.post('/financial-analysis', payload)
      setAnalysis(response.data)
      setAnalysisMessage({ type: 'success', text: 'Financial analysis completed.' })
    } catch (error) {
      setAnalysisMessage({ type: 'error', text: getErrorMessage(error) })
    } finally {
      setAnalysisLoading(false)
    }
  }

  const handlePredictionSubmit = async (event) => {
    event.preventDefault()
    setPredictionLoading(true)
    setPredictionMessage({ type: '', text: '' })
    setPrediction(null)

    try {
      const payload = {
        financial_health_score: normalizeNumericValue(predictionForm.financial_health_score),
        outstanding_balance: normalizeNumericValue(predictionForm.outstanding_balance),
      }

      const response = await api.post('/settlement-prediction', payload)
      setPrediction(response.data)
      setPredictionMessage({ type: 'success', text: 'Settlement prediction completed.' })
    } catch (error) {
      setPredictionMessage({ type: 'error', text: getErrorMessage(error) })
    } finally {
      setPredictionLoading(false)
    }
  }

  const handleAiSubmit = async (event) => {
    event.preventDefault()
    setAiLoading(true)
    setAiMessage({ type: '', text: '' })
    setAiResponse(null)

    try {
      const payload = {
        user_name: aiForm.user_name.trim(),
        lender_name: aiForm.lender_name.trim(),
        loan_amount: normalizeNumericValue(aiForm.loan_amount),
        outstanding_balance: normalizeNumericValue(aiForm.outstanding_balance),
        monthly_income: normalizeNumericValue(aiForm.monthly_income),
        monthly_expenses: normalizeNumericValue(aiForm.monthly_expenses),
        financial_health_score: normalizeNumericValue(aiForm.financial_health_score),
        settlement_percentage: normalizeNumericValue(aiForm.settlement_percentage),
        estimated_settlement_amount: normalizeNumericValue(aiForm.estimated_settlement_amount),
      }

      const response = await api.post('/ai-negotiation', payload)
      setAiResponse(response.data)
      setAiMessage({ type: 'success', text: 'AI negotiation guidance generated.' })
    } catch (error) {
      setAiMessage({ type: 'error', text: getErrorMessage(error) })
    } finally {
      setAiLoading(false)
    }
  }

  const handleCopyLetter = async () => {
    if (!aiResponse?.letter) {
      return
    }

    try {
      await navigator.clipboard.writeText(aiResponse.letter)
      setAiMessage({ type: 'success', text: 'Letter copied to clipboard.' })
    } catch {
      setAiMessage({ type: 'error', text: 'Unable to copy the letter.' })
    }
  }

  const handleDownloadLetter = () => {
    if (!aiResponse?.letter) {
      return
    }

    const blob = new Blob([aiResponse.letter], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'negotiation-letter.txt'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <section className="dashboard-stack">
      <div className="dashboard-grid">
        <article className="panel hero-panel">
          <p className="eyebrow">Your financial snapshot</p>
          <h2>Stay ahead of debt pressure</h2>
          <p>Use the insights from FinRelief AI to review loans, analyze finances, and prepare negotiation strategies.</p>
        </article>

        <article className="panel stat-panel">
          <h3>Financial Health</h3>
          <div className="stat-value">82/100</div>
          <p>Healthy outlook with room for improvement.</p>
        </article>

        <article className="panel stat-panel">
          <h3>Settlement Range</h3>
          <div className="stat-value">45%–60%</div>
          <p>Suggested negotiation target based on current profile.</p>
        </article>
      </div>

      <section className="loan-section">
        <div className="loan-card loan-card-form">
          <div className="loan-card-header">
            <div>
              <p className="eyebrow">Loan management</p>
              <h3>{editingLoanId ? 'Update loan' : 'Create a new loan'}</h3>
            </div>
            {editingLoanId ? (
              <button type="button" className="ghost-button" onClick={resetForm}>
                Cancel
              </button>
            ) : null}
          </div>

          <form className="loan-form" onSubmit={handleSubmit}>
            <div className="loan-form-grid">
              <label>
                Lender name
                <input
                  type="text"
                  name="lender_name"
                  value={form.lender_name}
                  onChange={handleChange}
                  placeholder="Bank or lender"
                  required
                />
              </label>
              <label>
                Loan type
                <input
                  type="text"
                  name="loan_type"
                  value={form.loan_type}
                  onChange={handleChange}
                  placeholder="Personal, Mortgage..."
                  required
                />
              </label>
              <label>
                Loan amount
                <input
                  type="number"
                  name="loan_amount"
                  value={form.loan_amount}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </label>
              <label>
                Outstanding balance
                <input
                  type="number"
                  name="outstanding_balance"
                  value={form.outstanding_balance}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </label>
              <label>
                Interest rate (%)
                <input
                  type="number"
                  name="interest_rate"
                  value={form.interest_rate}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </label>
              <label>
                EMI
                <input
                  type="number"
                  name="emi"
                  value={form.emi}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </label>
            </div>

            {message.text ? (
              <p className={`form-message ${message.type}`}>{message.text}</p>
            ) : null}

            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? <span className="spinner" aria-hidden="true" /> : editingLoanId ? 'Update Loan' : 'Create Loan'}
            </button>
          </form>
        </div>

        <div className="loan-card loan-card-table">
          <div className="loan-card-header">
            <div>
              <p className="eyebrow">Current loans</p>
              <h3>Active portfolio</h3>
            </div>
          </div>

          {tableLoading ? (
            <div className="table-loading">Loading loans...</div>
          ) : loans.length === 0 ? (
            <div className="empty-state">No loans found yet. Create one to get started.</div>
          ) : (
            <div className="loan-table-wrapper">
              <table className="loan-table">
                <thead>
                  <tr>
                    <th>Lender</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Balance</th>
                    <th>Rate</th>
                    <th>EMI</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan) => (
                    <tr key={loan.id}>
                      <td>{loan.lender_name}</td>
                      <td>{loan.loan_type}</td>
                      <td>{formatCurrency(loan.loan_amount)}</td>
                      <td>{formatCurrency(loan.outstanding_balance)}</td>
                      <td>{Number(loan.interest_rate || 0)}%</td>
                      <td>{formatCurrency(loan.monthly_emi)}</td>
                      <td>{loan.status || 'Active'}</td>
                      <td>
                        <div className="action-buttons">
                          <button type="button" className="ghost-button small" onClick={() => handleEdit(loan)}>
                            Edit
                          </button>
                          <button type="button" className="ghost-button small danger" onClick={() => handleDelete(loan.id)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className="analysis-section-stack">
        <div className="loan-card">
          <div className="loan-card-header">
            <div>
              <p className="eyebrow">Financial analysis</p>
              <h3>Assess your monthly cash flow</h3>
            </div>
          </div>

          <form className="loan-form" onSubmit={handleAnalysisSubmit}>
            <div className="loan-form-grid">
              <label>
                Monthly income
                <input
                  type="number"
                  name="monthly_income"
                  value={analysisForm.monthly_income}
                  onChange={handleAnalysisChange}
                  placeholder="0"
                  min="1"
                  step="0.01"
                  required
                />
              </label>
              <label>
                Monthly expenses
                <input
                  type="number"
                  name="monthly_expenses"
                  value={analysisForm.monthly_expenses}
                  onChange={handleAnalysisChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </label>
              <label>
                Monthly EMI
                <input
                  type="number"
                  name="monthly_emi"
                  value={analysisForm.monthly_emi}
                  onChange={handleAnalysisChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </label>
              <label>
                Outstanding balance
                <input
                  type="number"
                  name="outstanding_balance"
                  value={analysisForm.outstanding_balance}
                  onChange={handleAnalysisChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </label>
            </div>

            {analysisMessage.text ? (
              <p className={`form-message ${analysisMessage.type}`}>{analysisMessage.text}</p>
            ) : null}

            <button type="submit" className="primary-button" disabled={analysisLoading}>
              {analysisLoading ? <span className="spinner" aria-hidden="true" /> : 'Analyze Finances'}
            </button>
          </form>

          {analysis ? (
            <div className="result-stack">
              <article className="metric-card">
                <p className="eyebrow">Debt-to-income ratio</p>
                <h4>{Number(analysis.dti).toFixed(2)}%</h4>
              </article>
              <article className="metric-card">
                <p className="eyebrow">Monthly savings</p>
                <h4>{formatCurrency(analysis.monthly_savings)}</h4>
              </article>
              <article className="metric-card">
                <p className="eyebrow">Financial health score</p>
                <h4>{analysis.financial_health_score}/100</h4>
              </article>
              <article className="metric-card">
                <p className="eyebrow">Risk level</p>
                <h4>{analysis.risk_level}</h4>
              </article>
            </div>
          ) : null}
        </div>

        <div className="loan-card">
          <div className="loan-card-header">
            <div>
              <p className="eyebrow">Settlement prediction</p>
              <h3>Estimate your negotiation outlook</h3>
            </div>
          </div>

          <form className="loan-form" onSubmit={handlePredictionSubmit}>
            <div className="loan-form-grid">
              <label>
                Financial health score
                <input
                  type="number"
                  name="financial_health_score"
                  value={predictionForm.financial_health_score}
                  onChange={handlePredictionChange}
                  placeholder="0"
                  min="0"
                  max="100"
                  step="1"
                  required
                />
              </label>
              <label>
                Outstanding balance
                <input
                  type="number"
                  name="outstanding_balance"
                  value={predictionForm.outstanding_balance}
                  onChange={handlePredictionChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </label>
            </div>

            {predictionMessage.text ? (
              <p className={`form-message ${predictionMessage.type}`}>{predictionMessage.text}</p>
            ) : null}

            <button type="submit" className="primary-button" disabled={predictionLoading}>
              {predictionLoading ? <span className="spinner" aria-hidden="true" /> : 'Predict Settlement'}
            </button>
          </form>

          {prediction ? (
            <div className="result-stack">
              <article className="metric-card">
                <p className="eyebrow">Settlement percentage</p>
                <h4>{prediction.settlement_percentage}%</h4>
              </article>
              <article className="metric-card">
                <p className="eyebrow">Estimated settlement amount</p>
                <h4>{formatCurrency(prediction.estimated_settlement_amount)}</h4>
              </article>
              <article className="metric-card">
                <p className="eyebrow">Confidence level</p>
                <h4>{prediction.confidence_level}</h4>
              </article>
              <article className="metric-card">
                <p className="eyebrow">Recommendation</p>
                <h4>{prediction.recommendation}</h4>
              </article>
            </div>
          ) : null}
        </div>

        <div className="loan-card ai-negotiation-card">
          <div className="loan-card-header ai-card-header">
            <div>
              <p className="eyebrow">AI negotiation</p>
              <h3>Generate a professional settlement letter</h3>
            </div>
          </div>

          <form className="loan-form ai-form" onSubmit={handleAiSubmit}>
            <div className="loan-form-grid ai-form-grid">
              <label>
                User name
                <input
                  type="text"
                  name="user_name"
                  value={aiForm.user_name}
                  onChange={handleAiChange}
                  placeholder="Jane Doe"
                  required
                />
              </label>
              <label>
                Lender name
                <input
                  type="text"
                  name="lender_name"
                  value={aiForm.lender_name}
                  onChange={handleAiChange}
                  placeholder="Lender name"
                  required
                />
              </label>
              <label>
                Loan amount
                <input
                  type="number"
                  name="loan_amount"
                  value={aiForm.loan_amount}
                  onChange={handleAiChange}
                  placeholder="0"
                  min="1"
                  step="0.01"
                  required
                />
              </label>
              <label>
                Outstanding balance
                <input
                  type="number"
                  name="outstanding_balance"
                  value={aiForm.outstanding_balance}
                  onChange={handleAiChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </label>
              <label>
                Monthly income
                <input
                  type="number"
                  name="monthly_income"
                  value={aiForm.monthly_income}
                  onChange={handleAiChange}
                  placeholder="0"
                  min="1"
                  step="0.01"
                  required
                />
              </label>
              <label>
                Monthly expenses
                <input
                  type="number"
                  name="monthly_expenses"
                  value={aiForm.monthly_expenses}
                  onChange={handleAiChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </label>
              <label>
                Financial health score
                <input
                  type="number"
                  name="financial_health_score"
                  value={aiForm.financial_health_score}
                  onChange={handleAiChange}
                  placeholder="0"
                  min="0"
                  max="100"
                  step="1"
                  required
                />
              </label>
              <label>
                Settlement percentage
                <input
                  type="number"
                  name="settlement_percentage"
                  value={aiForm.settlement_percentage}
                  onChange={handleAiChange}
                  placeholder="0"
                  min="0"
                  max="100"
                  step="1"
                  required
                />
              </label>
              <label>
                Estimated settlement amount
                <input
                  type="number"
                  name="estimated_settlement_amount"
                  value={aiForm.estimated_settlement_amount}
                  onChange={handleAiChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </label>
            </div>

            {aiMessage.text ? (
              <p className={`form-message ${aiMessage.type}`}>{aiMessage.text}</p>
            ) : null}

            <button type="submit" className="primary-button" disabled={aiLoading}>
              {aiLoading ? <span className="spinner" aria-hidden="true" /> : 'Generate Negotiation'}
            </button>
          </form>

          {aiResponse ? (
            <div className="result-stack">
              <article className="metric-card ai-result-card">
                <p className="eyebrow">Negotiation strategy</p>
                <h4>{aiResponse.strategy}</h4>
              </article>
              <article className="metric-card ai-result-card">
                <p className="eyebrow">Settlement recommendation</p>
                <h4>{aiResponse.recommendation}</h4>
              </article>
              <article className="metric-card ai-letter-card">
                <div className="loan-card-header ai-card-header ai-letter-header">
                  <p className="eyebrow">Professional negotiation letter</p>
                  <div className="action-buttons">
                    <button type="button" className="ghost-button small" onClick={handleCopyLetter}>
                      Copy Letter
                    </button>
                    <button type="button" className="ghost-button small" onClick={handleDownloadLetter}>
                      Download TXT
                    </button>
                  </div>
                </div>
                <div className="letter-preview-wrapper">
                  <pre className="letter-preview">{aiResponse.letter}</pre>
                </div>
              </article>
            </div>
          ) : null}
        </div>
      </section>
    </section>
  )
}

export default Dashboard
