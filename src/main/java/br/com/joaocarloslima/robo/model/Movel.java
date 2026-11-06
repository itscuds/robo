package br.com.joaocarloslima.robo.model;

public record Movel(String nome, int x, int y, int largura, int altura) {

    public boolean ocupa(Posicao posicao) {
        return posicao.x() >= x && posicao.x() < x + largura
                && posicao.y() >= y && posicao.y() < y + altura;
    }
}
