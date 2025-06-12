import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './recoverPassword.css'

interface FormData {
  email: string
  newPassword: string
  confirmNewPassword: string
}

interface FormErrors {
  email?: string
  newPassword?: string
  confirmNewPassword?: string
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
    style.backgroundColor = '#f0f0f0'
    style.color = '#444'
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

const RecoverPassword: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    email: '',
    newPassword: '',
    confirmNewPassword: ''
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

    if (!formData.newPassword) {
      newErrors.newPassword = 'Nova senha é obrigatória'
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Nova senha deve ter pelo menos 6 caracteres'
    }

    if (!formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Confirmação da nova senha é obrigatória'
    } else if (formData.newPassword !== formData.confirmNewPassword) {
      newErrors.confirmNewPassword = 'Senhas não coincidem'
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
 
      console.log('Dados do formulário:', formData)
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      exibirMensagem('Senha alterada com sucesso!', 'sucesso')
      

      setFormData({
        email: '',
        newPassword: '',
        confirmNewPassword: ''
      })
      

      setTimeout(() => {
        navigate('/login')
      }, 1500)
      
    } catch (error) {
      console.error('Erro na recuperação de senha:', error)
      exibirMensagem('Erro ao alterar senha. Tente novamente.', 'erro')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="recover-password-container">
      <MensagemDiscreta mensagem={mensagemAtual} onDismiss={descartarMensagem} />
      
      <div className="recover-password-card">
        <h2 className="recover-password-title">Recuperar Senha</h2>
        <p className="recover-password-subtitle">
          Digite seu e-mail e defina uma nova senha
        </p>
        
        <form onSubmit={handleSubmit} className="recover-password-form">
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
            <label htmlFor="newPassword" className="form-label">
              Nova Senha
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className={`form-input ${errors.newPassword ? 'error' : ''}`}
              placeholder="Digite sua nova senha"
              disabled={isSubmitting}
            />
            {errors.newPassword && (
              <span className="error-message">{errors.newPassword}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmNewPassword" className="form-label">
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleInputChange}
              className={`form-input ${errors.confirmNewPassword ? 'error' : ''}`}
              placeholder="Confirme sua nova senha"
              disabled={isSubmitting}
            />
            {errors.confirmNewPassword && (
              <span className="error-message">{errors.confirmNewPassword}</span>
            )}
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            <span>{isSubmitting ? 'Alterando Senha...' : 'Alterar Senha'}</span>
            {isSubmitting && <Loader2 />}
          </button>
        </form>

        <div className="links-container">
          <div className="link-item">
            <span className="link-text">Lembrou da senha?</span>
            <Link to="/login" className="link-action">
              Clique aqui.
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecoverPassword

