// Tela do robô em 3D. Não precisa mexer neste arquivo:
// ele só conversa com o RoboApiController (/api/...).

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ---------- cena, câmera e luz ----------

const container = document.getElementById('cena');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe9e2d6);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(2.2, 15, 14);

const controles = new OrbitControls(camera, renderer.domElement);
controles.target.set(2.2, 0, 1);
controles.enablePan = false;
controles.minDistance = 8;
controles.maxDistance = 35;
controles.maxPolarAngle = Math.PI * 0.45;

scene.add(new THREE.HemisphereLight(0xffffff, 0x8d7b68, 1.3));
const luz = new THREE.DirectionalLight(0xffffff, 1.4);
luz.position.set(-6, 14, 8);
luz.castShadow = true;
luz.shadow.mapSize.set(2048, 2048);
Object.assign(luz.shadow.camera, { left: -12, right: 12, top: 10, bottom: -10 });
scene.add(luz);

// ---------- peças básicas ----------

function caixa(l, a, p, cor) {
    const malha = new THREE.Mesh(
        new THREE.BoxGeometry(l, a, p),
        new THREE.MeshStandardMaterial({ color: cor, roughness: 0.8 })
    );
    malha.castShadow = true;
    malha.receiveShadow = true;
    return malha;
}

function cilindro(raio, altura, cor) {
    const malha = new THREE.Mesh(
        new THREE.CylinderGeometry(raio, raio, altura, 28),
        new THREE.MeshStandardMaterial({ color: cor, roughness: 0.6 })
    );
    malha.castShadow = true;
    return malha;
}

function em(objeto, x, y, z) {
    objeto.position.set(x, y, z);
    return objeto;
}

// ---------- sala ----------

let largura = 16;
let altura = 12;

// centro da célula (x, y) da sala no mundo 3D
function mundo(x, y) {
    return new THREE.Vector3(x - largura / 2 + 0.5, 0, y - altura / 2 + 0.5);
}

const sala = new THREE.Group();
scene.add(sala);
const sujeiras = []; // índice: y * largura + x

function construirSala(dados) {
    sala.clear();
    sujeiras.length = 0;
    largura = dados.largura;
    altura = dados.altura;

    // piso de tacos
    for (let y = 0; y < altura; y++) {
        for (let x = 0; x < largura; x++) {
            const cor = (x + y) % 2 === 0 ? 0xc9a27e : 0xbf9772;
            const taco = em(caixa(0.98, 0.1, 0.98, cor), 0, -0.05, 0);
            taco.castShadow = false;
            taco.position.copy(mundo(x, y)).setY(-0.05);
            sala.add(taco);
        }
    }

    // tapete embaixo da mesa (não é obstáculo, só enfeite)
    const tapete = em(caixa(6, 0.02, 5, 0x8e3b46), 0, 0.01, 0);
    tapete.castShadow = false;
    tapete.position.copy(mundo(8, 5)).setY(0.01);
    sala.add(tapete);

    // paredes
    const corParede = 0xf3efe7;
    sala.add(em(caixa(largura + 0.4, 1.2, 0.2, corParede), 0, 0.6, -altura / 2 - 0.1));
    sala.add(em(caixa(0.2, 1.2, altura + 0.4, corParede), -largura / 2 - 0.1, 0.6, 0));
    sala.add(em(caixa(0.2, 1.2, altura + 0.4, corParede), largura / 2 + 0.1, 0.6, 0));
    sala.add(em(caixa(largura + 0.4, 0.3, 0.2, corParede), 0, 0.15, altura / 2 + 0.1));

    // base de carga
    const base = em(caixa(0.8, 0.12, 0.8, 0x263238), 0, 0.06, 0);
    base.position.copy(mundo(0, 0)).setY(0.06);
    sala.add(base);

    for (const movel of dados.moveis) {
        sala.add(criarMovel(movel));
    }

    for (let y = 0; y < altura; y++) {
        for (let x = 0; x < largura; x++) {
            sujeiras[y * largura + x] = null;
        }
    }
    for (const p of dados.sujas) {
        const sujeira = criarSujeira(p.x, p.y);
        sala.add(sujeira);
        sujeiras[p.y * largura + p.x] = sujeira;
    }
}

function criarSujeira(x, y) {
    const g = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ color: 0x7a5a48, roughness: 1, transparent: true, opacity: 0.75 });
    // a posição das manchas sai da própria célula, então a sala fica sempre igual
    let semente = x * 73 + y * 151;
    const aleatorio = () => {
        semente = (semente * 9301 + 49297) % 233280;
        return semente / 233280;
    };
    for (let i = 0; i < 4; i++) {
        const mancha = new THREE.Mesh(new THREE.CircleGeometry(0.04 + aleatorio() * 0.07, 8), material);
        mancha.rotation.x = -Math.PI / 2;
        mancha.position.set((aleatorio() - 0.5) * 0.6, 0.02, (aleatorio() - 0.5) * 0.6);
        g.add(mancha);
    }
    g.position.copy(mundo(x, y));
    return g;
}

