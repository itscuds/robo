package br.com.joaocarloslima.robo.model;

import java.util.Objects;

public class Robo {
    private Posicao posicao;
    private Direcao direcao = Direcao.DIREITA;
    private Rota rota;
    private int passos;
    private int batidas;

    public Robo(Posicao inicio, Rota rota) {
        this.posicao = Objects.requireNonNull(inicio);
        this.rota = Objects.requireNonNull(rota);
    }

    public void andar(Sala sala) {
        direcao = rota.proximaDirecao(sala, posicao);

        Posicao destino = posicao.mover(direcao);
        if (sala.livre(destino)) {
            posicao = destino;
            sala.limpar(posicao);
        } else {
            batidas++;
        }
        passos++;
    }


    public void setRota(Rota rota){
        this.rota = Objects.requireNonNull(rota);
    }

    public String getNomeDaRota() {
        return rota.getNome();
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
