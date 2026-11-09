// Cadastro, conclusão e filtragem de tarefas, com persistência local.
const CHAVE_STORAGE = 'taskflow-tarefas';
const formulario = document.querySelector('#form-tarefa');
const campo = document.querySelector('#nova-tarefa');
const lista = document.querySelector('#lista-tarefas');
const contador = document.querySelector('#contador');
const estadoVazio = document.querySelector('#estado-vazio');
const botoesFiltro = document.querySelectorAll('[data-filter]');

function carregarTarefas() {
  try {
    const salvas = JSON.parse(localStorage.getItem(CHAVE_STORAGE) || '[]');
    return Array.isArray(salvas) ? salvas : [];
  } catch {
    return [];
  }
}

let tarefas = carregarTarefas();
let filtroAtivo = 'todas';

function salvarTarefas() {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(tarefas));
}

function tarefasFiltradas() {
  if (filtroAtivo === 'pendentes') return tarefas.filter((tarefa) => !tarefa.concluida);
  if (filtroAtivo === 'concluidas') return tarefas.filter((tarefa) => tarefa.concluida);
  return tarefas;
}

function renderizarTarefas() {
  lista.innerHTML = '';
  contador.textContent = `${tarefas.length} ${tarefas.length === 1 ? 'tarefa' : 'tarefas'}`;
  const visiveis = tarefasFiltradas();
  estadoVazio.hidden = visiveis.length > 0;

  for (const tarefa of visiveis) {
    const item = document.createElement('li');
    item.className = `task${tarefa.concluida ? ' completed' : ''}`;

    const etiqueta = document.createElement('label');
    etiqueta.className = 'task-check';
    const caixa = document.createElement('input');
    caixa.type = 'checkbox';
    caixa.checked = Boolean(tarefa.concluida);
    caixa.setAttribute('aria-label', `Concluir tarefa: ${tarefa.texto}`);
    caixa.addEventListener('change', () => {
      tarefa.concluida = caixa.checked;
      salvarTarefas();
      renderizarTarefas();
    });

    const nome = document.createElement('span');
    nome.className = 'task-name';
    nome.textContent = tarefa.texto;
    etiqueta.append(caixa, nome);

    const botaoExcluir = document.createElement('button');
    botaoExcluir.type = 'button';
    botaoExcluir.className = 'delete-button';
    botaoExcluir.textContent = 'Excluir';
    botaoExcluir.addEventListener('click', () => {
      tarefas = tarefas.filter((atual) => atual.id !== tarefa.id);
      salvarTarefas();
      renderizarTarefas();
    });

    item.append(etiqueta, botaoExcluir);
    lista.appendChild(item);
  }
}

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const texto = campo.value.trim();
  if (!texto) return;

  tarefas.push({ id: `tarefa-${Date.now()}-${Math.random().toString(36).slice(2)}`, texto, concluida: false });
  salvarTarefas();
  campo.value = '';
  campo.focus();
  renderizarTarefas();
});

botoesFiltro.forEach((botao) => {
  botao.addEventListener('click', () => {
    filtroAtivo = botao.dataset.filter;
    botoesFiltro.forEach((atual) => atual.classList.toggle('active', atual === botao));
    renderizarTarefas();
  });
});

renderizarTarefas();