function criarMovel(m) {
    const g = new THREE.Group();
    const l = m.largura;
    const p = m.altura;

    switch (m.nome) {
        case 'Rack':
            g.add(em(caixa(l - 0.1, 0.5, p - 0.2, 0x6d4c41), 0, 0.25, 0));
            g.add(em(caixa(2.4, 1.3, 0.08, 0x111111), 0, 1.2, 0));
            break;
        case 'Estante':
            g.add(em(caixa(l - 0.1, 2.2, p - 0.2, 0x8d6e63), 0, 1.1, 0));
            for (let i = 0; i < 9; i++) {
                const cores = [0xc62828, 0x1565c0, 0x2e7d32, 0xf9a825];
                g.add(em(caixa(0.18, 0.4, 0.5, cores[i % 4]), -l / 2 + 0.4 + i * 0.38, 1.6, 0.25));
            }
            break;
        case 'Mesa':
            g.add(em(caixa(l - 0.2, 0.12, p - 0.2, 0xa1887f), 0, 0.9, 0));
            for (const sx of [-1, 1]) {
                for (const sz of [-1, 1]) {
                    g.add(em(caixa(0.12, 0.85, 0.12, 0x5d4037), sx * (l / 2 - 0.3), 0.42, sz * (p / 2 - 0.3)));
                }
            }
            g.add(em(cilindro(0.25, 0.3, 0x80cbc4), 0, 1.11, 0));
            break;
        case 'Sofá':
            g.add(em(caixa(l - 0.1, 0.5, p - 0.2, 0x5c6bc0), 0, 0.35, 0));
            g.add(em(caixa(l - 0.1, 0.7, 0.35, 0x3f51b5), 0, 0.7, p / 2 - 0.25));
            g.add(em(caixa(0.3, 0.6, p - 0.2, 0x3f51b5), -l / 2 + 0.2, 0.55, 0));
            g.add(em(caixa(0.3, 0.6, p - 0.2, 0x3f51b5), l / 2 - 0.2, 0.55, 0));
            break;
        case 'Poltrona':
            g.add(em(caixa(l - 0.2, 0.5, p - 0.2, 0xff8a65), 0, 0.35, 0));
            g.add(em(caixa(l - 0.2, 0.7, 0.3, 0xf4511e), 0, 0.7, p / 2 - 0.25));
            break;
        default:
            g.add(em(caixa(l - 0.1, 0.8, p - 0.1, 0x9e9e9e), 0, 0.4, 0));
    }

    const centro = mundo(m.x + (l - 1) / 2, m.y + (p - 1) / 2);
    g.position.copy(centro);
    return g;
}

// ---------- robô ----------

const robo = new THREE.Group();
robo.add(em(cilindro(0.4, 0.18, 0x37474f), 0, 0.12, 0));
robo.add(em(cilindro(0.3, 0.04, 0x263238), 0, 0.23, 0));
const led = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0x00e676, emissive: 0x00e676, emissiveIntensity: 1.5 })
);
robo.add(em(led, 0.28, 0.24, 0));
robo.add(em(caixa(0.06, 0.08, 0.5, 0x90a4ae), 0.37, 0.12, 0)); // para-choque na frente (+x)
scene.add(robo);

// o modelo aponta para +x; este ângulo faz ele olhar na direção dada
const ANGULO = { DIREITA: 0, CIMA: Math.PI / 2, ESQUERDA: Math.PI, BAIXO: -Math.PI / 2 };

// ---------- animação ----------

const animacoes = [];

function animar(duracao, aoAtualizar) {
    return new Promise(resolve => animacoes.push({ tempo: 0, duracao, aoAtualizar, resolve }));
}

async function moverRobo(estado, duracao) {
    const inicio = robo.position.clone();
    const destino = mundo(estado.x, estado.y);
    const anguloInicio = robo.rotation.y;
    let diferenca = ANGULO[estado.direcao] - anguloInicio;
    diferenca = Math.atan2(Math.sin(diferenca), Math.cos(diferenca));

    await animar(duracao, k => {
        robo.rotation.y = anguloInicio + diferenca * Math.min(1, k * 2);
        robo.position.lerpVectors(inicio, destino, k);
    });

    if (estado.bateu) {
        const frente = new THREE.Vector3(Math.cos(robo.rotation.y), 0, -Math.sin(robo.rotation.y));
        await animar(Math.min(duracao, 0.2), k => {
            const empurrao = Math.sin(k * Math.PI) * 0.18;
            robo.position.copy(destino).addScaledVector(frente, empurrao);
        });
        led.material.color.set(0xff1744);
        led.material.emissive.set(0xff1744);
        setTimeout(() => {
            led.material.color.set(0x00e676);
            led.material.emissive.set(0x00e676);
        }, 200);
    }

    const sujeira = sujeiras[estado.y * largura + estado.x];
    if (sujeira) {
        sujeiras[estado.y * largura + estado.x] = null;
        animar(0.3, k => sujeira.scale.setScalar(1 - k)).then(() => sala.remove(sujeira));
    }
}

