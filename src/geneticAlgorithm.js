import { calcularConflitos, mostrarTabuleiro, calcularDesvioPadrao, calcularMedia } from "./util.js";

const maxPopulacao = 20;
const taxaCruzamento = 0.8;
const taxaMutacao = 0.03;
const maxGeracoes = 1000;
const numExecucoes = 50;

function inicializarPopulacao() {
  const populacao = [];
  for (let i = 0; i < maxPopulacao; i++) {
    populacao.push(Array.from({ length: 8 }, () => Math.floor(Math.random() * 8)));
  }

  return populacao;
}

function funcaoAptitude(individuo) {
  return calcularConflitos(individuo);
}

function cruzamento(pai1, pai2) {
  const corte = Math.floor(Math.random() * 8);

  const individuo = [...pai1.slice(0, corte), ...pai2.slice(corte, 8)];
  return individuo
}

function mutacao(individuo) {
  const gene = Math.floor(Math.random() * 8);
  const mutacao = Math.floor(Math.random() * (8 - 1) + 1);
  individuo[gene] = individuo[gene] ^ mutacao;
  return individuo;
}

function algoritmoGenetico() {
  let populacao = inicializarPopulacao();
  let geracao = 0;

  while (geracao < maxGeracoes && funcaoAptitude(populacao[0]) !== 0) {
    const novaPopulacao = [...populacao];

    populacao.forEach((individuo) => {
      let novoIndividuo = []
      if (Math.random() < taxaCruzamento) {
        const pai1 = individuo;
        const pai2 = populacao[Math.floor(Math.random() * maxPopulacao)];
        novoIndividuo = cruzamento(pai1, pai2);
      }

      if (Math.random() < taxaMutacao) {
        novoIndividuo = mutacao(novoIndividuo);
      }

      if (novoIndividuo.length > 0) {
        novaPopulacao.push(novoIndividuo);
      }
    })
    
    novaPopulacao.sort((a, b) => funcaoAptitude(a) - funcaoAptitude(b));
    populacao = novaPopulacao.slice(0, maxPopulacao);
    geracao++;
  }

  return {
    solucao: populacao[0].map(tabuleiro => {
      return tabuleiro.toString(2).padStart(3, '0');
    }), 
    iterations: geracao 
  };
}

const solutions = [];

for (let i = 0; i < numExecucoes; i++) {
  const inicio = performance.now();
  const { solucao, iterations } = algoritmoGenetico();
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
console.log('Média de iterações: ', calcularMedia(solutions.map(s => s.iterations)));
console.log('Desvio padrão de iterações: ', calcularDesvioPadrao(solutions.map(s => s.iterations), calcularMedia(solutions.map(s => s.iterations))));