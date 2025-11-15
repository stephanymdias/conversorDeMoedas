window.addEventListener('DOMContentLoaded', () => {
setupEventListeners();
});

function setupEventListeners() {
document.getElementById('btn-jogar').addEventListener('click', iniciarJogo);
document.getElementById('btn-pausar').addEventListener('click', togglePause);
document.getElementById('btn-proxima-rodada').addEventListener('click', sortearCartas);
}

let monteJogador = [];
let monteMaquina = [];
let cartaJogador;
let cartaMaquina;
let jogoPausado = false; 

const somVitoria = document.getElementById('sound-win');
const somDerrota = document.getElementById('sound-lose');

function tocarSom(som) {
som.currentTime = 0;
som.play();
}

function togglePause() {
jogoPausado = !jogoPausado;
const overlay = document.getElementById('pause-overlay');
const btnPausar = document.getElementById('btn-pausar');

if (jogoPausado) {
overlay.classList.remove('hidden');
btnPausar.textContent = 'Retomar';
} else {
overlay.classList.add('hidden');
btnPausar.textContent = 'Pausar';
}
}

function iniciarJogo() {
const btnJogar = document.getElementById('btn-jogar');
const btnPausar = document.getElementById('btn-pausar');
const btnProximaRodada = document.getElementById('btn-proxima-rodada');

let baralhoEmbaralhado = [...baralho].sort(() => Math.random() - 0.5);

const metade = Math.ceil(baralhoEmbaralhado.length / 2);
monteJogador = baralhoEmbaralhado.slice(0, metade);
monteMaquina = baralhoEmbaralhado.slice(metade);

btnJogar.disabled = true;
btnPausar.disabled = false;
btnProximaRodada.disabled = false;

sortearCartas();
atualizarPlacar();
}

function atualizarPlacar() {
document.getElementById('placar-jogador').textContent = `Jogador: ${monteJogador.length}`;
document.getElementById('placar-maquina').textContent = `Máquina: ${monteMaquina.length}`;
}

function sortearCartas() {
if (jogoPausado) return;

if (monteJogador.length === 0 || monteMaquina.length === 0) {
fimDeJogo();
return;
}

cartaJogador = monteJogador[0];
cartaMaquina = monteMaquina[0];

document.getElementById('resultado').textContent = "Escolha um atributo";
document.getElementById('btn-proxima-rodada').disabled = true;

exibirCarta(document.getElementById('carta-jogador'), cartaJogador, true);

const cartaMaquinaEl = document.getElementById('carta-maquina');
cartaMaquinaEl.innerHTML = "";
cartaMaquinaEl.classList.add('verso');
}

function exibirCarta(elemento, carta, ehJogador) {
elemento.classList.remove('verso');
let html = `<div class="carta-nome">${carta.nome}</div>`;
html += `<img src="${carta.imagem}" class="carta-imagem">`;
html += '<div class="carta-atributos"><ul>';

for (let atributo in carta.atributos) {

if (ehJogador) {
html += `<li onclick="comparar('${atributo}')">${atributo}: ${carta.atributos[atributo]}</li>`;
} else {
html += `<li>${atributo}: ${carta.atributos[atributo]}</li>`;
}
}

html += '</ul></div>';
elemento.innerHTML = html;
}

function comparar(atributoSelecionado) {
if (jogoPausado) return;

const resultadoEl = document.getElementById('resultado');
const btnProximaRodada = document.getElementById('btn-proxima-rodada');

exibirCarta(document.getElementById('carta-maquina'), cartaMaquina, false);

let valorJogador = cartaJogador.atributos[atributoSelecionado];
let valorMaquina = cartaMaquina.atributos[atributoSelecionado];

if (valorJogador > valorMaquina) {
resultadoEl.textContent = `Você venceu! ${valorJogador} > ${valorMaquina}`;
tocarSom(somVitoria);
monteJogador.push(monteMaquina.shift());
monteJogador.push(monteJogador.shift());
} else if (valorMaquina > valorJogador) {
resultadoEl.textContent = `Você perdeu! ${valorJogador} < ${valorMaquina}`;
tocarSom(somDerrota);
monteMaquina.push(monteJogador.shift());
monteMaquina.push(monteMaquina.shift());
} else {
resultadoEl.textContent = "Empate!";
monteJogador.push(monteJogador.shift());
monteMaquina.push(monteMaquina.shift());
}

atualizarPlacar();
btnProximaRodada.disabled = false;

const atributosLi = document.getElementById('carta-jogador').querySelectorAll('.carta-atributos li');
atributosLi.forEach(li => li.onclick = null);
}

function fimDeJogo() {
const btnJogar = document.getElementById('btn-jogar');
const btnPausar = document.getElementById('btn-pausar');
const btnProximaRodada = document.getElementById('btn-proxima-rodada');

const mensagemFinal = monteJogador.length > 0 ? "Fim de jogo! Parabéns, você venceu!" : "Fim de jogo! Você perdeu.";
document.getElementById('resultado').textContent = mensagemFinal;

btnProximaRodada.disabled = true;
btnPausar.disabled = true;
btnJogar.disabled = false;
btnJogar.textContent = "Jogar Novamente";

btnJogar.replaceWith(btnJogar.cloneNode(true));
document.getElementById('btn-jogar').addEventListener('click', () => window.location.reload());
}