// ---------- painel ----------

const elRota = document.getElementById('rota');
const btPlay = document.getElementById('play');
const btPasso = document.getElementById('passo');
const btReiniciar = document.getElementById('reiniciar');
const elVelocidade = document.getElementById('velocidade');
const elBateria = document.getElementById('bateria');
const elBarra = document.getElementById('barraBateria');
const elLimpo = document.getElementById('limpo');
const elBatidas = document.getElementById('batidas');
const elAviso = document.getElementById('aviso');

let ligado = false;
let andando = false;
let ultimo = null;

function mostrar(estado) {
    ultimo = estado;
    const restante = estado.limite - estado.passos;
    elBateria.textContent = restante + ' passos';
    elBarra.style.width = (restante * 100 / estado.limite) + '%';
    elBarra.style.background = restante < estado.limite * 0.2 ? '#e53935' : '#43a047';
    elLimpo.textContent = estado.percentualLimpo + '%';
    elBatidas.textContent = estado.batidas;
    if (elRota.value !== estado.rota && [...elRota.options].some(o => o.value === estado.rota)) {
        elRota.value = estado.rota;
    }
}

function avisar(texto) {
    elAviso.textContent = texto;
    elAviso.style.display = 'block';
    clearTimeout(avisar.timer);
    avisar.timer = setTimeout(() => (elAviso.style.display = 'none'), 2500);
}

function ligar(valor) {
    ligado = valor;
    btPlay.textContent = ligado ? '⏸ Pausar' : '▶ Ligar';
    btPlay.classList.toggle('pausado', ligado);
}

async function darPasso() {
    if (andando) return;
    if (ultimo && ultimo.passos >= ultimo.limite) {
        ligar(false);
        avisar('Bateria acabou! Use ↺ para começar de novo');
        return;
    }
    andando = true;
    try {
        const r = await fetch('/api/passo', { method: 'POST' });
        if (!r.ok) throw new Error(r.status);
        const estado = await r.json();
        await moverRobo(estado, 1 / Number(elVelocidade.value));
        mostrar(estado);
    } catch (erro) {
        ligar(false);
        avisar('Erro no servidor (veja o console do Spring)');
    }
    andando = false;
}

async function carregarTudo() {
    const [rSala, rEstado, rRotas] = await Promise.all([fetch('/api/sala'), fetch('/api/estado'), fetch('/api/rotas')]);
    construirSala(await rSala.json());
    const estado = await rEstado.json();
    const rotas = await rRotas.json();

    elRota.innerHTML = '';
    for (const nome of rotas) {
        const opcao = document.createElement('option');
        opcao.value = nome;
        opcao.textContent = nome;
        elRota.appendChild(opcao);
    }

    robo.position.copy(mundo(estado.x, estado.y));
    robo.rotation.y = ANGULO[estado.direcao];
    mostrar(estado);
}

btPlay.addEventListener('click', () => ligar(!ligado));
btPasso.addEventListener('click', () => { ligar(false); darPasso(); });
btReiniciar.addEventListener('click', async () => {
    ligar(false);
    while (andando) await new Promise(r => setTimeout(r, 20));
    await fetch('/api/reiniciar', { method: 'POST' });
    await carregarTudo();
});
elRota.addEventListener('change', async () => {
    const r = await fetch('/api/rota/' + encodeURIComponent(elRota.value), { method: 'POST' });
    if (r.ok) mostrar(await r.json());
});

// ---------- ranking ----------

const elQuadro = document.getElementById('quadro');
const elTabela = document.getElementById('tabela');

document.getElementById('ranking').addEventListener('click', async () => {
    ligar(false);
    const r = await fetch('/api/ranking');
    const resultados = (await r.json()).sort((a, b) => b.percentualLimpo - a.percentualLimpo || a.batidas - b.batidas);
    const medalhas = ['🥇', '🥈', '🥉'];
    elTabela.innerHTML = '';
    resultados.forEach((res, i) => {
        const linha = document.createElement('tr');
        for (const texto of [medalhas[i] ?? (i + 1) + 'º', res.rota, res.percentualLimpo + '%', res.batidas]) {
            const celula = document.createElement('td');
            celula.textContent = texto;
            linha.appendChild(celula);
        }
        elTabela.appendChild(linha);
    });
    elQuadro.style.display = 'block';
});
document.getElementById('fechar').addEventListener('click', () => (elQuadro.style.display = 'none'));

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------- laço principal ----------

const relogio = new THREE.Clock();

function quadro() {
    const dt = Math.min(relogio.getDelta(), 0.05);

    for (let i = animacoes.length - 1; i >= 0; i--) {
        const a = animacoes[i];
        a.tempo += dt;
        const k = Math.min(a.tempo / a.duracao, 1);
        a.aoAtualizar(k);
        if (k === 1) {
            animacoes.splice(i, 1);
            a.resolve();
        }
    }

    if (ligado && !andando) darPasso();

    controles.update();
    renderer.render(scene, camera);
    requestAnimationFrame(quadro);
}

carregarTudo();
quadro();
