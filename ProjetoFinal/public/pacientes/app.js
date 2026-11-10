const lista = document.querySelector("#lista_pacientes"),
  vazio = document.querySelector("#estado_vazio"),
  modal = document.querySelector("#modal_cadastro"),
  form = document.querySelector("#form_cadastro"),
  erro = document.querySelector("#erro_cadastro");
function esc(t = "") {
  const d = document.createElement("div");
  d.textContent = t || "";
  return d.innerHTML;
}
function detalhes(p) {
  return [
    p.telefone && `Telefone: ${p.telefone}`,
    p.email && `E-mail: ${p.email}`,
    p.nascimento && `Nascimento: ${p.nascimento}`,
    p.cidade && `Cidade: ${p.cidade}${p.uf ? " / " + p.uf : ""}`,
  ]
    .filter(Boolean)
    .map(esc)
    .join("<br>");
}
async function carregar() {
  try {
    const r = await fetch("/api/pacientes");
    if (!r.ok) throw 0;
    const pacientes = await r.json();
    vazio.hidden = pacientes.length > 0;
    lista.innerHTML = pacientes
      .map(
        (p) =>
          `<li class="paciente"><div class="paciente_linha"><span><strong>${esc(p.nome)}</strong>${p.cpf ? ` <span class="paciente_cpf">CPF: ${esc(p.cpf)}</span>` : ""}${!p.cpf && p.rg ? ` <span class="paciente_cpf">RG: ${esc(p.rg)}</span>` : ""}</span><button class="link detalhes" type="button">Ver detalhes</button></div><div class="paciente_detalhes" hidden>${detalhes(p) || "Sem informações adicionais."}</div></li>`,
      )
      .join("");
  } catch {
    vazio.hidden = false;
    document.querySelector(".vazio_titulo").textContent =
      "Servidor indisponível";
    document.querySelector(".vazio_texto").textContent =
      "Inicie o sistema com npm start.";
  }
}
document.querySelector("#btn_cadastrar").onclick = () => modal.showModal();
document.querySelector("#btn_fechar").onclick = () => modal.close();
document.querySelector("#btn_cancelar").onclick = () => modal.close();
lista.onclick = (e) => {
  const b = e.target.closest(".detalhes");
  if (!b) return;
  const d = b.closest(".paciente").querySelector(".paciente_detalhes");
  d.hidden = !d.hidden;
  b.textContent = d.hidden ? "Ver detalhes" : "Ocultar detalhes";
};
document.querySelector("#f_cpf").oninput = (e) =>
  (e.target.value = e.target.value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2"));
document.querySelector("#f_telefone").oninput = (e) =>
  (e.target.value = e.target.value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2"));
form.onsubmit = async (e) => {
  e.preventDefault();
  erro.hidden = true;
  const dados = Object.fromEntries(new FormData(form));
  if (!dados.cpf && !dados.rg) {
    erro.textContent = "Informe ao menos o CPF ou o RG.";
    erro.hidden = false;
    return;
  }
  try {
    const r = await fetch("/api/pacientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      }),
      res = await r.json();
    if (!r.ok) throw new Error(res.erro);
    form.reset();
    modal.close();
    carregar();
  } catch (e) {
    erro.textContent = e.message || "Não foi possível salvar.";
    erro.hidden = false;
  }
};
carregar();
