# PROCICAT

Aquest projecte és una aplicació web de front-end per a una interfície de coordinació d’emergències amb mapa interactiu. La base és una pàgina estàtica en HTML, CSS i JavaScript que carrega dades geogràfiques reals de Catalunya, representa incidències sobre un mapa i exposa una API auxiliar per consultar i manipular estats administratius des de la consola del navegador.

## Descripció general

La lògica principal es troba a `app.js` i es basa en un únic flux de renderització: inicialitzar el mapa, carregar les dades administratives, crear les capes temàtiques, construir la llista d’incidències i sincronitzar la selecció entre el panell lateral i els marcadors del mapa.

L’aplicació no utilitza un framework ni un bundler. La major part del comportament s’implementa directament amb DOM, events, Leaflet i transformació de TopoJSON. La naturalesa estàtica del projecte és intencionada: és una maqueta funcional orientada a la demostració i la iteració ràpida del concepte.

## Estructura del repositori

- `index.html`: estructura de la UI i càrrega de les dependències externes.
- `styles.css`: estil global de l’aplicació, sistema de colors, layout i components de dashboard.
- `app.js`: lògica del mapa, incidents, capes temàtiques, interaccions i API d’administració.
- `idea.md`: document de concepte i especificació funcional del projecte.
- `admin-status.txt`: guia d’ús de les funcions globals exposades a la consola per a depuració i validació.

## Arquitectura de la UI

La interfície està dividida en tres blocs principals:

1. Panell d’incidències
   - Mostra la llista d’emergències actives.
   - Cada element inclou tipus, ubicació, gravetat, hora i estat.
   - Els elements són botons que disparen la selecció d’una incidència concreta.
   - En marcar una incidència com a controlada, el seu risc i la seva gravetat baixen; la icona del mapa i la targeta reflecteixen el nou nivell.

2. Mapa principal
   - S’utilitza Leaflet per crear un mapa interactiu centrat a Catalunya.
   - La capa base utilitza rajoles d’OpenStreetMap.de amb dades d’OpenStreetMap, en lloc del servidor estàndard de rajoles d’OpenStreetMap.
   - Les incidències es representen com a marcadors amb icones customitzades segons el nivell.
   - Hi ha capes temàtiques addicionals per municipis i comarques.

3. Panell de detall
   - Apareix quan es selecciona una incidència.
   - Mostra descripció, serveis implicats, informació operativa i altres metadades.
   - El panell es sincronitza amb la selecció del mapa i de la llista.
   - L’assignació obre un formulari per triar serveis i unitats. Les incidències es tanquen automàticament després d’un termini estimat segons el tipus d’incident.

## Dades i model de domini

Les incidències es defineixen com a objectes literals en JavaScript, amb camps com:

- `id`
- `type`
- `location`
- `shortLocation`
- `severity`
- `level`
- `state`
- `time`
- `coordinates`
- `description`
- `update`
- `services`
- `calls`

Aquestes dades es carreguen a la memòria en iniciar l’aplicació i es renderitzen tant en el llistat com en el mapa. L’estat de la UI es gestiona a partir de variables globals com `selectedId`, `activeLayerName` i `markers`.

La simulació genera incidents d’escenari als municipis disponibles: accidents de trànsit i emergències sanitàries tenen el mateix pes per municipi; els incendis i accidents químics ponderen la selecció amb factors relatius de població aproximats per als principals nuclis urbans. No es generen incendis forestals en municipis on plou i la pluja redueix el risc dels focs actius a la zona afectada. La pluja segueix un model independent d’episodis variables: els fronts apareixen durant el torn, es desplacen i evolucionen en intensitat i durada. Només poden originar una incidència per episodi quan la intensitat o l’acumulació justifica una afectació, i els episodis fallits o sense afectacions no generen avisos meteorològics.

Entre els tipus que escull el generador automàtic d’escenaris, les emergències sanitàries col·lectives són molt poc freqüents: tenen un pes de 0,05, en comparació amb el pes 1 dels altres tres tipus, cosa que representa aproximadament un 1,6% d’aquestes incidències.

## Càrrega de límits administratius

Un dels punts més importants del projecte és la càrrega de dades geogràfiques reals. `loadBoundaryLayers()` fa dos `fetch` simultanis a una base remota de geometries on hi ha:

- comarques
- municipis

Les dades es reben en format JSON i es transformen mitjançant `topojson-client` per obtenir features vectorials útils.

Després es normalitzen i s’emmagatzemen en mapes indexats per:

- codi de municipi
- nom de municipi
- codi de comarca
- nom de comarca

