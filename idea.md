Crea un videojoc web de simulació de Protecció Civil inspirat en la idea d'un centre de coordinació d'emergències, però molt més complet, profund i visual que un simple simulador d'ES-Alert.

## 1. CONCEPTE GENERAL

El jugador és un operador de Protecció Civil que està de guàrdia en un centre de coordinació d'emergències.

No hi ha nivells, pantalles ni missions predeterminades.

Cada partida és un TORN de diverses hores en temps accelerat (o no). Has de poder seleccionar abans de començar la durada del torn. Durant el torn, van apareixent incidències de manera dinàmica i imprevisible. El jugador rep informació, analitza les situacions, les gestiona i pren decisions.

La gràcia del joc és que mai se sap exactament què passarà.

Un torn pot ser molt tranquil o convertir-se progressivament en una situació d'emergència complexa.

El joc ha de transmetre la sensació de treballar en una autèntica sala de coordinació.

## 2. TECNOLOGIA

Ha de ser un videojoc 100% web.

Utilitza:

* HTML5
* CSS3
* JavaScript o TypeScript
* React per a la interfície si és convenient
* Vite per al desenvolupament
* SVG, Canvas o una combinació dels dos per al mapa
* Leaflet o MapLibre si es necessita un mapa interactiu

No depenguis d'un backend per a la versió inicial. La simulació pot funcionar completament al navegador amb dades generades localment.

L'arquitectura ha d'estar preparada perquè posteriorment es pugui afegir un backend, comptes d'usuari, estadístiques i més escenaris.

## 3. ESTIL VISUAL

L'estètica ha de ser moderna, professional i inspirada en un centre de coordinació d'emergències.

NO ha de semblar un videojoc infantil.

NO ha de semblar una pàgina web genèrica.

NO utilitzis una estètica excessivament futurista o de ciència-ficció.

Ha de recordar una aplicació professional de gestió d'emergències, però continuar sent atractiva i fàcil d'utilitzar.

Inspiració visual:

* centres de control
* dashboards professionals
* sistemes GIS
* sales d'emergències
* mapes tàctics
* interfícies de serveis públics

Utilitza una interfície fosca o molt neutra, amb colors funcionals:

* vermell = emergència crítica
* taronja = situació important
* groc = advertència
* blau = informació/comunicació
* verd = situació controlada
* gris = informació neutra

No abusis dels colors.

La informació important ha de destacar visualment.

Les animacions han de ser suaus i funcionals, no decoratives.

## 4. PANTALLA PRINCIPAL

La pantalla principal ha d'estar dividida en diverses zones.

### MAPA PRINCIPAL

El mapa ha de ser l'element central i ocupar la major part de la pantalla.

Ha de mostrar una representació geogràfica de Catalunya.

Ha de permetre:

* zoom
* desplaçament
* seleccionar municipis
* seleccionar incidències
* veure carreteres
* veure rius
* veure zones afectades
* activar i desactivar capes

Les incidències han d'aparèixer directament sobre el mapa.

Cada incidència ha de tenir un marcador visual segons el seu tipus i gravetat.

### PANEL DE COMUNICACIONS

Una zona lateral o inferior ha de mostrar les comunicacions entrants.

Principalment:

* trucades del 112
* avisos meteorològics
* comunicacions municipals
* comunicacions dels serveis d'emergència
* actualitzacions d'incidències
* dades de sensors i sistemes automàtics

Les noves comunicacions han d'aparèixer en temps real durant la partida.

### PANELL D'INCIDÈNCIES

Mostrar totes les incidències actives.

Cada incidència ha de mostrar:

* tipus
* ubicació
* hora d'inici
* nivell de gravetat
* última actualització
* estat
* nombre de comunicacions associades

Permet ordenar-les per:

* gravetat
* hora
* ubicació
* estat

## 5. FONTS D'INFORMACIÓ I COMUNICACIONS

El 112 és la principal manera mitjançant la qual el jugador descobreix noves incidències, però NO és l'única font d'informació.

Durant el torn, el jugador ha d'estar rebent informació de diferents organismes i sistemes, cadascun amb un tipus d'informació diferent.

### IMPORTANT: TOTA LA INFORMACIÓ ÉS VERIFICADA

El joc NO ha d'incloure:

* rumors
* notícies falses
* desinformació
* trucades deliberadament falses
* publicacions inventades que contradiguin els fets
* informació no verificada presentada com a certa

Tota la informació que aparegui al sistema és informació vàlida dins de la simulació i prové d'una font oficial o d'un sistema de detecció considerat fiable.

La dificultat NO ha de consistir a descobrir si una informació és falsa.

