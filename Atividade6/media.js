
function calcularMedia() {
    const nome = document.getElementById("nome").value;
    const m1 = parseFloat(document.getElementById("m1").value);
    const m2 = parseFloat(document.getElementById("m2").value);
    const m3 = parseFloat(document.getElementById("m3").value);
    const m4 = parseFloat(document.getElementById("m4").value);

    const mediaFinal = (m1 + m2 + m3 + m4) / 4;

    document.getElementById("resultadoAluno").innerText =
        `Aluno: ${nome} | Média Final: ${mediaFinal.toFixed(2)}`;
}

function operarNumeros() {
    const n1 = parseFloat(document.getElementById("n1").value);
    const n2 = parseFloat(document.getElementById("n2").value);

    const soma = n1 + n2;
    const sub = n1 - n2;
    const mult = n1 * n2;
    const div = n2 !== 0 ? (n1 / n2).toFixed(2) : "Divisão inválida";
    const mod = n2 !== 0 ? n1 % n2 : "Módulo inválido";


    document.getElementById("resultadoNumeros").innerText =
        `Soma: ${soma} | Subtração: ${sub} | Produto: ${mult} | Divisão: ${div} | Módulo: ${mod}`;
}