Això permet localitzar ràpidament qualsevol entitat i valora la validació d’entrades textuals o codificades. La validació s’assegura que el nombre de geometries coincideixi amb els totals esperats:

- 43 comarques
- 947 municipis

## Capes temàtiques

El sistema incorpora una capa de comarques per a ES-Alert i una capa de radar de precipitació:

- `alert`: mostra les alertes actives per comarca i permet seleccionar-ne diverses amb el mapa. El contorn turquesa identifica la selecció; el farcit groc, taronja o vermell identifica el nivell d’una alerta activa.
- `radar`: mostra la previsió de precipitació de la simulació, inclosos els episodis que comencen o s’intensifiquen durant el torn.

### Gestió d’ES-Alert

El panell ES-Alert crea un registre independent per comarca amb identificador, nivell, tipus, missatge bilingüe, hora d’enviament i estat. En enviar a diverses comarques, es crea una alerta per cadascuna. Si una comarca ja té una alerta activa, aquesta es marca com a substituïda i es conserva a l’historial; les alertes actives de les altres comarques no canvien. Les plantilles s’obtenen de `es-alert-messages.md`; quan una categoria no té una plantilla, cal redactar el text català i castellà manualment. El so de previsualització és `sounds/es-alert-sound.mp3`; es repeteix mentre la vista de mòbil és oberta i s’atura en tancar-la, sense finalitzar l’alerta.

L’enviament redueix el risc numèric de les emergències actives del mateix tipus i comarca: 10 punts per nivell baix, 20 per mitjà i 30 per alt, amb un mínim de 0 sobre l’escala existent de 0 a 100. L’alerta vigent també s’aplica una sola vegada a cada nova emergència coincident creada mentre continua activa. La reducció màxima ja aplicada es registra per tipus d’emergència per evitar duplicats en actualitzacions o substitucions; finalitzar o substituir una alerta no canvia l’estat ni restaura el risc. Els enviaments, les substitucions i les finalitzacions queden a la cronologia d’alertes i, per a les incidències afectades, a la seva activitat.

## API global d’administració

L’aplicació exposa funcions globals a `window` per facilitar la depuració i la validació de les dades administratives:

- `setMunicipalityStatus(municipality, status)`
- `getMunicipalityStatus(municipality)`
- `listMunicipalityStatuses(options)`
- `setCountyAlert(county, level)`
- `getCountyAlert(county)`
- `listCountyAlerts(options)`

Les funcions validen noms, codis i estats acceptats i actualitzen directament les estructures internes. Els canvis es reflecteixen en la capa corresponent sense necessitat de recarregar la pàgina.

A més, `window.adminStatusReady` s’assigna al resultat de `loadBoundaryLayers()`, de manera que el codi de depuració pot esperar a la càrrega de les geometries abans d’executar consultes o modificacions.

## Estil i componentització visual

El CSS està organitzat com un sistema de dashboard de control dark-mode:

- colors de severitat i estat
- capçaleres i marques de “live”
- panells amb borders, esquemes i ombres
- badges, pills, ícones, captions i llistats

La UI no és una app de videojoc tradicional; és una maqueta d’operació de control semblant a un sistema GIS professional. Els selectors de capes, les llegendes del mapa i els estats de panell s’implementen amb classes CSS i atributs ARIA per mantenir l’accésibilitat i la coherència visual.

## Dependències externes

El projecte importa recursos externs des de CDN:

- Leaflet per a mapes interactius
- TopoJSON client per transformar geometries
- Rajoles d’OpenStreetMap.de (amb atribució a OpenStreetMap)
- Geometries administratives des d’un repositori extern de GitHub

No hi ha dependències de Node ni de package manager en la versió actual, per la qual cosa el projecte és executat directament com a pàgina web estàtica.

## Manteniment i extensió

La estructura actual és fàcil de convertir en un projecte modular si cal ampliar-lo:

- desplaçar les incidències a un fitxer JSON o servei
- separar la lògica de mapa i la lògica d’administració en mòduls
- establir un model de dades més formal per a estats i capes
- introduir persistència o API remota sense tocar la base del dashboard

El punt més crític és mantenir la sincronització entre les geometries administratives i la capes de colors, perquè la validació i la visualització depenen directament de les propietats dels feature objects.

## Conclusió

El repositori és un prototip de front-end orientat a la simulació operativa de serveis d’emergències, pensat més com a dashboard GIS que com a joc. La seva força resideix en la combinació de dades administratives reals, mapa interactiu, UI de control i API de depuració que fan possible validar les capes i les transformacions sense necessitat d’un backend.
