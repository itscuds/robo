#  Robô Aspirador

Exercício de **Strategy** da disciplina de Programação Orientada a Objetos.

O robô limpa uma sala com sofá, mesa, rack, estante e poltrona. Ele tem bateria para 300 passos e, a cada passo, decide para onde ir. Hoje ele sabe limpar de dois jeitos:

- **Aleatória:** sorteia uma direção a cada passo.
- **Ricochete:** segue reto e, quando bate, sorteia outra direção.

O fabricante quer lançar um modo novo, o **zigue-zague**, e já avisou que depois virão outros. O problema é que todos os modos estão escritos dentro da classe `Robo`, num `if` atrás do outro. Cada modo novo é mais um `if`, e a classe `Robo` não para de crescer.

Seu trabalho é tirar os modos de dentro do robô e transformar cada um em uma **rota** que o robô recebe pronta e pode trocar a qualquer momento.

---

## Como rodar

1. Abra o projeto na sua IDE.
2. Rode a classe `RoboApplication` (ou `./mvnw spring-boot:run` no terminal).
3. Acesse http://localhost:8080.

Escolha a rota, clique em **Ligar** e veja o robô trabalhar. O botão **Ranking** coloca cada rota numa sala nova, com a bateria cheia, e compara quanto cada uma limpou.

A tela carrega o three.js da internet, então precisa de conexão.

---

## O que já está pronto

Você **não precisa mexer** em nada dentro de `controller`, `templates` e `static`.

No pacote `model`:

| Classe | Para que serve |
| --- | --- |
| `Direcao` | `CIMA`, `BAIXO`, `ESQUERDA`, `DIREITA` |
| `Posicao` | Uma célula da sala. `posicao.mover(direcao)` devolve a célula vizinha. |
| `Sala` | Móveis e sujeira. `sala.livre(posicao)` diz se dá para ir até aquela célula. |
| `Robo` | Anda, limpa, conta passos e batidas. **É aqui que estão os `if`s.** |
| `Simulador` | Liga o robô à tela e monta o ranking. Tem uma lista com os nomes dos modos. |

---

## O que você deve fazer

### 1. Criar a interface `Rota`

```java
public interface Rota {
    String getNome();
    Direcao proximaDirecao(Sala sala, Posicao atual);
}
```

O nome aparece no menu da tela e no ranking.

### 2. Tirar os modos de dentro do `Robo`

Crie as classes `Aleatoria` e `Ricochete`, as duas implementando `Rota`. O código de cada uma está hoje dentro do método `proximaDirecao()` do `Robo`: é só levar para o lugar certo.

Repare que o `Ricochete` precisa lembrar a direção em que está indo. Essa informação passa a ser um atributo da própria rota.

### 3. O robô passa a ter uma `Rota`

No `Robo`:

- troque o atributo `String modo` por `Rota rota`;
- o construtor recebe uma `Rota` no lugar do nome;
- troque `setModo(String)` por `setRota(Rota)`;
- o `andar()` pergunta a direção para a rota;
- o método `proximaDirecao()` e todos os `if`s saem do `Robo`;
- `getNomeDaRota()` devolve o nome que vem da rota.

### 4. Ajustar o `Simulador`

O método `modos()` devolve uma lista de nomes. Troque por um método `rotas()` que devolve uma lista de objetos `Rota`, e ajuste `nomesDasRotas()`, `escolherRota()`, `ranking()` e o robô criado no atributo.

Nesse ponto, o app deve estar funcionando como antes, mas com o código mais limpo e organizado e escalável.

Atenção: o método `rotas()` precisa criar **objetos novos a cada chamada**. Pense no porquê depois de testar o ranking.

### 5. Criar o zigue-zague

Crie a rota `ZigueZague`:

- anda na horizontal enquanto tiver caminho livre;
- quando bater, inverte o sentido horizontal (direita ↔ esquerda) e desce uma linha;
- se não der para descer, passa a subir (e vice-versa).

Adicione o `ZigueZague` na lista do `Simulador`. Ele deve aparecer no menu da tela e no ranking **sem nenhuma alteração no `Robo`**.

---

## Como saber se terminou

- O `Robo` não tem nenhum `if` sobre o modo de limpeza.
- O menu mostra Aleatória, Ricochete e Zigue-zague.
- Dá para trocar a rota com o robô ligado, no meio da limpeza.
- No ranking, o zigue-zague limpa bem mais que as outras duas.

## Desafio

Crie a sua própria rota e tente bater o zigue-zague no ranking. Ideias: espiral, seguir as paredes, zigue-zague na vertical, ou uma rota que prefere as células ainda sujas (`sala.estaSuja(posicao)`).

---

## Para pensar

1. O que mudou no `Robo` quando você criou o `ZigueZague`?
2. Por que o `Ricochete` guarda a direção dentro dele, e não no `Robo`?
3. O que aconteceria no ranking se `rotas()` devolvesse sempre os mesmos objetos?
