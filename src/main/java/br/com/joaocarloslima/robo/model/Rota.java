package br.com.joaocarloslima.robo.model;

public interface Rota {
    String getNome();

    Direcao proximaDirecao(Sala sala, Posicao atual);
}
