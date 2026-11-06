package br.com.joaocarloslima.robo.controller;

import java.util.List;

import br.com.joaocarloslima.robo.model.Movel;
import br.com.joaocarloslima.robo.model.Posicao;
import br.com.joaocarloslima.robo.model.Sala;

public record SalaView(int largura, int altura, List<Movel> moveis, List<Posicao> sujas) {

    public static SalaView de(Sala sala) {
        return new SalaView(Sala.LARGURA, Sala.ALTURA, sala.getMoveis(), List.copyOf(sala.getSujas()));
    }
}
