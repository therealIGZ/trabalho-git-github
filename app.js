// Cadastro e exclusão de tarefas, com persistência local.
const CHAVE_STORAGE = 'taskflow-tarefas';
const formulario = document.querySelector('#form-tarefa');
const campo = document.querySelector('#nova-tarefa');
const lista = document.querySelector('#lista-tarefas');
const contador = document.querySelector('#contador');
const estadoVazio = document.querySelector('#estado-vazio');

function carregarTarefas() {
  try {
    const salvas = JSON.parse(localStorage.getItem(CHAVE_STORAGE) || '[]');
    return Array.isArray(salvas) ? salvas : [];
  } catch {
    return [];
  }
}

let tarefas = carregarTarefas();

function salvarTarefas() {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(tarefas));
}

function renderizarTarefas() {
  lista.innerHTML = '';
  contador.textContent = `${tarefas.length} ${tarefas.length === 1 ? 'tarefa' : 'tarefas'}`;
  estadoVazio.hidden = tarefas.length > 0;

  for (const tarefa of tarefas) {
    const item = document.createElement('li');
    item.className = 'task';

    const nome = document.createElement('span');
    nome.className = 'task-name';
    nome.textContent = tarefa.texto;

    const botaoExcluir = document.createElement('button');
    botaoExcluir.type = 'button';
    botaoExcluir.className = 'delete-button';
    botaoExcluir.textContent = 'Excluir';
    botaoExcluir.addEventListener('click', () => {
      tarefas = tarefas.filter((atual) => atual.id !== tarefa.id);
      salvarTarefas();
      renderizarTarefas();
    });

    item.append(nome, botaoExcluir);
    lista.appendChild(item);
  }
}

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();
  const texto = campo.value.trim();
  if (!texto) return;

  tarefas.push({ id: `tarefa-${Date.now()}-${Math.random().toString(36).slice(2)}`, texto });
  salvarTarefas();
  campo.value = '';
  campo.focus();
  renderizarTarefas();
});

renderizarTarefas();
