PROCICAT - CANVI D'ESTATS DEL MAPA DES DE LA CONSOLA
===================================================

Obre la pagina del joc i la consola del navegador (F12 > Console).
Els limts reals municipals i comarcals es carreguen per internet. Espera que
s'acabi la carrega abans d'executar les funcions.

Es pot comprovar l'estat de carrega amb:

  await adminStatusReady

Retorna true si les dades han carregat i false si hi ha hagut un error.

MUNICIPIS: EVACUACIONS I CONFINAMENTS
-------------------------------------

Canvia un municipi pel nom (els accents no son obligatoris) o pel codi INE de
cinc digits:

  setMunicipalityStatus("Manresa", "evacuated")
  setMunicipalityStatus("Barcelona", "confined")
  setMunicipalityStatus("Manresa", "none")

Estats admesos:

  "evacuated"   municipi en vermell
  "confined"    municipi en groc
  "none"        elimina el color i l'estat especial

També s'accepten "evacuacio", "confinament" i "cap". Per exemple:

  setMunicipalityStatus("08113", "confined")

Consulta l'estat d'un municipi:

  getMunicipalityStatus("Manresa")
  getMunicipalityStatus("08113")

Llista tots els municipis (947) i els seus estats:

  listMunicipalityStatuses()

Llista nomes els municipis evacuats o confinats:

  listMunicipalityStatuses({ affectedOnly: true })

COMARQUES: ES-ALERT
-------------------

Canvia el nivell d'una comarca pel nom (els accents no son obligatoris) o pel
codi de comarca:

  setCountyAlert("Bages", "red")
  setCountyAlert("Barcelones", "yellow")
  setCountyAlert("Bages", "none")

Nivells admesos:

  "yellow"      groc
  "orange"      taronja
  "red"         vermell
  "none"        sense avís / sense farcit

També s'accepten "groc", "taronja", "vermell" i "cap". Per exemple:

  setCountyAlert("07", "orange")

Consulta el nivell d'una comarca:

  getCountyAlert("Bages")
  getCountyAlert("07")

Llista totes les comarques (43) i els seus nivells:

  listCountyAlerts()

Llista nomes les comarques amb un nivell d'avís:

  listCountyAlerts({ affectedOnly: true })

REFLEX AL MAPA I DURADA
-----------------------

Els canvis es reflecteixen immediatament quan s'activa la capa corresponent:

  - Selecciona "Evacuacions i confinaments" per veure els municipis acolorits.
  - Selecciona "ES-Alert per comarques" per veure els nivells comarcals.

Els marcadors d'incidencies continuen visibles per sobre de les capes.
Els canvis nomes es guarden a la sessio actual del navegador; en recarregar la
pagina es recuperen els estats d'exemple inicials.

Les funcions llencen un error si el nom, el codi o el valor no es valid, o si
les dades geografiques encara no estan carregades.
