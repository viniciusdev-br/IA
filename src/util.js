import chalk from 'chalk'

function checaConflito(tabuleiro, index) {
  let pos = tabuleiro[index];

  for (let i = 0; i < tabuleiro.length; i++) {
    if (i === index) continue;

    if (tabuleiro[i] === pos) {
      return true;
    }

    if (Math.abs(i - index) === Math.abs(tabuleiro[i] - pos)) {
      return true;
    }
  }

  return false;
}

export function calcularConflitos(tabuleiro) {
  let conflitos = 0;
  for (let i = 0; i < 8; i++) {
    for (let j = i + 1; j < 8; j++) {
      if (tabuleiro[i] === tabuleiro[j] || Math.abs(tabuleiro[i] - tabuleiro[j]) === Math.abs(i - j)) {
        conflitos++;
      }
    }
  }
  return conflitos;
}

export function calcularMedia(valores) {
  const soma = valores.reduce((acc, val) => acc + val, 0);
  return soma / valores.length;
}

export function calcularDesvioPadrao(valores, media) {
  const variancia = valores.reduce((acc, val) => acc + Math.pow(val - media, 2), 0) / valores.length;
  return Math.sqrt(variancia);
}

export function mostrarTabuleiro(tabuleiro, iter) {
  console.log(chalk.bgGreen(`Iterações: ${iter}`));
  console.log(chalk.cyan('  0 1 2 3 4 5 6 7 '));
  for (let i = 0; i < tabuleiro.length; i++) {
    let row = '';
    process.stdout.write(chalk.cyan(i + ' '));
    for (let j = 0; j < tabuleiro.length; j++) {
      row += tabuleiro[j] === i
        ? checaConflito(tabuleiro, j) ? chalk.red('Q ') : chalk.green('Q ')
        : '. ';
    }
    console.log(row);
  }
}