La dificultat consisteix a **interpretar correctament informació real, decidir què és més urgent i actuar a temps**.

### 📞 112

Principal font de detecció de noves incidències.

Pot informar de:

* accidents
* incendis
* inundacions
* persones en perill
* problemes a carreteres
* incidents urbans
* qualsevol situació detectada per la ciutadania i validada pel sistema

Quan una trucada del 112 descriu una situació nova, aquesta es converteix en una nova incidència i apareix automàticament al mapa.

Les trucades poden contenir informació parcial o poc precisa sobre la ubicació o les circumstàncies, però **no són falses**.

### 🏛️ AJUNTAMENTS I MUNICIPIS

Els ajuntaments poden enviar comunicacions directament al centre de coordinació.

Exemples:

> "Hem detectat que el nivell del riu està pujant ràpidament."

> "La policia local informa que aquesta carretera ja està inundada."

> "S'ha iniciat l'evacuació preventiva d'una zona."

> "Els serveis municipals informen d'afectacions en diversos carrers."

Aquestes comunicacions poden:

* crear noves incidències
* actualitzar incidències existents
* confirmar informació del 112
* proporcionar informació local
* informar de l'evolució d'una situació

### 🚒 BOMBERS

Els Bombers poden enviar actualitzacions sobre les actuacions i l'evolució de les emergències.

Exemples:

> "Incendi estabilitzat."

> "El foc ha avançat cap al nord."

> "Hi ha fum afectant el municipi."

> "Necessitem tallar l'accés a aquesta zona."

Aquestes comunicacions han de modificar l'estat de les incidències corresponents.

### 🚑 SERVEIS D'EMERGÈNCIES

També es poden rebre comunicacions de:

* serveis sanitaris
* policia
* Mossos d'Esquadra
* policies locals
* serveis de carreteres
* serveis de manteniment
* altres organismes d'emergència

Poden proporcionar informació nova, confirmar situacions o informar de conseqüències derivades d'una incidència.

### 🌦️ PREVISIÓ METEOROLÒGICA

El jugador ha de disposar d'un sistema de previsió meteorològica que s'actualitzi durant el torn.

Ha de mostrar informació com:

* pluja prevista
* intensitat de precipitació
* vent
* direcció del vent
* temperatura
* risc de tempestes
* previsió d'evolució meteorològica

La meteorologia no només és informació visual: **ha d'afectar realment la simulació**.

Per exemple:

Si la previsió indica una intensificació de la pluja:

→ augmenta el risc d'inundacions.

Si augmenta el vent durant un incendi:

→ augmenta la probabilitat que el foc s'estengui.

La previsió ha de permetre al jugador **anticipar-se als problemes**, no només reaccionar quan ja han passat.

### 📡 SENSORS I SISTEMES AUTOMÀTICS

Es poden rebre dades automàtiques de:

* pluviòmetres
* nivells de rius
* sensors meteorològics
* càmeres
* sensors d'infraestructures
* altres sistemes de monitorització

Exemple:

> 📡 SENSOR — Riu Besòs
>
> Nivell actual: 3,82 m
> Tendència: ↑
> Nivell d'alerta: 4,00 m

Aquesta informació pot servir per detectar una situació abans que arribin trucades al 112.

### 📻 MITJANS I INFORMACIÓ PÚBLICA

També es pot rebre informació dels mitjans de comunicació.

Aquesta informació ha de correspondre amb informació oficial ja confirmada dins de la simulació.

Els mitjans poden servir per mostrar com s'està comunicant l'emergència públicament, però no han de generar rumors ni informació falsa.

## 6. SISTEMA D'INFORMACIÓ CREUADA

Les diferents fonts d'informació han d'estar connectades.

El jugador no ha de rebre simplement una llista de missatges independents.

La informació ha de construir una imatge de la situació.

Per exemple:

09:12 — METEOROLOGIA

"Es preveuen pluges molt intenses durant els pròxims 30 minuts."

↓

09:24 — SENSOR

"El nivell del riu està augmentant ràpidament."

↓

09:31 — 112

"Ciutadà informa d'aigua acumulada en una carretera."

↓

09:34 — AJUNTAMENT

"Confirmem inundació de la carretera."

↓

09:39 — BOMBERS

"Tenim dos vehicles atrapats."

Ara el jugador té una situació completa.

La interfície ha de permetre veure fàcilment **d'on prové cada informació**.

Una mateixa situació pot estar alimentada per moltes fonts alhora.

## 7. INCIDÈNCIES DINÀMIQUES

Les incidències NO han de ser estàtiques.

