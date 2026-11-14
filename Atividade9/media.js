
function maxNumeros(numero1, numero2, numero3) {
    if (numero1 >= numero2 && numero1 >= numero3) {
        return numero1;
    } else if (numero2 >= numero1 && numero2 >= numero3) {
        return numero2;
    } else {
        return numero3;
    }
}

function ordNumeros(numero1, numero2, numero3) {
    let numeros = [numero1, numero2, numero3];

    numeros.sort(function(a, b) {
        return a - b;
    });

    return numeros.join(", ");
}

function verificarPalindromo(palavra) {
    let texto = palavra.toLowerCase().trim();
    let invertido = texto.split("").reverse().join("");

    if (texto === invertido) {
        return "É um palíndromo";
    } else {
        return "Não é um palíndromo";
    }
}

function verificarStrings(string1, string2) {
    if (string1 == null || string2 == null) {
        return "Erro: uma das strings é null ou undefined";
    }

    return "As duas strings são válidas";
}

function verificarSubconjunto(palavra1, palavra2) {
    if (palavra1.includes(palavra2)) {
        return "É um subconjunto";
    } else {
        return "Não é um subconjunto";
    }
}

function selecionarFuncao(opcao) {
    let campos = document.getElementById("campos");
    let html = "";

    if (opcao === 1) {
        html = `
            <h3>Maior número</h3>
            <input type="number" id="n1" placeholder="Número 1">
            <input type="number" id="n2" placeholder="Número 2">
            <input type="number" id="n3" placeholder="Número 3">
        `;
    } else if (opcao === 2) {
        html = `
            <h3>Ordenar números</h3>
            <input type="number" id="n1" placeholder="Número 1">
            <input type="number" id="n2" placeholder="Número 2">
            <input type="number" id="n3" placeholder="Número 3">
        `;
    } else if (opcao === 3) {
        html = `
            <h3>Verificar palíndromo</h3>
            <input type="text" id="palavra" placeholder="Digite uma palavra">
        `;
    } else if (opcao === 4) {
        html = `
            <h3>Verificar strings</h3>
            <input type="text" id="s1" placeholder="String 1">
            <input type="text" id="s2" placeholder="String 2">
        `;
    } else if (opcao === 5) {
        html = `
            <h3>Verificar subconjunto</h3>
            <input type="text" id="s1" placeholder="Primeira palavra">
            <input type="text" id="s2" placeholder="Segunda palavra">
        `;
    }

    campos.innerHTML = html +
        `<br><br><button onclick="executar(${opcao})">Executar</button>`;

    document.getElementById("resultado").textContent = "";
}

function executar(opcao) {
    let resultado = "";

    if (opcao === 1 || opcao === 2) {
        let campo1 = document.getElementById("n1").value;
        let campo2 = document.getElementById("n2").value;
        let campo3 = document.getElementById("n3").value;

        if (campo1 === "" || campo2 === "" || campo3 === "") {
            document.getElementById("resultado").textContent =
                "Preencha os três números.";
            return;
        }

        let n1 = Number(campo1);
        let n2 = Number(campo2);
        let n3 = Number(campo3);

        if (opcao === 1) {
            resultado = maxNumeros(n1, n2, n3);
        } else {
            resultado = ordNumeros(n1, n2, n3);
        }

    } else if (opcao === 3) {
        let palavra = document.getElementById("palavra").value;
        resultado = verificarPalindromo(palavra);

    } else if (opcao === 4) {
        let s1 = document.getElementById("s1").value;
        let s2 = document.getElementById("s2").value;
        resultado = verificarStrings(s1, s2);

    } else if (opcao === 5) {
        let s1 = document.getElementById("s1").value;
        let s2 = document.getElementById("s2").value;
        resultado = verificarSubconjunto(s1, s2);
    }

    document.getElementById("resultado").textContent = resultado;
}
