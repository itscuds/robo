package br.com.joaocarloslima.robo.model;

import java.util.ArrayList;
import java.util.List;

public class Sala {
    public static final int LARGURA = 16;
    public static final int ALTURA = 12;

    private List<Movel> moveis = List.of(
            new Movel("Rack", 5, 0, 4, 1),
            new Movel("Estante", 12, 0, 4, 1),
            new Movel("Mesa", 7, 4, 3, 3),
            new Movel("Sofá", 1, 9, 4, 2),
            new Movel("Poltrona", 13, 8, 2, 2));

    private List<Posicao> sujas = new ArrayList<>();
    private int totalLivres;

    public Sala() {
        for (int y = 0; y < ALTURA; y++) {
            for (int x = 0; x < LARGURA; x++) {
                Posicao posicao = new Posicao(x, y);
                if (livre(posicao)) {
                    sujas.add(posicao);
                    totalLivres++;
                }
            }
        }
    }

    // dentro da sala e sem móvel em cima
    public boolean livre(Posicao posicao) {
        if (posicao.x() < 0 || posicao.x() >= LARGURA || posicao.y() < 0 || posicao.y() >= ALTURA) {
            return false;
        }
        for (Movel movel : moveis) {
            if (movel.ocupa(posicao)) {
                return false;
            }
        }
        return true;
    }

    public boolean estaSuja(Posicao posicao) {
        return sujas.contains(posicao);
    }

    public void limpar(Posicao posicao) {
        sujas.remove(posicao);
    }

    public int getPercentualLimpo() {
        int limpas = totalLivres - sujas.size();
        return limpas * 100 / totalLivres;
    }

    public List<Movel> getMoveis() {
        return moveis;
    }

    public List<Posicao> getSujas() {
        return sujas;
    }
}
