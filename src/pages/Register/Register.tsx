import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

// Interface para o tipo de mensagem
interface Mensagem {
  id: number;
  texto: string;
  tipo: 'sucesso' | 'info' | 'aviso' | 'erro';
}

// Componente para a mensagem discreta (copiado do Dashboard)
const MensagemDiscreta: React.FC<{ mensagem: Mensagem | null; onDismiss: () => void }> = ({ mensagem, onDismiss }) => {
  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 3000); // Mensagem desaparece após 3 segundos
      return () => clearTimeout(timer);
    }
  }, [mensagem, onDismiss]);

  if (!mensagem) {
    return null;
  }

  // Estilos inline básicos para a mensagem discreta
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
  };

  // Cores de fundo e texto para diferentes tipos de mensagem
  if (mensagem.tipo === 'sucesso') {
    style.backgroundColor = '#f0f0f0'; // Fundo bem claro
    style.color = '#444';
    style.border = '1px solid #e0e0e0';
  } else if (mensagem.tipo === 'info') {
    style.backgroundColor = '#d0d0d0'; // Fundo um pouco mais escuro
    style.color = '#222';
    style.border = '1px solid #b0b0b0';
  } else if (mensagem.tipo === 'aviso') {
    style.backgroundColor = '#e5e5e5'; // Fundo intermediário
    style.color = '#333';
    style.border = '1px solid #c5c5c5';
  } else if (mensagem.tipo === 'erro') {
    style.backgroundColor = '#b5b5b5';
    style.color = '#111';
    style.border = '1px solid #959595';
  } else {
    style.backgroundColor = '#f5f5f5';
    style.color = '#333';
    style.border = '1px solid #ddd';
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
  );
};

// Componente Loader2
const Loader2: React.FC = () => {
  return (
    <div className="loader2">
      <div className="loader2-spinner"></div>
    </div>
  );
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mensagemAtual, setMensagemAtual] = useState<Mensagem | null>(null);

  const exibirMensagem = (texto: string, tipo: 'sucesso' | 'info' | 'aviso' | 'erro') => {
    const novaMensagem: Mensagem = { id: Date.now(), texto, tipo };
    setMensagemAtual(novaMensagem);
  };

  const descartarMensagem = () => {
    setMensagemAtual(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validação do email
    if (!formData.email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    // Validação da senha
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    // Validação da confirmação de senha
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Aqui você pode adicionar a lógica de cadastro
      console.log('Dados do formulário:', formData);
      
      // Simular uma requisição
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      exibirMensagem('Cadastro realizado com sucesso!', 'sucesso');
      
      // Limpar formulário após sucesso
      setFormData({
        email: '',
        password: '',
        confirmPassword: ''
      });

      // Redirecionar para a página de login após um breve delay
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error('Erro no cadastro:', error);
      exibirMensagem('Erro ao realizar cadastro. Tente novamente.', 'erro');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <MensagemDiscreta mensagem={mensagemAtual} onDismiss={descartarMensagem} />
      
      <div className="register-card">
        <h2 className="register-title">Criar Conta</h2>
        
        <form onSubmit={handleSubmit} className="register-form">
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

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirmar Senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Confirme sua senha"
              disabled={isSubmitting}
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            <span>{isSubmitting ? 'Cadastrando...' : 'Criar Conta'}</span>
            {isSubmitting && <Loader2 />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;

