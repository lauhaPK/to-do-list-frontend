import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
}

interface Mensagem {
  id: number
  texto: string
  tipo: 'sucesso' | 'info' | 'aviso' | 'erro'
}


const MensagemDiscreta: React.FC<{ mensagem: Mensagem | null; onDismiss: () => void }> = ({ mensagem, onDismiss }) => {
  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(() => {
        onDismiss()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [mensagem, onDismiss])

  if (!mensagem) {
    return null
  }

  const style: React.CSSProperties = {
    position: 'fixed',
    top: '15px',
    right: '15px',
    padding: '10px 15px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    zIndex: 9999,
    fontSize: '0.85rem',
    maxWidth: '280px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
  }


  if (mensagem.tipo === 'sucesso') {
    style.backgroundColor = '#959595'
    style.color = '#e0e0e0'
    style.border = '1px solid #e0e0e0'
  } else if (mensagem.tipo === 'info') {
    style.backgroundColor = '#d0d0d0'
    style.color = '#222'
    style.border = '1px solid #b0b0b0'
  } else if (mensagem.tipo === 'aviso') {
    style.backgroundColor = '#e5e5e5'
    style.color = '#333'
    style.border = '1px solid #c5c5c5'
  } else if (mensagem.tipo === 'erro') {
    style.backgroundColor = '#b5b5b5'
    style.color = '#111'
    style.border = '1px solid #959595'
  } else {
    style.backgroundColor = '#f5f5f5'
    style.color = '#333'
    style.border = '1px solid #ddd'
  }

  return (
    <div style={style}>
      <span>{mensagem.texto}</span>
      <button
        onClick={onDismiss}
        style={{
          background: 'none',
          border: 'none',
          color: style.color,
          fontSize: '1rem',
          cursor: 'pointer',
          marginLeft: 'auto',
        }}
      >
        &times;
      </button>
    </div>
  )
}

const Loader2: React.FC = () => {
  return (
    <div className="loader2">
      <div className="loader2-spinner"></div>
    </div>
  )
}

const Login: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mensagemAtual, setMensagemAtual] = useState<Mensagem | null>(null)

  const exibirMensagem = (texto: string, tipo: 'sucesso' | 'info' | 'aviso' | 'erro') => {
    const novaMensagem: Mensagem = { id: Date.now(), texto, tipo }
    setMensagemAtual(novaMensagem)
  }

  const descartarMensagem = () => {
    setMensagemAtual(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.email) {
      newErrors.email = 'E-mail é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido'
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      if (formData.email === 'teste@teste.com' && formData.password === '123456') {
        exibirMensagem('Login feito com sucesso!', 'sucesso')
        
        setTimeout(() => {
          navigate('/dashboard')
        }, 1500)
      } else {
        exibirMensagem('Credenciais inválidas. Use teste@teste.com e senha 12345', 'erro')
      }
      
    } catch (error) {
      console.error('Erro no login:', error)
      exibirMensagem('Erro ao realizar login. Tente novamente.', 'erro')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-container">
      <MensagemDiscreta mensagem={mensagemAtual} onDismiss={descartarMensagem} />
      
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Digite seu e-mail"
              disabled={isSubmitting}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`form-input ${errors.password ? 'error' : ''}`}
              placeholder="Digite sua senha"
              disabled={isSubmitting}
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            <span>{isSubmitting ? 'Entrando...' : 'Entrar'}</span>
            {isSubmitting && <Loader2 />}
          </button>
        </form>

        <div className="links-container">
          <div className="link-item">
            <span className="link-text">Não tem cadastro?</span>
            <Link to="/register" className="link-action">
              Clique aqui.
            </Link>
          </div>
          
          <div className="link-item">
            <span className="link-text">Esqueceu sua senha?</span>
            <Link to="/forgot-password" className="link-action">
              Clique aqui.
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

