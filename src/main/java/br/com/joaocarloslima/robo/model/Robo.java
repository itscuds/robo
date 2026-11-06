package br.com.joaocarloslima.robo.model;

import java.util.Random;

public class Robo {
    private Posicao posicao;
    private Direcao direcao = Direcao.DIREITA;
    private String modo;
    private int passos;
    private int batidas;
    private Random random = new Random();

    public Robo(Posicao inicio, String modo) {
        this.posicao = inicio;
        this.modo = modo;
    }

    public void andar(Sala sala) {
        direcao = proximaDirecao(sala);
        Posicao destino = posicao.mover(direcao);
        if (sala.livre(destino)) {
            posicao = destino;
            sala.limpar(posicao);
        } else {
            batidas++;
        }
        passos++;
    }

    // cada modo de limpeza novo vira mais um if aqui dentro...
    private Direcao proximaDirecao(Sala sala) {
        if (modo.equals("Aleatória")) {
            return sortearDirecao();
        }

        if (modo.equals("Ricochete")) {
            // segue reto e, quando bate, sorteia outra direção
            if (!sala.livre(posicao.mover(direcao))) {
                direcao = sortearDirecao();
            }
            return direcao;
        }

        return direcao;
    }

    private Direcao sortearDirecao() {
        Direcao[] direcoes = Direcao.values();
        return direcoes[random.nextInt(direcoes.length)];
    }

    public void setModo(String modo) {
        this.modo = modo;
    }

    public String getNomeDaRota() {
        return modo;
    }

    public Posicao getPosicao() {
        return posicao;
    }

    public Direcao getDirecao() {
        return direcao;
    }

    public int getPassos() {
        return passos;
    }

    public int getBatidas() {
        return batidas;
    }
}
