package br.com.joaocarloslima.robo.model;

import java.util.ArrayList;
import java.util.List;

public class Simulador {
    public static final int LIMITE_PASSOS = 300; // a bateria do robô
    private static final Posicao BASE = new Posicao(0, 0);

    private Sala sala = new Sala();
    private Robo robo = new Robo(BASE, "Aleatória");

    // TODO: trocar a lista de nomes por uma lista de rotas
    private List<String> modos() {
        return List.of("Aleatória", "Ricochete");
    }

    public List<String> nomesDasRotas() {
        return modos();
    }

    public void escolherRota(String nome) {
        robo.setModo(nome);
    }

    public boolean passo() {
        if (robo.getPassos() >= LIMITE_PASSOS) {
            return false;
        }
        robo.andar(sala);
        return true;
    }

    public List<Resultado> ranking() {
        List<Resultado> resultados = new ArrayList<>();
        for (String modo : modos()) {
            Sala salaDoTeste = new Sala();
            Robo roboDoTeste = new Robo(BASE, modo);
            for (int i = 0; i < LIMITE_PASSOS; i++) {
                roboDoTeste.andar(salaDoTeste);
            }
            resultados.add(new Resultado(modo, salaDoTeste.getPercentualLimpo(), roboDoTeste.getBatidas()));
        }
        return resultados;
    }

    public void reiniciar() {
        String rotaAtual = robo.getNomeDaRota();
        sala = new Sala();
        robo = new Robo(BASE, rotaAtual);
    }

    public Sala getSala() {
        return sala;
    }

    public Robo getRobo() {
        return robo;
    }
}
