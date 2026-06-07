# SHADOW ESCAPE - RIEPILOGO FUNZIONALITÀ E PROGRESSO

## Stato Generale
Il gioco è un platformer shooter 2D in stile Steampunk con progressione a 7 livelli. È stata implementata una struttura OOP (Object Oriented Programming) solida che gestisce separatamente il Giocatore, i Nemici, il Boss e il Motore di Gioco (Engine).

## Funzionalità Implementate

### Il Personaggio (Player)
- Gestione fisica completa: gravità, attrito e collisioni con piattaforme e suolo.
- Sistema di animazione basato sulla direzione del movimento.
- UI integrata che mostra il livello attuale, gli HP rimanenti e lo stato della chiave.

### Sistema dei Nemici e Boss
- **Droni (Steam-Droids)**: Nemici volanti che pattugliano aree specifiche con un movimento oscillatorio (fluttuazione). Hanno un design con occhio rosso dinamico.
- **Mini-Boss e Final Boss**: Presenti nei livelli 3, 6 e 7. Hanno pattern di movimento verticale e sparano proiettili verso il giocatore.

### Meccaniche Avanzate
- **Combattimento Differenziato**: Introdotta la distinzione tra nemici abbattibili solo con il salto (stile platform classico) e boss abbattibili con lo sparo.
- **Logica della Chiave**: Implementato un sistema di "pulizia stanza". Il livello non può essere completato finché non viene eliminata ogni minaccia, forzando l'apparizione della chiave d'oro.
- **Ostacoli Distruttibili**: Le spine sono letali al tatto ma possono essere rimosse sparando (4 colpi).

### Ambiente e Grafica
- **Background Dinamico**: Sfondo con gradiente notturno e particelle di vapore che fluttuano verso l'alto per dare profondità.
- **Piattaforme**: Blocchi di metallo con dettagli grafici (bordi lucidi e bulloni).
- **Generazione Procedurale**: Le spine vengono generate seguendo algoritmi di distanziamento per evitare percorsi impossibili.

### Bilanciamento (Gameplay)
- Il gioco è stato tarato per essere accessibile ma sfidante: le cure sono generose (+800 HP) ma gli errori sui nemici costano caro (-200 HP).