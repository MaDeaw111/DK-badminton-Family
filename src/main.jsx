import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 30, color: '#fff', background: '#0f172a', minHeight: '100vh', fontFamily: 'sans-serif' }}>
          <h2 style={{ fontSize: 20, color: '#38bdf8' }}>เกิดข้อผิดพลาดในการโหลดหน้าเว็บ</h2>
          <p style={{ color: '#94a3b8', fontSize: 14 }}>รายละเอียดข้อผิดพลาด:</p>
          <pre style={{ background: '#1e293b', padding: 15, borderRadius: 8, color: '#f87171', overflowX: 'auto' }}>
            {this.state.error && this.state.error.toString()}
          </pre>
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }} 
            style={{ padding: '10px 20px', background: '#10b981', color: '#0f172a', border: 'none', borderRadius: 8, cursor: 'pointer', marginTop: 15, fontWeight: 'bold' }}
          >
            🔄 รีเซ็ตแคชและรีโหลดหน้าเว็บใหม่
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