Una situació pot evolucionar a partir de la informació rebuda.

Les actualitzacions poden arribar de qualsevol font:

* 112
* ajuntaments
* Bombers
* serveis sanitaris
* policia
* meteorologia
* sensors
* carreteres
* observacions
* mitjans

Per exemple:

14:20:
"Petit incendi forestal." — 112

14:35:
"El vent està augmentant." — Meteorologia

14:42:
"El foc s'apropa a una zona habitada." — Bombers

14:47:
"Es detecta fum dins del municipi." — Ajuntament

14:55:
"Es recomana preparar un possible confinament." — Protecció Civil

Així, una incidència pot anar construint-se a partir de **múltiples fonts independents**.

Una incidència pot:

* empitjorar
* millorar
* quedar estabilitzada
* generar una nova incidència
* combinar-se amb altres incidències
* afectar altres zones
* provocar noves trucades al 112
* generar noves comunicacions dels organismes implicats

## 8. CADENES D'ESDEVENIMENTS

Les emergències poden provocar altres problemes.

Exemple:

TEMPORAL
→ previsió de pluges intenses
→ inundació detectada per sensors
→ trucades al 112
→ carretera tallada
→ accident
→ vehicles atrapats
→ dificultats per arribar a un hospital
→ comunicació de l'ajuntament
→ canvi en la previsió meteorològica
→ empitjorament de la situació

Aquest sistema ha de ser una part fonamental del joc.

Les situacions no han de funcionar com esdeveniments independents.

El motor de simulació ha de poder crear cadenes d'esdeveniments i fer que **les accions del jugador i la informació rebuda afectin el que passa després**.

## 9. TIPUS D'EMERGÈNCIES

Inclou diversos tipus d'incidències.

### Meteorològiques

* pluja intensa
* tempestes
* vent fort
* inundacions
* nevades
* onatge
* calor extrema

### Incendis

* incendi forestal
* incendi urbà
* incendi industrial

### Accidents

* accident de trànsit
* accident ferroviari
* accident industrial
* accident amb múltiples vehicles

### Riscos químics

* fuita de gas
* accident amb substàncies perilloses
* núvol tòxic

### Altres

* persona desapareguda
* esfondrament
* tall important de carretera
* tall de subministrament
* incident en una infraestructura crítica

## 10. GESTIÓ DE LES INCIDÈNCIES

Quan el jugador selecciona una incidència, s'obre un panell detallat.

Ha de mostrar:

* informació disponible
* evolució temporal
* comunicacions relacionades
* mapa de la zona
* gravetat
* estat actual
* fonts que han proporcionat la informació

I ha de permetre prendre decisions.

Exemples:

* contactar amb el municipi
* sol·licitar informació
* ordenar un tall de carretera
* recomanar confinament
* recomanar evacuació
* enviar una alerta
* activar una sirena quan correspongui
* comunicar informació als mitjans
* actualitzar l'estat de la incidència

## 11. NO HI HA RECURSOS LIMITATS

No vull una mecànica basada en tenir una quantitat limitada de bombers, ambulàncies o punts de recursos.

El jugador no ha d'estar administrant diners ni "fitxes".

La seva funció és principalment:

* recopilar informació
* prioritzar
* coordinar
* comunicar
* prendre decisions

Els serveis d'emergència poden existir dins de la simulació, però el jugador no ha de jugar a repartir recursos com si fos un joc d'estratègia tradicional.

## 12. ES-ALERT

ES-Alert és només UNA de les eines disponibles.

Quan una situació ho requereixi, el jugador pot crear una alerta.

El sistema ha de permetre seleccionar:

* zona afectada
* tipus d'emergència
* instrucció
* missatge
* moment d'enviament

Exemples d'instruccions:

* confinament
* evacuació
* evitar desplaçaments
* allunyar-se d'una zona
* informació general

L'alerta ha de quedar registrada en la cronologia de la partida.

## 13. COMUNICACIÓ AMB LA POBLACIÓ

El jugador ha de poder comunicar informació a la població.

Inclou:

* ES-Alert
* comunicats públics
* informació als mitjans
* actualitzacions oficials

La comunicació ha de ser important perquè una mala comunicació pot provocar confusió.

Tota la informació comunicada públicament ha de basar-se en informació confirmada dins de la simulació.

## 14. INFORMACIÓ PÚBLICA

Durant una emergència poden aparèixer actualitzacions públiques procedents dels canals oficials.

Exemples:

> "Protecció Civil recomana evitar els desplaçaments a la zona afectada."

> "L'Ajuntament informa del tall de la carretera."

