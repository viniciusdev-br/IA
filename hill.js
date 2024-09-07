function gerarTabuleiroAleatorio() {
    const tabuleiro = [];
    for (let i = 0; i < 8; i++) {
        tabuleiro.push(Math.floor(Math.random() * 8));
    }
    return tabuleiro;
}

function calcularConflitos(tabuleiro) {
    let conflitos = 0;

    for (let i = 0; i < 8; i++) {
        for (let j = i + 1; j < 8; j++) {
            if (tabuleiro[i] === tabuleiro[j] || Math.abs(tabuleiro[i] - tabuleiro[j]) === j - i) {
                conflitos++;
            }
        }
    }
    return conflitos;
}

function gerarVizinho(tabuleiro) {
    const novoTabuleiro = tabuleiro.slice();
    const coluna = Math.floor(Math.random() * 8);
    const novaLinha = Math.floor(Math.random() * 8);
    novoTabuleiro[coluna] = novaLinha;
    return novoTabuleiro;
}

function subirColinaEstocastico() {
    let estadoAtual = gerarTabuleiroAleatorio();
    let conflitosAtuais = calcularConflitos(estadoAtual);
    const MAX_ITERATIONS = 500;
    let iterations = 0;

    while (conflitosAtuais > 0) {
        if (iterations >= MAX_ITERATIONS) {
            break;
        }
        const novoEstado = gerarVizinho(estadoAtual);
        const novosConflitos = calcularConflitos(novoEstado);

        if (novosConflitos < conflitosAtuais) {
            estadoAtual = novoEstado;
            conflitosAtuais = novosConflitos;
        }
        iterations++;
    }

    return {
        solucao: estadoAtual,
        iterations,
    };
}

function calcularMedia(valores) {
    const soma = valores.reduce((acc, val) => acc + val, 0);
    return soma / valores.length;
}

function calcularDesvioPadrao(valores, media) {
    const variancia = valores.reduce((acc, val) => acc + Math.pow(val - media, 2), 0) / valores.length;
    return Math.sqrt(variancia);
}

const solutions = [];

for (let i = 0; i < 50; i++) {
    const inicio = performance.now();
    const { solucao, iterations } = subirColinaEstocastico();
    const fim = performance.now();
    const tempo = fim - inicio;
    const conflitos = calcularConflitos(solucao);

    solutions.push({ solucao, tempo, conflitos, iterations });
}

const bestSolutions = solutions.sort((a, b) => a.conflitos - b.conflitos).slice(0, 5);

console.log('Melhores soluções: ', bestSolutions);
console.log('Média de conflitos: ', calcularMedia(solutions.map(s => s.conflitos)));
console.log('Desvio padrão de conflitos: ', calcularDesvioPadrao(solutions.map(s => s.conflitos), calcularMedia(solutions.map(s => s.conflitos))));
console.log('Média de tempo (ms): ', calcularMedia(solutions.map(s => s.tempo)));
console.log('Desvio padrão de tempo (ms): ', calcularDesvioPadrao(solutions.map(s => s.tempo), calcularMedia(solutions.map(s => s.tempo))));
