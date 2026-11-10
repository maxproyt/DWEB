
function gerarCampos() {

    let qtd = Number(document.getElementById("qtd").value);

    let container = document.getElementById("camposRespondentes");

    container.innerHTML = "";

    for (let i = 0; i < qtd; i++) {

        container.innerHTML += `
            <hr>

            <h3>Respondente ${i + 1}</h3>

            <label>Idade:</label>
            <input type="number" class="idade" min="1" required>
            <br><br>

            <label>Sexo:</label>
            <select class="sexo" required>
                <option value="">Selecione</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
            </select>
            <br><br>

            <label>Avaliação do filme:</label>
            <select class="avaliacao" required>
                <option value="">Selecione</option>
                <option value="1">1 - Péssimo</option>
                <option value="2">2 - Ruim</option>
                <option value="3">3 - Regular</option>
                <option value="4">4 - Bom</option>
                <option value="5">5 - Ótimo</option>
            </select>
            <br><br>
        `;
    }
}


function operarNumeros() {

    let idades = document.querySelectorAll(".idade");
    let sexos = document.querySelectorAll(".sexo");
    let avaliacoes = document.querySelectorAll(".avaliacao");

    let qtd = idades.length;

    if (qtd === 0) {
        alert("Gere os campos primeiro!");
        return;
    }

    let somaIdades = 0;
    let somaAvaliacoes = 0;

    let tempIdadeMax = 0;
    let tempIdadeMin = Number.MAX_VALUE;

    let qtdPessimo = 0;
    let qtdBom = 0;
    let qtdOtimo = 0;


    let qtdMasculino = 0;
    let qtdFeminino = 0;
    let qtdOutro = 0;


    for (let i = 0; i < qtd; i++) {

        let idade = Number(idades[i].value);
        let avaliacao = Number(avaliacoes[i].value);
        let sexo = sexos[i].value;

        somaIdades += idade;
        somaAvaliacoes += avaliacao;

        // Idade máxima
        if (idade > tempIdadeMax) {
            tempIdadeMax = idade;
        }

        // Idade mínima
        if (idade < tempIdadeMin) {
            tempIdadeMin = idade;
        }

        // Avaliações
        if (avaliacao === 1) {
            qtdPessimo++;
        }

        if (avaliacao === 4) {
            qtdBom++;
        }

        if (avaliacao === 5) {
            qtdOtimo++;
        }

        // Sexo
        if (sexo === "masculino") {
            qtdMasculino++;
        } 
        else if (sexo === "feminino") {
            qtdFeminino++;
        } 
        else if (sexo === "outro") {
            qtdOutro++;
        }

    }


    let mediaIdade = somaIdades / qtd;
    let mediaAvaliacao = somaAvaliacoes / qtd;
    let porcentagemBom = (qtdBom / qtd) * 100;
    let porcentagemOtimo = (qtdOtimo / qtd) * 100;


    document.getElementById("resultadoNumeros").innerHTML =

        "<h3>Resultados da pesquisa</h3>" +


        "<br>Média de idade: " + mediaIdade.toFixed(2) +
        "<br>Idade máxima: " + tempIdadeMax +
        "<br>Idade mínima: " + tempIdadeMin +

        "<br>Péssimo : " + qtdPessimo +
        "<br>Porcentagem Bom : " + porcentagemBom.toFixed(2) + "%" +
        "<br>Porcentagem Ótimo: " + porcentagemOtimo.toFixed(2) + "%" +

        "<br>Masculino: " + qtdMasculino +
        "<br>Feminino: " + qtdFeminino +
        "<br>Outro: " + qtdOutro;

}