> "Els Bombers informen que l'incendi està estabilitzat."

Aquest sistema serveix per mostrar com evoluciona la comunicació pública durant l'emergència.

NO incloguis rumors, desinformació ni notícies falses.

## 15. TEMPS

El temps ha d'avançar durant la partida.

El jugador pot seleccionar velocitats com:

* 1x - velocitat real
* 2x
* 4x

Però no hauria de poder pausar indefinidament una emergència per prendre decisions sense pressió.

El pas del temps ha de ser important.

## 16. SITUACIONS IMPREVISTES

Aquest és un dels elements més importants del joc.

No hi ha d'haver una seqüència fixa.

El motor ha de generar situacions diferents a cada torn.

Exemple de torn:

08:00 — tot tranquil

08:17 — accident

08:32 — incendi petit

08:51 — pluja intensa

09:05 — inundació

09:12 — diversos avisos del 112

09:30 — carretera tallada

10:02 — nova emergència en una altra zona

10:15 — empitjorament de la inundació

Cada partida ha de ser diferent.

## 17. SISTEMA DE PROBABILITATS

Crea un motor d'esdeveniments que decideixi dinàmicament què passa.

Els esdeveniments han de dependre de:

* hora
* meteorologia
* incidències actives
* ubicació
* gravetat
* esdeveniments anteriors
* decisions del jugador

Per exemple:

Si hi ha pluja molt intensa, augmenta la probabilitat de:

* inundacions
* accidents
* carreteres tallades

Si hi ha un incendi forestal i vent fort, augmenta la probabilitat que el foc s'estengui.

## 18. CRONOLOGIA

Inclou una cronologia completa de tot el torn.

Exemple:

08:17 — Accident detectat
08:19 — Primera trucada al 112
08:23 — Incidència creada
08:31 — Carretera tallada
08:36 — Comunicació municipal
08:40 — Alerta enviada

Aquesta cronologia serà molt important per poder revisar la partida al final.

## 19. FINAL DEL TORN

Quan s'acaba el torn, mostra un informe complet.

No vull simplement "VICTÒRIA" o "DERROTA".

Mostra:

* nombre d'incidències
* incidències resoltes
* incidències que han empitjorat
* alertes enviades
* temps mitjà de resposta
* decisions importants
* comunicacions gestionades
* errors
* situacions que es podrien haver detectat abans

També mostra una reproducció del mapa durant el torn, perquè el jugador pugui veure com han anat apareixent i evolucionant les emergències.

## 20. DIFICULTAT

La dificultat no ha de venir de tenir menys recursos.

Ha de venir de:

* més incidències simultànies
* informació parcial
* situacions que evolucionen ràpidament
* moltes comunicacions simultànies
* necessitat de prioritzar
* cadenes d'esdeveniments
* situacions imprevistes

La informació que rep el jugador sempre ha de ser fiable dins de la simulació.

## 21. EXPERIÈNCIA D'USUARI

La interfície ha de ser molt clara.

El jugador ha de poder entendre ràpidament:

1. Què està passant?
2. On està passant?
3. Quina és la gravetat?
4. Quina informació tenim?
5. D'on prové la informació?
6. Què ha canviat?
7. Quines decisions pot prendre?

Evita menús profunds i innecessaris.

Les accions importants han de ser accessibles amb un o dos clics.

## 22. SO

Inclou sons subtils de centre de coordinació:

* notificació de nova trucada
* alarma d'emergència
* notificació d'una nova incidència
* comunicació rebuda
* alerta enviada
* so de ES-ALERT

El so ha de servir per avisar el jugador, no per saturar-lo.

## 23. OBJECTIU PRINCIPAL

L'objectiu no és "guanyar".

L'objectiu és gestionar el torn tan bé com sigui possible.

El jugador ha de sentir que està:

"rebent informació → interpretant-la → prenent decisions → observant les conseqüències → reaccionant a nous esdeveniments."

El joc ha de ser una simulació dinàmica, no un quiz.

## 24. IMPORTANT

Prioritza especialment aquestes quatre coses:

1. MAPA VIU
2. 112 COM A FONT PRINCIPAL DE NOVES INCIDÈNCIES
3. INCIDÈNCIES QUE EVOLUCIONEN I ES CONNECTEN ENTRE ELLES
4. SITUACIONS IMPREVISTES GENERADES DINÀMICAMENT

Aquestes quatre mecàniques han de ser el nucli del videojoc.

Construeix primer un prototip funcional amb un torn, mapa, 112, incidències dinàmiques, múltiples fonts d'informació, cronologia i sistema d'alertes. Després amplia les funcionalitats.