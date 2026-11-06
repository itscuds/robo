package br.com.joaocarloslima.robo.model;

public class ZigueZague implements Rota {
    private Direcao horizontal = Direcao.DIREITA;
    private Direcao vertical = Direcao.BAIXO;

    @Override
    public String getNome(){
        return "Zigue-zague";
    }

    @Override
    public Direcao proximaDirecao(Sala sala, Posicao atual){
        // Mantem horizontal enquanto tem espaço
        if (sala.livre(atual.mover(horizontal))){
            return horizontal;
        }

        //Inverte Horizontal
        horizontal = inverterHorizontal(horizontal);

        if (sala.livre(atual.mover(vertical))){
            return vertical;
        }

        //Inverter Vertical
        vertical = inverterVertical(vertical);


        if (sala.livre(atual.mover(vertical))){
            return vertical;
        }

        return horizontal;
    }

    private Direcao inverterHorizontal(Direcao direcao){
        return direcao == Direcao.DIREITA ? Direcao.ESQUERDA : Direcao.DIREITA;
    }

    private Direcao inverterVertical(Direcao direcao){
        return direcao == Direcao.BAIXO ? Direcao.CIMA : Direcao.BAIXO;

    }
}
