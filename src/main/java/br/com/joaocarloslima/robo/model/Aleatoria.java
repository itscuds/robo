package br.com.joaocarloslima.robo.model;

import java.util.Random;

public class Aleatoria implements Rota {
    private  final Random random = new Random();

    @Override
    public String getNome(){
        return "Aleatoria";

    }

    @Override
    public Direcao proximaDirecao(Sala sala, Posicao atual){
        Direcao[] direcaos = Direcao.values();

        return direcaos[random.nextInt(direcaos.length)];
    }
}
