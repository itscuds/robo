package br.com.joaocarloslima.robo.model;

public record Posicao(int x, int y) {

    // a posição vizinha, um passo na direção indicada
    public Posicao mover(Direcao direcao) {
        return new Posicao(x + direcao.getDx(), y + direcao.getDy());
    }
}
