const colunas = [...document.querySelectorAll(".coluna")],
  busca = document.querySelector("#search"),
  modal = document.querySelector("#modal_solicitacao"),
  form = document.querySelector("#form_solicitacao"),
  mensagem = document.querySelector("#mensagem");
let solicitacoes = [];
function esc(t = "") {
  const d = document.createElement("div");
  d.textContent = t;
  return d.innerHTML;
}
function renderizar() {
  const termo = busca.value.toLowerCase().trim();
  colunas.forEach((coluna) => {
    const itens = solicitacoes.filter(
      (i) =>
        i.status === coluna.dataset.status &&
        `${i.id} ${i.titulo} ${i.paciente_nome}`.toLowerCase().includes(termo),
    );
    coluna.querySelector(".contador").textContent = itens.length;
    coluna.querySelector(".cartoes").innerHTML = itens
      .map(
        (i) =>
          `<article class="cartao ${i.prioridade === "urgente" ? "urgente" : ""}"><div class="cartao_topo"><span class="chamado">Chamado #${String(i.id).padStart(4, "0")}</span><span class="prioridade">${esc(i.prioridade)}</span></div><h3>${esc(i.titulo)}</h3><p class="paciente">${esc(i.paciente_nome)}</p>${i.descricao ? `<p class="descricao">${esc(i.descricao)}</p>` : ""}${i.status !== "finalizado" ? `<button class="mover" data-id="${i.id}">${i.status === "analise" ? "Iniciar acompanhamento" : "Finalizar"}</button>` : ""}</article>`,
      )
      .join("");
  });
}
async function carregar() {
  try {
    const r = await fetch("/api/solicitacoes");
    if (!r.ok) throw 0;
    solicitacoes = await r.json();
    renderizar();
  } catch {
    mensagem.hidden = false;
    mensagem.textContent =
      "Não foi possível carregar os dados. Inicie o servidor com npm start.";
  }
}
async function abrirModal() {
  const r = await fetch("/api/pacientes"),
    p = await r.json(),
    s = document.querySelector("#f_paciente");
  s.innerHTML = p.length
    ? '<option value="">Selecione...</option>' +
      p.map((x) => `<option value="${x.id}">${esc(x.nome)}</option>`).join("")
    : '<option value="">Cadastre um paciente primeiro</option>';
  modal.showModal();
}
document.querySelector("#btn_nova").onclick = abrirModal;
document.querySelector("#btn_fechar").onclick = () => modal.close();
document.querySelector("#btn_cancelar").onclick = () => modal.close();
busca.oninput = renderizar;
document.querySelector("#kanban").onclick = async (e) => {
  const b = e.target.closest(".mover");
  if (!b) return;
  const i = solicitacoes.find((s) => s.id === Number(b.dataset.id)),
    status = i.status === "analise" ? "acompanhamento" : "finalizado";
  await fetch(`/api/solicitacoes/${i.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  carregar();
};
form.onsubmit = async (e) => {
  e.preventDefault();
  const dados = Object.fromEntries(new FormData(form)),
    r = await fetch("/api/solicitacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });
  if (r.ok) {
    form.reset();
    modal.close();
    carregar();
  }
};
carregar();
