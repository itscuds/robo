package br.com.joaocarloslima.robo.model;

import java.util.Random;


public class Ricochete implements Rota{
    private final Random random = new Random();

    private Direcao direcao = Direcao.DIREITA;

    @Override
    public String getNome(){
        return "Ricochete";
    }

    @Override
    public Direcao proximaDirecao(Sala sala, Posicao atual){
        if (!sala.livre(atual.mover(direcao))){
            Direcao[] direcoes = Direcao.values();

            direcao = direcoes[random.nextInt(direcoes.length)];

        }

        return direcao;
    }
}
