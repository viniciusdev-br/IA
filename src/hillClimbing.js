import { calcularMedia, calcularDesvioPadrao, mostrarTabuleiro, calcularConflitos } from "./util.js";

class RecozimentoSimulado {
  constructor(temperaturaInicial, taxaResfriamento) {
    this.temperaturaInicial = temperaturaInicial;
    this.taxaResfriamento = taxaResfriamento;
  }

  obterVizinhoAleatorio(tabuleiro) {
    const vizinho = [...tabuleiro];
    const coluna = Math.floor(Math.random() * 8);
    let novaLinha;
    do {
      novaLinha = Math.floor(Math.random() * 8);
    } while (novaLinha === vizinho[coluna]);
    vizinho[coluna] = novaLinha;
    return vizinho;
  }

  probabilidadeAceitacao(conflitosAtuais, conflitosVizinho, temperatura) {
    if (conflitosVizinho < conflitosAtuais) {
      return 1.0;
    }
    return Math.exp((conflitosAtuais - conflitosVizinho) / temperatura);
  }

  resolver() {
    let tabuleiro = Array.from({ length: 8 }, () => Math.floor(Math.random() * 8));
    let conflitosAtuais = calcularConflitos(tabuleiro);
    let temperatura = this.temperaturaInicial;
    let iteracoes = 0;

    while (temperatura > 1) {
      if (conflitosAtuais === 0) {
        break;
      }

      const vizinho = this.obterVizinhoAleatorio(tabuleiro);
      const conflitosVizinho = calcularConflitos(vizinho);

      if (Math.random() < this.probabilidadeAceitacao(conflitosAtuais, conflitosVizinho, temperatura)) {
        tabuleiro = vizinho;
        conflitosAtuais = conflitosVizinho;
      }

      temperatura *= this.taxaResfriamento;
      iteracoes++;
    }

    return { tabuleiro, iteracoes };
  }
}
  
  
const numExecucoes = 50;
const resultados = [];
const temposExecucao = [];
const iteracoesNecessarias = [];

const sa = new RecozimentoSimulado(100, 0.99);

for (let i = 0; i < numExecucoes; i++) {
  const inicio = Date.now();
  const resultado = sa.resolver();
  const fim = Date.now();

  const tempoExecucao = fim - inicio;

  resultados.push(resultado);
  temposExecucao.push(tempoExecucao);
  iteracoesNecessarias.push(resultado.iteracoes);
}

const mediaIteracoes = calcularMedia(iteracoesNecessarias);
const desvioPadraoIteracoes = calcularDesvioPadrao(iteracoesNecessarias, mediaIteracoes);

const mediaTempoExecucao = calcularMedia(temposExecucao);
const desvioPadraoTempoExecucao = calcularDesvioPadrao(temposExecucao, mediaTempoExecucao);

const melhoresResultados = resultados
  .sort((a, b) => calcularConflitos(a.tabuleiro) - calcularConflitos(b.tabuleiro))
  .slice(0, 5);

// Exibe os resultados
console.log("Média de iterações necessárias:", mediaIteracoes);
console.log("Desvio padrão das iterações necessárias:", desvioPadraoIteracoes);
console.log("Média do tempo de execução (ms):", mediaTempoExecucao);
console.log("Desvio padrão do tempo de execução (ms):", desvioPadraoTempoExecucao);
console.log("5 Melhores resultados:");
melhoresResultados.forEach(resultado => {
  mostrarTabuleiro(resultado.tabuleiro, resultado.iteracoes);
  console.log();
})
  