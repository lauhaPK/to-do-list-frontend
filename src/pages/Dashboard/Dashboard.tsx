import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import "./Dashboard.css";

Modal.setAppElement("#root");

const categoriasFixas = ["Trabalho", "Pessoal", "Outros"];

interface Tarefa {
  id: number;
  texto: string;
  categoria: string;
  concluida: boolean;
}

// Interface para o tipo de mensagem
interface Mensagem {
  id: number;
  texto: string;
  tipo: 'sucesso' | 'info' | 'aviso' | 'erro';
}

// Novo componente para a mensagem discreta
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

  const isExclusaoCategoria = mensagem.texto.toLowerCase().includes('categorias excluídas');

  if (isExclusaoCategoria) {
    // Posição personalizada para exclusão de categoria (mais para a direita)
    style.top = '15px';
    style.right = '15px'; // Mais próximo da borda direita
  } else {
    // Posição padrão para outras mensagens
    style.top = '15px';
    style.right = '15px';
  }
  

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


export default function Dashboard() {
  const navigate = useNavigate();
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [textoTarefa, setTextoTarefa] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(
    categoriasFixas[0]
  );

  const [categoriasPersonalizadas, setCategoriasPersonalizadas] = useState<
    string[]
  >([]);
  const [mostrarInputCategoria, setMostrarInputCategoria] = useState(false);
  const [novaCategoria, setNovaCategoria] = useState("");

  const [mostrarGerenciarCategorias, setMostrarGerenciarCategorias] =
    useState(false);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<
    string[]
  >([]);

  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);

  const [tarefasConcluidasSelecionadas, setTarefasConcluidasSelecionadas] = useState<number[]>([]);

  const [mensagemAtual, setMensagemAtual] = useState<Mensagem | null>(null);

  const exibirMensagem = (texto: string, tipo: 'sucesso' | 'info' | 'aviso' | 'erro') => {
    const novaMensagem: Mensagem = { id: Date.now(), texto, tipo };
    setMensagemAtual(novaMensagem);
  };

  const descartarMensagem = () => {
    setMensagemAtual(null);
  };

  const handleLogout = () => {
    // Aqui você pode adicionar lógica de limpeza de sessão se necessário
    navigate('/login');
  };

  const adicionarTarefa = () => {
    if (!textoTarefa.trim()) return;

    const isDuplicate = tarefas.some(
      (tarefa) =>
        tarefa.texto.trim().toLowerCase() === textoTarefa.trim().toLowerCase()
    );

    if (isDuplicate) {
      exibirMensagem("Esta tarefa já existe!", "aviso");
      return;
    }

    const novaTarefa: Tarefa = {
      id: Date.now(),
      texto: textoTarefa.trim(),
      categoria: categoriaSelecionada,
      concluida: false,
    };
    setTarefas([...tarefas, novaTarefa]);
    setTextoTarefa("");
    exibirMensagem("Tarefa adicionada com sucesso!", "sucesso");
  };

  const adicionarCategoria = () => {
    if (!novaCategoria.trim()) return;

    const categoriaNormalizada = novaCategoria.trim().toLowerCase();
    const categoriaExistente =
      categoriasFixas.map(cat => cat.toLowerCase()).includes(categoriaNormalizada) ||
      categoriasPersonalizadas.map(cat => cat.toLowerCase()).includes(categoriaNormalizada);


    if (categoriaExistente) {
      exibirMensagem("Esta categoria já existe!", "aviso");
      return;
    }

    setCategoriasPersonalizadas([...categoriasPersonalizadas, novaCategoria.trim()]);
    setNovaCategoria("");
    exibirMensagem("Categoria adicionada com sucesso!", "sucesso");
  };

  const excluirCategoriasSelecionadas = () => {
    const novasCategorias = categoriasPersonalizadas.filter(
      (cat) => !categoriasSelecionadas.includes(cat)
    );
    setCategoriasPersonalizadas(novasCategorias);

    const novasTarefas = tarefas.filter(
      (tarefa) => !categoriasSelecionadas.includes(tarefa.categoria)
    );
    setTarefas(novasTarefas);

    // Verificar se a categoria atualmente selecionada está sendo excluída
    if (categoriasSelecionadas.includes(categoriaSelecionada)) {
      // Se sim, redefinir para a primeira categoria fixa disponível
      setCategoriaSelecionada(categoriasFixas[0]);
    }

    setCategoriasSelecionadas([]);
    exibirMensagem("Categorias excluídas com sucesso!", "info");
  };

  const alternarSelecaoCategoria = (cat: string) => {
    if (categoriasSelecionadas.includes(cat)) {
      setCategoriasSelecionadas(categoriasSelecionadas.filter((c) => c !== cat));
    } else {
      setCategoriasSelecionadas([...categoriasSelecionadas, cat]);
    }
  };

  // Lógica para o botão "Selecionar todas" / "Deselecionar todas" das categorias
  const todasCategoriasEstaoSelecionadas =
    categoriasPersonalizadas.length > 0 &&
    categoriasSelecionadas.length === categoriasPersonalizadas.length;

  const toggleSelecionarDeselecionarTodasCategorias = () => {
    if (todasCategoriasEstaoSelecionadas) {
      setCategoriasSelecionadas([]); // Desseleciona todas
    } else {
      setCategoriasSelecionadas([...categoriasPersonalizadas]); // Seleciona todas
    }
  };

  const toggleConcluida = (id: number) => {
    setTarefas(
      tarefas.map((t) =>
        t.id === id ? { ...t, concluida: !t.concluida } : t
      )
    );
    setTarefasConcluidasSelecionadas([]);
  };

  const excluirTarefa = (id: number) => {
    setTarefas(tarefas.filter((t) => t.id !== id));
    exibirMensagem("Tarefa excluída.", "info");
  };

  const alternarSelecaoTarefaConcluida = (id: number) => {
    if (tarefasConcluidasSelecionadas.includes(id)) {
      setTarefasConcluidasSelecionadas(tarefasConcluidasSelecionadas.filter((tId) => tId !== id));
    } else {
      setTarefasConcluidasSelecionadas([...tarefasConcluidasSelecionadas, id]);
    }
  };

  const tarefasFiltradas = tarefas.filter((t) =>
    filtroCategoria === "Todas" ? true : t.categoria === filtroCategoria
  );

  const tarefasConcluidasFiltradas = tarefasFiltradas.filter((t) => t.concluida);

  const todasConcluidasEstaoSelecionadas =
    tarefasConcluidasFiltradas.length > 0 &&
    tarefasConcluidasSelecionadas.length === tarefasConcluidasFiltradas.length;

  const toggleSelecionarDeselecionarTodas = () => {
    if (todasConcluidasEstaoSelecionadas) {
      setTarefasConcluidasSelecionadas([]);
    } else {
      const todosIds = tarefasConcluidasFiltradas.map((t) => t.id);
      setTarefasConcluidasSelecionadas(todosIds);
    }
  };

  const excluirTarefasConcluidasSelecionadas = () => {
    setTarefas(tarefas.filter((t) => !tarefasConcluidasSelecionadas.includes(t.id)));
    setTarefasConcluidasSelecionadas([]);
    exibirMensagem("Tarefas concluídas excluídas!", "info");
  };


  return (
    <div className="dashboard-container">
      <MensagemDiscreta mensagem={mensagemAtual} onDismiss={descartarMensagem} />

      <header className="dashboard-header">
        <h1>Lista de Tarefas</h1>
        <button className="botao-sair" onClick={handleLogout}>
          Sair
        </button>
      </header>
      <section className="add-task-section">
        <input
          type="text"
          placeholder="Digite sua tarefa..."
          value={textoTarefa}
          onChange={(e) => setTextoTarefa(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              adicionarTarefa();
            }
          }}
        />
        <select
          value={categoriaSelecionada}
          onChange={(e) => setCategoriaSelecionada(e.target.value)}
        >
          {[...categoriasFixas, ...categoriasPersonalizadas].map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button onClick={adicionarTarefa}>Adicionar</button>
      </section>
      <section className="category-buttons-section">
        <button
          className="AddCatergorybttn"
          onClick={() => setMostrarInputCategoria(true)}
        >
          Adicionar Categoria
        </button>
        <button
          className="ManagerCategoryBttn"
          onClick={() => setMostrarGerenciarCategorias(!mostrarGerenciarCategorias)}
        >
          {mostrarGerenciarCategorias ? "Ocultar Categorias " : "Gerenciar Categorias"}
        </button>
      </section>
      {mostrarInputCategoria && (
        <section className="new-category-input-section">
          <input
            type="text"
            placeholder="Nova categoria..."
            value={novaCategoria}
            onChange={(e) => setNovaCategoria(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                adicionarCategoria();
              }
            }}
          />
          <button onClick={adicionarCategoria}>Salvar</button>
          <button onClick={() => setMostrarInputCategoria(false)}>
            Cancelar
          </button>
        </section>
      )}
      {mostrarGerenciarCategorias && (
        <section className="manage-categories-section">
          {categoriasPersonalizadas.length === 0 && (
            <p>Nenhuma categoria personalizada.</p>
          )}
          {categoriasPersonalizadas.map((cat, i) => (
            <div key={`perso-${i}`}>
              <label>
                <input
                  type="checkbox"
                  checked={categoriasSelecionadas.includes(cat)}
                  onChange={() => alternarSelecaoCategoria(cat)}
                />{" "}
                {cat}
              </label>
            </div>
          ))}
          {/* Botões de ação para categorias */}
          <div className="category-management-actions">
            <button
              onClick={toggleSelecionarDeselecionarTodasCategorias}
              disabled={categoriasPersonalizadas.length === 0}
              className="btn-selecionar-todas-categorias"
            >
              {todasCategoriasEstaoSelecionadas ? "Deselecionar todas" : "Selecionar todas"}
            </button>
            <button
              onClick={() => setModalExcluirAberto(true)}
              disabled={categoriasSelecionadas.length === 0}
              className="btn-excluir-selecionadas"
            >
              Excluir selecionadas ({categoriasSelecionadas.length})
            </button>
          </div>
        </section>
      )}
      <Modal
        isOpen={modalExcluirAberto}
        onRequestClose={() => setModalExcluirAberto(false)}
        contentLabel="Confirmar exclusão"
        className="ReactModal__Content"
        overlayClassName="ReactModal__Overlay"
      >
        <h2>Confirmar exclusão</h2>
        <p>Tem certeza que deseja excluir as categorias selecionadas e suas tarefas?</p>
        <div className="modal-buttons">
          <button onClick={() => setModalExcluirAberto(false)}>Cancelar</button>
          <button
            onClick={() => {
              excluirCategoriasSelecionadas();
              setModalExcluirAberto(false);
            }}
          >
            Excluir
          </button>
        </div>
      </Modal>
      <section className="filter-section">
        <label htmlFor="filtro">Filtrar por categoria: </label>
        <select
          id="filtro"
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >
          <option value="Todas">Todas</option>
          {[...categoriasFixas, ...categoriasPersonalizadas].map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </section>
      <section className="tasks-list">
        <h2>Tarefas pendentes</h2>
        {tarefasFiltradas.filter((t) => !t.concluida).length === 0 && (
          <p>Sem tarefas pendentes.</p>
        )}
        <ul>
          {tarefasFiltradas
            .filter((t) => !t.concluida)
            .map((t) => (
              <li key={t.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={t.concluida}
                    onChange={() => toggleConcluida(t.id)}
                  />
                  {t.texto} {filtroCategoria === "Todas" && <strong>&nbsp;({t.categoria})</strong>}
                </label>
                <button
                  className="botao-lixeira"
                  onClick={() => excluirTarefa(t.id)}
                  style={{
                    color: '#666',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '2px 4px'
                  }}
                >
                  ×
                </button>
              </li>
            ))}
        </ul>
      </section>

      <section className="tasks-list completed">
        <h2>Tarefas concluídas</h2>
        {tarefasConcluidasFiltradas.length === 0 && (
          <p>Sem tarefas concluídas.</p>
        )}
        {tarefasConcluidasFiltradas.length > 0 && (
          <div className="completed-tasks-actions">
            <button
              onClick={toggleSelecionarDeselecionarTodas}
              disabled={tarefasConcluidasFiltradas.length === 0}
            >
              {todasConcluidasEstaoSelecionadas ? "Deselecionar todas" : "Selecionar todas"}
            </button>
            <button
              onClick={excluirTarefasConcluidasSelecionadas}
              disabled={tarefasConcluidasSelecionadas.length === 0}
              className="btn-excluir-selecionadas"
            >
              Excluir selecionadas ({tarefasConcluidasSelecionadas.length})
            </button>
          </div>
        )}
        <ul>
          {tarefasConcluidasFiltradas.map((t) => (
            <li key={t.id} style={{ textDecoration: 'none' }}>
              <label style={{ textDecoration: 'none' }}>
                <input
                  type="checkbox"
                  checked={tarefasConcluidasSelecionadas.includes(t.id)}
                  onChange={() => alternarSelecaoTarefaConcluida(t.id)}
                />
                <span style={{ textDecoration: 'none' }}>
                  {t.texto}{" "}
                  {filtroCategoria === "Todas" && <strong>({t.categoria})</strong>}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

