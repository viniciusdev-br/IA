import { calcularConflitos, mostrarTabuleiro, calcularDesvioPadrao, calcularMedia } from "./util.js";

class AlgoritmoGenetico {
  constructor(maxPopulacao, taxaCruzamento, taxaMutacao, maxGeracoes) {
    this.maxPopulacao = maxPopulacao;
    this.taxaCruzamento = taxaCruzamento;
    this.taxaMutacao = taxaMutacao;
    this.maxGeracoes = maxGeracoes;

    this.populacao = [];
  }

  inicializarPopulacao() {
    const populacao = [];
    for (let i = 0; i < this.maxPopulacao; i++) {
      populacao.push(Array.from({ length: 8 }, () => Math.floor(Math.random() * 8)));
    }

    this.populacao = populacao;
  }

  funcaoAptitude(individuo) {
    return calcularConflitos(individuo);
  }

  cruzamento(pai1, pai2) {
    const corte = Math.floor(Math.random() * 8);

    const individuo = [...pai1.slice(0, corte), ...pai2.slice(corte, 8)];
    return individuo
  }

  mutacao(individuo) {
    const gene = Math.floor(Math.random() * 8);
    const mutacao = Math.floor(Math.random() * (8 - 1) + 1);
    individuo[gene] = individuo[gene] ^ mutacao;
    return individuo;
  }

  resolver() {
    this.inicializarPopulacao();
    let geracao = 0;

    while (geracao < this.maxGeracoes && this.funcaoAptitude(this.populacao[0]) !== 0) {
      const novaPopulacao = [...this.populacao];

      this.populacao.forEach((individuo) => {
        let novoIndividuo = []
        if (Math.random() < this.taxaCruzamento) {
          const pai1 = individuo;
          const pai2 = this.populacao[Math.floor(Math.random() * this.maxPopulacao)];
          novoIndividuo = this.cruzamento(pai1, pai2);
        }

        if (Math.random() < this.taxaMutacao) {
          novoIndividuo = this.mutacao(novoIndividuo);
        }

        if (novoIndividuo.length > 0) {
          novaPopulacao.push(novoIndividuo);
        }
      })
      
      novaPopulacao.sort((a, b) => this.funcaoAptitude(a) - this.funcaoAptitude(b));
      this.populacao = novaPopulacao.slice(0, this.maxPopulacao);
      geracao++;
    }

    return { tabuleiro: this.populacao[0], iteracoes: geracao };
  }
}

const numExecucoes = 50;
const resultados = [];
const temposExecucao = [];
const iteracoesNecessarias = [];

const sa = new AlgoritmoGenetico(20, 0.8, 0.03, 1000);

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
  .sort((a, b) => sa.funcaoAptitude(a.tabuleiro) - sa.funcaoAptitude(b.tabuleiro))
  .slice(0, 5)
  .sort((a, b) => a.iteracoes - b.iteracoes);

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