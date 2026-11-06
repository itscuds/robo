package br.com.joaocarloslima.robo.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.joaocarloslima.robo.model.Resultado;
import br.com.joaocarloslima.robo.model.Simulador;

// a tela 3D conversa com o Simulador por aqui (não precisa mexer)
@RestController
@RequestMapping("/api")
public class RoboApiController {

    private final Simulador simulador = new Simulador();

    @GetMapping("/sala")
    public SalaView sala() {
        return SalaView.de(simulador.getSala());
    }

    @GetMapping("/estado")
    public Estado estado() {
        return Estado.de(simulador, false);
    }

    @PostMapping("/passo")
    public Estado passo() {
        int batidasAntes = simulador.getRobo().getBatidas();
        simulador.passo();
        boolean bateu = simulador.getRobo().getBatidas() > batidasAntes;
        return Estado.de(simulador, bateu);
    }

    @GetMapping("/rotas")
    public List<String> rotas() {
        return simulador.nomesDasRotas();
    }

    @PostMapping("/rota/{nome}")
    public Estado escolherRota(@PathVariable String nome) {
        simulador.escolherRota(nome);
        return Estado.de(simulador, false);
    }

    @PostMapping("/reiniciar")
    public Estado reiniciar() {
        simulador.reiniciar();
        return Estado.de(simulador, false);
    }

    @GetMapping("/ranking")
    public List<Resultado> ranking() {
        return simulador.ranking();
    }
}
