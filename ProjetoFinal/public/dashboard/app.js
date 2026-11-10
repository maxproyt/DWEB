async function carregarResumo() {
  try {
    const [respostaPacientes, respostaSolicitacoes] = await Promise.all([
      fetch("/api/pacientes"),
      fetch("/api/solicitacoes"),
    ]);

    if (!respostaPacientes.ok || !respostaSolicitacoes.ok) {
      throw new Error();
    }

    const pacientes = await respostaPacientes.json();
    const solicitacoes = await respostaSolicitacoes.json();

    document.querySelector("#total_pacientes").textContent = pacientes.length;
    document.querySelector("#total_analise").textContent = solicitacoes.filter(
      (item) => item.status === "analise",
    ).length;
    document.querySelector("#total_acompanhamento").textContent =
      solicitacoes.filter((item) => item.status === "acompanhamento").length;
    document.querySelector("#total_finalizado").textContent =
      solicitacoes.filter((item) => item.status === "finalizado").length;
  } catch {
    document.querySelector("#erro").hidden = false;
  }
}

carregarResumo();
