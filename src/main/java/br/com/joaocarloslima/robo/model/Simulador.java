package br.com.joaocarloslima.robo.model;

import java.util.ArrayList;
import java.util.List;

public class Simulador {

    public static final int LIMITE_PASSOS = 300;

    private static final Posicao BASE = new Posicao(0, 0);

    private Sala sala = new Sala();

    private Robo robo = new Robo(BASE, new Aleatoria());

    public List<Rota> rotas() {

        return List.of(
                new Aleatoria(),
                new Ricochete(),
                new ZigueZague()
        );
    }

    public List<String> nomesDasRotas() {

        return rotas().stream()
                .map(Rota::getNome)
                .toList();
    }

    public void escolherRota(String nome) {

        Rota rotaEscolhida = rotas().stream()
                .filter(rota -> rota.getNome().equalsIgnoreCase(nome))
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException("Rota não encontrada: " + nome));

        robo.setRota(rotaEscolhida);
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

        for (Rota rota : rotas()) {

            Sala salaDoTeste = new Sala();

            Robo roboDoTeste = new Robo(BASE, rota);

            for (int i = 0; i < LIMITE_PASSOS; i++) {
                roboDoTeste.andar(salaDoTeste);
            }

            resultados.add(new Resultado(
                    rota.getNome(),
                    salaDoTeste.getPercentualLimpo(),
                    roboDoTeste.getBatidas()
            ));
        }

        return resultados;
    }

    public void reiniciar() {

        String nomeRotaAtual = robo.getNomeDaRota();

        sala = new Sala();

        escolherRotaParaNovoRobo(nomeRotaAtual);
    }

    private void escolherRotaParaNovoRobo(String nome) {

        Rota rotaAtual = rotas().stream()
                .filter(rota -> rota.getNome().equalsIgnoreCase(nome))
                .findFirst()
                .orElseGet(Aleatoria::new);

        robo = new Robo(BASE, rotaAtual);
    }

    public Sala getSala() {
        return sala;
    }

    public Robo getRobo() {
        return robo;
    }
}