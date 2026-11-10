const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");
const app = express(),
  raiz = __dirname,
  db = new sqlite3.Database(path.join(raiz, "database", "equipe_ap.db"));
db.exec(
  "PRAGMA foreign_keys = ON;" +
    fs.readFileSync(path.join(raiz, "database", "schema.sql"), "utf8"),
);
app.use(express.json());
app.use(express.static(path.join(raiz, "public")));
app.get("/", (_, res) => res.redirect("/dashboard/"));
app.get("/api/health", (_, res) =>
  res.json({ sistema: "equipe-ap", status: "ok" }),
);
app.get("/api/pacientes", (_, res) =>
  db.all("SELECT * FROM pacientes ORDER BY nome", (e, r) =>
    e ? res.status(500).json({ erro: e.message }) : res.json(r),
  ),
);
app.post("/api/pacientes", (req, res) => {
  const p = req.body;
  if (!p.nome || !p.telefone || (!p.cpf && !p.rg))
    return res
      .status(400)
      .json({ erro: "Nome, telefone e CPF ou RG são obrigatórios." });
  const campos = [
    "nome",
    "cpf",
    "rg",
    "nascimento",
    "telefone",
    "email",
    "cep",
    "numero",
    "rua",
    "complemento",
    "bairro",
    "cidade",
    "uf",
  ];
  db.run(
    `INSERT INTO pacientes (${campos.join(",")}) VALUES (${campos.map(() => "?").join(",")})`,
    campos.map((c) => p[c] || null),
    function (e) {
      if (e)
        return res.status(e.message.includes("UNIQUE") ? 409 : 500).json({
          erro: e.message.includes("UNIQUE")
            ? "CPF ou RG já cadastrado."
            : e.message,
        });
      res.status(201).json({ id: this.lastID });
    },
  );
});
app.get("/api/solicitacoes", (_, res) =>
  db.all(
    "SELECT s.*, p.nome paciente_nome FROM solicitacoes s JOIN pacientes p ON p.id=s.paciente_id ORDER BY s.criado_em DESC",
    (e, r) => (e ? res.status(500).json({ erro: e.message }) : res.json(r)),
  ),
);
app.post("/api/solicitacoes", (req, res) => {
  const { paciente_id, titulo, descricao, prioridade = "normal" } = req.body;
  if (!paciente_id || !titulo)
    return res
      .status(400)
      .json({ erro: "Paciente e título são obrigatórios." });
  db.run(
    "INSERT INTO solicitacoes (paciente_id,titulo,descricao,prioridade) VALUES (?,?,?,?)",
    [paciente_id, titulo, descricao || null, prioridade],
    function (e) {
      e
        ? res.status(500).json({ erro: e.message })
        : res.status(201).json({ id: this.lastID });
    },
  );
});
app.patch("/api/solicitacoes/:id", (req, res) => {
  const permitidos = ["analise", "acompanhamento", "finalizado"];
  if (!permitidos.includes(req.body.status))
    return res.status(400).json({ erro: "Status inválido." });
  db.run(
    "UPDATE solicitacoes SET status=? WHERE id=?",
    [req.body.status, req.params.id],
    function (e) {
      e
        ? res.status(500).json({ erro: e.message })
        : res.json({ alterados: this.changes });
    },
  );
});
const porta = process.env.PORT || 3000;
app.listen(porta, () =>
  console.log(`Equipe AP disponível em http://localhost:${porta}`),
);
