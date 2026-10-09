      const incidents = [
        {
          id: "INC-2641",
          type: "Incendi forestal",
          location: "Sant Feliu de Guíxols · Baix Empordà",
          shortLocation: "Sant Feliu de Guíxols",
          severity: "Crítica",
          level: "critical",
          state: "Actuació en curs",
          time: "17:31",
          coordinates: [41.79, 3.02],
          description: "Foc de vegetació amb diversos focus actius a l’entorn de les Gavarres. El vent de garbí afavoreix la propagació cap a la zona nord.",
          update: "Bombers informen de dos flancs actius. Es treballa per protegir les masies disperses.",
          services: [["Bombers", "6 dotacions"], ["Mossos d’Esquadra", "2 patrulles"], ["SEM", "1 unitat"]],
          calls: "12 comunicacions"
        },
        {
          id: "INC-2638",
          type: "Inundació urbana",
          location: "Tarragona · Tarragonès",
          shortLocation: "Tarragona",
          severity: "Important",
          level: "high",
          state: "Seguiment",
          time: "17:24",
          coordinates: [41.1189, 1.2445],
          description: "Acumulació d’aigua en diversos punts baixos de la ciutat després de la tempesta. Afectació a la mobilitat en carrers propers al centre.",
          update: "Policia Local ha senyalitzat dos passos inundats. Pluja moderada encara activa.",
          services: [["Policia Local", "3 patrulles"], ["Bombers", "2 dotacions"], ["SEM", "Disponible"]],
          calls: "8 comunicacions"
        },
        {
          id: "INC-2634",
          type: "Accident de trànsit",
          location: "AP-7, tram de Figueres · Alt Empordà",
          shortLocation: "Figueres · AP-7",
          severity: "Important",
          level: "high",
          state: "Actuació en curs",
          time: "17:18",
          coordinates: [42.265, 2.961],
          description: "Col·lisió amb diversos vehicles al carril en sentit sud. Retencions al tram i circulació desviada per un sol carril.",
          update: "Equips d’emergència al lloc. S’està valorant l’estat de les persones implicades.",
          services: [["Mossos d’Esquadra", "2 patrulles"], ["SEM", "2 unitats"], ["Bombers", "1 dotació"]],
          calls: "6 comunicacions"
        },
        {
          id: "INC-2629",
          type: "Incendi de vegetació",
          location: "Manresa · Bages",
          shortLocation: "Manresa",
          severity: "Important",
          level: "high",
          state: "En seguiment",
          time: "17:06",
          coordinates: [41.728, 1.826],
          description: "Foc de marge amb continuïtat de vegetació a prop d’una zona industrial. Fum visible des de diversos barris.",
          update: "Perímetre contingut; els equips continuen remullant la zona afectada.",
          services: [["Bombers", "4 dotacions"], ["Policia Local", "1 patrulla"]],
          calls: "5 comunicacions"
        },
        {
          id: "INC-2623",
          type: "Avís de riuada",
          location: "Vic · Osona",
          shortLocation: "Vic",
          severity: "Seguiment",
          level: "warning",
          state: "En seguiment",
          time: "16:52",
          coordinates: [41.930, 2.254],
          description: "El cabal del riu Mèder augmenta després de les precipitacions. Sense afectacions reportades en aquest moment.",
          update: "El sensor de llera registra una tendència a l’alça. Ajuntament informat.",
          services: [["Protecció Civil", "Seguiment"], ["Policia Local", "Disponible"]],
          calls: "4 comunicacions"
        },
        {
          id: "INC-2618",
          type: "Esllavissada",
          location: "N-260, la Seu d’Urgell · Alt Urgell",
          shortLocation: "La Seu d’Urgell · N-260",
          severity: "Seguiment",
          level: "warning",
          state: "Via afectada",
          time: "16:39",
          coordinates: [42.358, 1.458],
          description: "Despreniment de roques sobre un carril de la carretera. Pas alternatiu habilitat mentre s’inspecciona el talús.",
          update: "Manteniment de carreteres i Mossos al lloc. Sense persones ferides.",
          services: [["Mossos d’Esquadra", "1 patrulla"], ["Carreteres", "1 equip"]],
          calls: "3 comunicacions"
        }
      ];

      const incidentTypeCatalog = {
        forestFire: {
          id: "forestFire",
          name: "Incendi forestal",
          icon: "🔥",
          color: "#f05252",
          defaultRisk: 62,
          spread: 0.9,
          populationRisk: 0.82,
          actionList: ["Assignar Bombers", "Establir tallafocs", "Evacuar masies pròximes"],
          summary: "Risc de propagació endèmic i intensificació per vent i sequera."
        },
        flood: {
          id: "flood",
          name: "Inundació urbana",
          icon: "🌊",
          color: "#58a9e8",
          defaultRisk: 58,
          spread: 0.72,
          populationRisk: 0.74,
          actionList: ["Activar plans de sanejament", "Tancar passos inundats", "Desviar trànsit"],
          summary: "Afectació a zones baixes amb risc de bloqueig viari i danys de serveis."
        },
        rain: {
          id: "rain",
          name: "Plujes molt intenses",
          icon: "⛈️",
          color: "#4da7d6",
          defaultRisk: 54,
          spread: 0.64,
          populationRisk: 0.68,
          actionList: ["Confirmar cabal", "Tancar zones de risc", "Mobilitzar unitats meteorològiques"],
          summary: "Aiguats locals amb risc de desbordaments i afectació de la mobilitat."
        },
        traffic: {
          id: "traffic",
          name: "Accident de trànsit greu",
          icon: "🚧",
          color: "#f49a4b",
          defaultRisk: 52,
          spread: 0.42,
          populationRisk: 0.48,
          actionList: ["Desviar trànsit", "Atendre ferits", "Tancar tram afectat"],
          summary: "Risc de retenció, col·lapse viari i atenció a víctimes."
        },
        chemical: {
          id: "chemical",
          name: "Accident químic",
          icon: "☣️",
          color: "#8d6ae5",
          defaultRisk: 68,
          spread: 0.78,
          populationRisk: 0.86,
          actionList: ["Confinar zona", "Informar a la població", "Aturar emissió"],
          summary: "Exposició potencial a substàncies perilloses i risc de confinament."
        },
        medical: {
          id: "medical",
          name: "Emergència sanitària col·lectiva",
          icon: "🚑",
          color: "#57c392",
          defaultRisk: 46,
          spread: 0.32,
          populationRisk: 0.64,
          actionList: ["Coordinar ambulàncies", "Activar centres de triatge", "Notificar a serveis sanitaris"],
          summary: "Multiplicitat de víctimes amb necessitat d’una resposta sanitària coordinada."
        }
      };

      const list = document.getElementById("incident-list");
      const workspace = document.getElementById("workspace");
      const detailPanel = document.getElementById("detail-panel");
      const map = L.map("map", {
        zoomControl: true,
        scrollWheelZoom: true,
        attributionControl: false,
        zoomSnap: 0.25
      }).setView([41.83, 1.65], 7.4);

      L.tileLayer("https://tile.openstreetmap.de/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: ""
      }).addTo(map);

      const markers = new Map();
      let selectedId = null;
      let activeThematicLayer = null;
      let activeLayerName = "incidents";
      let thematicLayers = {
        evacuations: null,
        alert: null,
        radar: null
      };

      const boundaryDataBaseUrl = "https://raw.githubusercontent.com/ArnauInes/geometries_cat_bcn_2024/main/";
      const alertLevels = new Map([
        ["Alt Empordà", "orange"],
        ["Baix Empordà", "red"],
        ["Gironès", "yellow"],
        ["Bages", "yellow"],
        ["Barcelonès", "orange"],
        ["Tarragonès", "red"]
      ]);
      const municipalityStatuses = new Map([
        ["17160", "evacuated"],
        ["43148", "confined"],
        ["08113", "confined"]
      ]);
      const alertColors = {
        yellow: "#f2d54a",
        orange: "#f49a4b",
        red: "#f05252"
      };
      const municipalityColors = {
        evacuated: "#f05252",
        confined: "#e8c35c"
      };
      let municipalityFeatures = [];
      let countyFeatures = [];
      let municipalitiesByCode = new Map();
      let municipalitiesByName = new Map();
      let countiesByCode = new Map();
      let countiesByName = new Map();
      let boundaryDataLoaded = false;

      function createRadarLayer() {
        const radarSvg = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 760">
            <defs>
              <radialGradient id="rain">
                <stop offset="0" stop-color="#f4ed55" stop-opacity=".95"/>
                <stop offset=".28" stop-color="#68e47a" stop-opacity=".88"/>
                <stop offset=".58" stop-color="#35cbd2" stop-opacity=".78"/>
                <stop offset=".82" stop-color="#4778e8" stop-opacity=".54"/>
                <stop offset="1" stop-color="#4778e8" stop-opacity="0"/>
              </radialGradient>
              <radialGradient id="storm">
                <stop offset="0" stop-color="#f4e64b" stop-opacity=".95"/>
                <stop offset=".24" stop-color="#f2973e" stop-opacity=".9"/>
                <stop offset=".46" stop-color="#e54e54" stop-opacity=".82"/>
                <stop offset=".75" stop-color="#7d4cbd" stop-opacity=".62"/>
                <stop offset="1" stop-color="#5146a4" stop-opacity="0"/>
              </radialGradient>
              <filter id="soften"><feGaussianBlur stdDeviation="10"/></filter>
              <filter id="grain">
                <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="8"/>
                <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .22 0"/>
              </filter>
            </defs>
            <g filter="url(#soften)">
              <ellipse cx="270" cy="340" rx="150" ry="105" fill="url(#rain)" transform="rotate(-24 270 340)"/>
              <ellipse cx="520" cy="305" rx="210" ry="135" fill="url(#storm)" transform="rotate(-18 520 305)"/>
              <ellipse cx="725" cy="425" rx="180" ry="115" fill="url(#rain)" transform="rotate(25 725 425)"/>
              <ellipse cx="420" cy="555" rx="130" ry="85" fill="url(#rain)" transform="rotate(-8 420 555)"/>
              <path d="M130 370c92-105 130 25 205-33s125-93 218-35 123 4 255 44" fill="none" stroke="#73e989" stroke-width="34" stroke-linecap="round" opacity=".7"/>
              <path d="M390 290c54-67 101 48 159-11s89-15 149 18" fill="none" stroke="#f0cf4b" stroke-width="23" stroke-linecap="round" opacity=".8"/>
            </g>
            <rect width="100%" height="100%" filter="url(#grain)" opacity=".13"/>
          </svg>`;
        const image = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(radarSvg)}`;
        return L.imageOverlay(image, [[40.45, 0.05], [43.12, 3.65]], {
          opacity: 0.78,
          interactive: false
        });
      }

      thematicLayers.radar = createRadarLayer();

      function uniqueTopologyFeatures(topology, objectName, propertyName) {
        const geometryCollection = topology.objects[objectName];
        if (!geometryCollection || geometryCollection.type !== "GeometryCollection") {
          throw new Error(`No s’ha trobat la col·lecció geogràfica "${objectName}".`);
        }
        const seen = new Set();
        const geometries = geometryCollection.geometries.filter(geometry => {
          const code = geometry.properties[propertyName];
          if (!code || seen.has(code)) return false;
          seen.add(code);
          return true;
        });
        return topojson.feature(topology, {
          ...geometryCollection,
          geometries
        }).features;
      }

      function evacuationStyle(feature) {
        const status = municipalityStatuses.get(feature.properties.codi_municipi_5);
        const color = municipalityColors[status];
        return {
          color,
          weight: 2,
          opacity: 1,
          fillColor: color,
          fillOpacity: 0.42
        };
      }

      function createEvacuationLayer() {
        return L.geoJSON([], { style: evacuationStyle });
      }

      function refreshEvacuationLayer() {
        const layer = thematicLayers.evacuations;
        if (!layer) return;
        layer.clearLayers();
        municipalityFeatures.forEach(feature => {
          if (municipalityStatuses.has(feature.properties.codi_municipi_5)) {
            layer.addData(feature);
          }
        });
      }

      function countyStyle(feature) {
        const level = alertLevels.get(feature.properties.nom_comarca);
        const color = level ? alertColors[level] : "#73838a";
        return {
          color,
          weight: 1.4,
          opacity: level ? 0.95 : 0.7,
          fillColor: color,
          fillOpacity: level ? 0.36 : 0
        };
      }

      function createAlertLayer(features) {
        return L.geoJSON(features, { style: countyStyle });
      }

      function normalizeAdministrativeName(value) {
        return String(value).trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("ca");
      }

      function requireBoundaryData() {
        if (!boundaryDataLoaded) {
          throw new Error("Els límits encara s’estan carregant. Torna-ho a provar en uns segons.");
        }
      }

      function findAdministrativeFeature(value, byCode, byName, kind) {
        requireBoundaryData();
        if (typeof value !== "string" || !value.trim()) {
          throw new TypeError(`Indica el nom o el codi del ${kind}.`);
        }
        const feature = byCode.get(value.trim()) || byName.get(normalizeAdministrativeName(value));
        if (!feature) {
          throw new RangeError(`No s’ha trobat el ${kind} "${value}". Consulta els noms amb listMunicipalityStatuses() o listCountyAlerts().`);
        }
        return feature;
      }

      function getMunicipalityStatus(municipality) {
        const feature = findAdministrativeFeature(municipality, municipalitiesByCode, municipalitiesByName, "municipi");
        const code = feature.properties.codi_municipi_5;
        return {
          name: feature.properties.nom_municipi,
          code,
          county: feature.properties.nom_comarca,
          status: municipalityStatuses.get(code) || "none"
        };
      }

      function setMunicipalityStatus(municipality, status) {
        const feature = findAdministrativeFeature(municipality, municipalitiesByCode, municipalitiesByName, "municipi");
        const normalizedStatus = status == null || status === "" ? "none" : normalizeAdministrativeName(status);
        const validStatuses = {
          evacuated: "evacuated",
          evacuacio: "evacuated",
          confined: "confined",
          confinament: "confined",
          none: "none",
          cap: "none"
        };
        const nextStatus = validStatuses[normalizedStatus];
        if (!nextStatus) {
          throw new RangeError('Estat no vàlid. Utilitza "evacuated", "confined" o "none".');
        }
        const code = feature.properties.codi_municipi_5;
        if (nextStatus === "none") municipalityStatuses.delete(code);
        else municipalityStatuses.set(code, nextStatus);
        refreshEvacuationLayer();
        return getMunicipalityStatus(code);
      }

      function listMunicipalityStatuses(options = {}) {
        requireBoundaryData();
        const affectedOnly = options.affectedOnly === true;
        return municipalityFeatures
          .filter(feature => !affectedOnly || municipalityStatuses.has(feature.properties.codi_municipi_5))
          .map(feature => getMunicipalityStatus(feature.properties.codi_municipi_5));
      }

      function getCountyAlert(county) {
        const feature = findAdministrativeFeature(county, countiesByCode, countiesByName, "comarca");
        return {
          name: feature.properties.nom_comarca,
          code: feature.properties.codi_comarca,
          level: alertLevels.get(feature.properties.nom_comarca) || "none"
        };
      }

      function setCountyAlert(county, level) {
        const feature = findAdministrativeFeature(county, countiesByCode, countiesByName, "comarca");
        const normalizedLevel = level == null || level === "" ? "none" : normalizeAdministrativeName(level);
        const validLevels = {
          yellow: "yellow",
          groc: "yellow",
          orange: "orange",
          taronja: "orange",
          red: "red",
          vermell: "red",
          none: "none",
          cap: "none"
        };
        const nextLevel = validLevels[normalizedLevel];
        if (!nextLevel) {
          throw new RangeError('Nivell no vàlid. Utilitza "yellow", "orange", "red" o "none".');
        }
        const name = feature.properties.nom_comarca;
        if (nextLevel === "none") alertLevels.delete(name);
        else alertLevels.set(name, nextLevel);
        thematicLayers.alert.setStyle(countyStyle);
        return getCountyAlert(feature.properties.codi_comarca);
      }

      function listCountyAlerts(options = {}) {
        requireBoundaryData();
        const affectedOnly = options.affectedOnly === true;
        return countyFeatures
          .filter(feature => !affectedOnly || alertLevels.has(feature.properties.nom_comarca))
          .map(feature => getCountyAlert(feature.properties.codi_comarca));
      }

      Object.assign(window, {
        setMunicipalityStatus,
        getMunicipalityStatus,
        listMunicipalityStatuses,
        setCountyAlert,
        getCountyAlert,
        listCountyAlerts
      });

      async function loadBoundaryLayers() {
        const status = document.getElementById("map-data-status");
        try {
          const [countyResponse, municipalityResponse] = await Promise.all([
            fetch(`${boundaryDataBaseUrl}dts_comarques_cat_2025.json`),
            fetch(`${boundaryDataBaseUrl}dts_municipis_cat_2025.json`)
          ]);
          if (!countyResponse.ok || !municipalityResponse.ok) {
            throw new Error(`El servidor de límits geogràfics ha respost ${countyResponse.status}/${municipalityResponse.status}.`);
          }
          if (typeof topojson === "undefined") {
            throw new Error("No s’ha pogut carregar el lector de geometries geogràfiques.");
          }

          const [countyTopology, municipalityTopology] = await Promise.all([
            countyResponse.json(),
            municipalityResponse.json()
          ]);
          const loadedCountyFeatures = uniqueTopologyFeatures(
            countyTopology,
            "dts_comarques_cat_2025",
            "codi_comarca"
          );
          const loadedMunicipalityFeatures = uniqueTopologyFeatures(
            municipalityTopology,
            "dts_municipis_cat_2025",
            "codi_municipi_5"
          );
          if (loadedCountyFeatures.length !== 43 || loadedMunicipalityFeatures.length !== 947) {
            throw new Error(`S’esperaven 43 comarques i 947 municipis; s’han rebut ${loadedCountyFeatures.length} i ${loadedMunicipalityFeatures.length}.`);
          }
          countyFeatures = loadedCountyFeatures;
          municipalityFeatures = loadedMunicipalityFeatures;
          municipalitiesByCode = new Map(municipalityFeatures.map(feature => [
            feature.properties.codi_municipi_5,
            feature
          ]));
          municipalitiesByName = new Map(municipalityFeatures.map(feature => [
            normalizeAdministrativeName(feature.properties.nom_municipi),
            feature
          ]));
          countiesByCode = new Map(countyFeatures.map(feature => [
            feature.properties.codi_comarca,
            feature
          ]));
          countiesByName = new Map(countyFeatures.map(feature => [
            normalizeAdministrativeName(feature.properties.nom_comarca),
            feature
          ]));
          thematicLayers.evacuations = createEvacuationLayer();
          thematicLayers.alert = createAlertLayer(countyFeatures);
          boundaryDataLoaded = true;
          refreshEvacuationLayer();

          status.hidden = true;
          status.classList.remove("error");
          if (activeLayerName !== "incidents") {
            setActiveLayer(activeLayerName);
          }
          return true;
        } catch (error) {
          console.error("No s’han pogut carregar els límits municipals i comarcals.", error);
          status.textContent = "No s’han pogut carregar els límits reals. Comprova la connexió i torna a carregar la pàgina.";
          status.classList.add("error");
          status.hidden = false;
          return false;
        }
      }

      function markerIcon(incident, selected) {
        const color = incident.level === "critical" ? "#f05252"
          : incident.level === "high" ? "#f49a4b" : "#d4ad3f";
        return L.divIcon({
          className: "",
          html: `<div class="incident-marker${selected ? " selected" : ""}" style="--marker-color:${color}"><span>!</span></div>`,
          iconSize: [32, 38],
          iconAnchor: [16, 32]
        });
      }

      function setActiveLayer(layerName) {
        activeLayerName = layerName;
        if (activeThematicLayer) activeThematicLayer.removeFrom(map);
        activeThematicLayer = thematicLayers[layerName] || null;
        if (activeThematicLayer) activeThematicLayer.addTo(map);

        document.querySelectorAll("[data-layer]").forEach(button => {
          const isSelected = button.dataset.layer === layerName;
          button.classList.toggle("selected", button.classList.contains("layer-option") && isSelected);
          button.classList.toggle("active", button.classList.contains("map-tool") && isSelected);
          button.setAttribute("aria-pressed", String(isSelected));
        });

        if (layerName === "evacuations") {
          document.getElementById("map-legend").innerHTML = `
            <span class="map-legend-caption">Municipis afectats · contorn municipal real</span>
            <span class="map-legend-item"><span class="legend-dot evacuated"></span> Evacuació</span>
            <span class="map-legend-item"><span class="legend-dot confined"></span> Confinament</span>`;
        } else if (layerName === "alert") {
          document.getElementById("map-legend").innerHTML = `
            <span class="map-legend-caption">ES-Alert · totes les comarques (dades de mostra)</span>
            <span class="map-legend-item"><span class="legend-dot alert-yellow"></span> Groc</span>
            <span class="map-legend-item"><span class="legend-dot alert-orange"></span> Taronja</span>
            <span class="map-legend-item"><span class="legend-dot alert-red"></span> Vermell</span>
            <span class="map-legend-item"><span class="legend-dot alert-none"></span> Sense avís</span>`;
        } else if (layerName === "radar") {
          document.getElementById("map-legend").innerHTML = `
            <span class="map-legend-caption">Radar de precipitació · simulació inventada</span>
            <span class="map-legend-item"><span class="legend-dot rain-light"></span> Feble</span>
            <span class="map-legend-item"><span class="legend-dot rain-moderate"></span> Moderada</span>
            <span class="map-legend-item"><span class="legend-dot rain-heavy"></span> Forta</span>
            <span class="map-legend-item"><span class="legend-dot rain-storm"></span> Tempesta</span>`;
        } else {
          document.getElementById("map-legend").innerHTML = `
            <span class="map-legend-caption">Incidències actives</span>
            <span class="map-legend-item"><span class="legend-dot"></span> Crítica</span>
            <span class="map-legend-item"><span class="legend-dot high"></span> Important</span>
            <span class="map-legend-item"><span class="legend-dot warning"></span> Seguiment</span>`;
        }

      }

      function renderIncidentList() {
        for (const incident of incidents) {
          const button = document.createElement("button");
          button.className = "incident-card";
          button.type = "button";
          button.dataset.id = incident.id;
          button.setAttribute("aria-pressed", "false");
          const stateClass = incident.state === "En seguiment" ? "controlled" : "";
          button.innerHTML = `
            <span class="incident-topline">
              <span class="incident-kind">${incident.type}</span>
              <span class="severity ${incident.level === "critical" ? "" : incident.level}">
                <span class="severity-dot"></span>${incident.severity}
              </span>
            </span>
            <span class="incident-location">${incident.shortLocation}</span>
            <span class="incident-meta">
              <span class="incident-state ${stateClass}">${incident.state}</span>
              <span>${incident.time}</span>
            </span>`;
          button.addEventListener("click", () => selectIncident(incident.id, true));
          list.append(button);
        }
      }

      function renderDetail(incident) {
        document.getElementById("detail-title").textContent = incident.type;
        const serviceRows = incident.services.map(([name, count]) => `
          <div class="info-row">
            <span class="resource-name">
              <span class="resource-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M4 19h16M6 19V8l6-4 6 4v11M9 11h.01M15 11h.01M9 15h.01M15 15h.01" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>${name}
            </span>
            <span class="resource-count">${count}</span>
          </div>`).join("");
        document.getElementById("detail-content").innerHTML = `
          <section class="detail-summary">
            <div class="detail-status-row">
              <span class="status-pill">${incident.state}</span>
              <span class="detail-id">${incident.id}</span>
            </div>
            <p class="detail-description">${incident.description}</p>
            <div class="detail-actions" aria-label="Actuacions previstes, no disponibles en aquesta maqueta">
              <button class="action-button primary" type="button" disabled>Assignar recursos</button>
              <button class="action-button" type="button" disabled>Enviar comunicat</button>
              <button class="action-button" type="button" disabled>Actualitzar estat</button>
              <button class="action-button" type="button" disabled>Registrar actuació</button>
            </div>
          </section>
          <section class="detail-section">
            <h3 class="detail-section-title">Informació de l’incident</h3>
            <div class="info-grid">
              <div><span class="info-label">Municipi / zona</span><span class="info-value">${incident.shortLocation}</span></div>
              <div><span class="info-label">Hora d’inici</span><span class="info-value">${incident.time} · Avui</span></div>
              <div><span class="info-label">Gravetat</span><span class="info-value">${incident.severity}</span></div>
              <div><span class="info-label">Comunicacions</span><span class="info-value">${incident.calls.split(" ")[0]} rebudes</span></div>
            </div>
          </section>
          <section class="detail-section">
            <h3 class="detail-section-title">Serveis mobilitzats <span class="section-trailing">${incident.services.length} organismes</span></h3>
            <div class="resource-list">${serviceRows}</div>
          </section>
          <section class="detail-section">
            <h3 class="detail-section-title">Activitat recent <span class="section-trailing">${incident.calls}</span></h3>
            <div class="timeline">
              <div class="timeline-item">
                <span class="timeline-time">${incident.time} · Actualització operativa</span>
                <p class="timeline-copy">${incident.update}</p>
              </div>
              <div class="timeline-item">
                <span class="timeline-time">${incident.time} · Avís rebut</span>
                <p class="timeline-copy">Incidència comunicada al centre de coordinació. Ubicació confirmada.</p>
              </div>
            </div>
          </section>`;
      }

      function selectIncident(id, moveMap) {
        const incident = incidents.find(item => item.id === id);
        if (!incident) return;
        selectedId = id;
        workspace.classList.add("detail-open");
        detailPanel.setAttribute("aria-hidden", "false");
        detailPanel.inert = false;
        renderDetail(incident);
        document.querySelectorAll(".incident-card").forEach(card => {
          card.setAttribute("aria-pressed", String(card.dataset.id === id));
        });
        for (const item of incidents) {
          const marker = markers.get(item.id);
          marker.setIcon(markerIcon(item, item.id === id));
          if (item.id === id) marker.setZIndexOffset(1000);
          else marker.setZIndexOffset(0);
        }
        if (moveMap) map.flyTo(incident.coordinates, Math.max(map.getZoom(), 8), { duration: 0.45 });
        window.setTimeout(() => map.invalidateSize({ pan: false }), 240);
      }

      function closeDetail() {
        selectedId = null;
        workspace.classList.remove("detail-open");
        detailPanel.setAttribute("aria-hidden", "true");
        detailPanel.inert = true;
        document.querySelectorAll(".incident-card").forEach(card => card.setAttribute("aria-pressed", "false"));
        for (const incident of incidents) {
          markers.get(incident.id).setIcon(markerIcon(incident, false));
          markers.get(incident.id).setZIndexOffset(0);
        }
        window.setTimeout(() => map.invalidateSize({ pan: false }), 240);
      }

      renderIncidentList();
      incidents.forEach(incident => {
        const marker = L.marker(incident.coordinates, { icon: markerIcon(incident, false) }).addTo(map);
        marker.bindTooltip(`${incident.type} · ${incident.shortLocation}`, { direction: "top", offset: [0, -22] });
        marker.on("click", () => {
          selectIncident(incident.id, false);
          document.querySelector(`[data-id="${incident.id}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
        });
        markers.set(incident.id, marker);
      });
      document.getElementById("close-detail").addEventListener("click", closeDetail);
      window.addEventListener("resize", () => map.invalidateSize({ pan: false }));
      const layersToggle = document.getElementById("layers-toggle");
      const layerMenu = document.getElementById("layer-menu");
      layersToggle.addEventListener("click", event => {
        event.stopPropagation();
        const isOpen = layersToggle.getAttribute("aria-expanded") === "true";
        layersToggle.setAttribute("aria-expanded", String(!isOpen));
        layerMenu.hidden = isOpen;
      });
      layerMenu.addEventListener("click", event => event.stopPropagation());
      document.querySelectorAll(".layer-option, .map-tool[data-layer]").forEach(button => {
        button.addEventListener("click", event => {
          event.stopPropagation();
          setActiveLayer(button.dataset.layer);
          layerMenu.hidden = true;
          layersToggle.setAttribute("aria-expanded", "false");
        });
      });
      document.addEventListener("click", event => {
        if (!event.target.closest(".map-toolbar")) {
          layerMenu.hidden = true;
          layersToggle.setAttribute("aria-expanded", "false");
        }
      });
      document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !layerMenu.hidden) {
          layerMenu.hidden = true;
          layersToggle.setAttribute("aria-expanded", "false");
          layersToggle.focus();
        }
      });
      map.on("click", event => {
        if (selectedId && !event.originalEvent.target.closest(".leaflet-marker-icon")) closeDetail();
      });
      window.adminStatusReady = loadBoundaryLayers();

      const simulationStyles = document.createElement("style");
      simulationStyles.textContent = `
        .simulator-toolbar {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 4px 6px;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          background: rgba(19, 31, 40, 0.98);
        }
        .simulator-button {
          min-width: 76px;
          height: 28px;
          padding: 0 10px;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          background: rgba(36, 53, 64, 0.95);
          color: #dfeaf0;
          cursor: pointer;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .04em;
          text-transform: uppercase;
        }
        .simulator-button.primary {
          border-color: rgba(86, 181, 168, 0.4);
          background: rgba(31, 84, 74, 0.9);
          color: #d4fff2;
        }
        .simulator-speed {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0 6px 0 0;
          color: var(--color-text-muted);
          font-size: 9px;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .simulator-speed select {
          min-width: 58px;
          height: 24px;
          border: 1px solid var(--color-border);
          border-radius: 5px;
          background: rgba(13, 20, 27, 0.9);
          color: #edf3f5;
          font-size: 10px;
          padding: 0 6px;
        }
        .simulator-clock {
          display: inline-flex;
          align-items: center;
          padding-left: 12px;
          border-left: 1px solid var(--color-border);
          color: #dfeaf0;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .04em;
          text-transform: uppercase;
        }
        .event-feed {
          border-top: 1px solid var(--color-border);
          background: rgba(18, 29, 38, 0.7);
        }
        .event-feed .list-caption {
          padding-top: 10px;
        }
        .event-list {
          display: grid;
          gap: 8px;
          padding: 0 12px 14px;
        }
        .event-item {
          padding: 9px 10px;
          border: 1px solid rgba(86, 181, 168, 0.18);
          border-radius: 7px;
          background: rgba(27, 42, 49, 0.76);
        }
        .event-item strong {
          display: block;
          margin-bottom: 4px;
          color: #dfeaf0;
          font-size: 10px;
          letter-spacing: .06em;
          text-transform: uppercase;
        }
        .event-item span {
          display: block;
          color: var(--color-text-muted);
          font-size: 10px;
          line-height: 1.45;
        }
        .event-item small {
          display: block;
          margin-top: 4px;
          color: var(--color-text-subtle);
          font-size: 9px;
          letter-spacing: .04em;
          text-transform: uppercase;
        }
      `;
      document.head.appendChild(simulationStyles);

      function setupSimulationUI() {
        const statusBar = document.querySelector(".topbar-status");
        if (!statusBar || statusBar.dataset.simulatorInjected === "true") return;
        statusBar.dataset.simulatorInjected = "true";

        const controls = document.createElement("div");
        controls.className = "simulator-toolbar";
        controls.innerHTML = `
          <button id="toggle-sim" class="simulator-button primary" type="button">Iniciar</button>
          <button id="pause-sim" class="simulator-button" type="button">Pausa</button>
          <label class="simulator-speed">
            <span>Velocitat</span>
            <select id="sim-speed" aria-label="Velocitat de simulació">
              <option value="1">1x</option>
              <option value="2">2x</option>
              <option value="5">5x</option>
              <option value="10">10x</option>
            </select>
          </label>
        `;
        const clock = document.createElement("span");
        clock.id = "sim-clock";
        clock.className = "simulator-clock";
        clock.textContent = "Divendres, 17:42";

        const tools = statusBar.querySelector(".topbar-tools");
        if (tools) statusBar.insertBefore(controls, tools);
        else statusBar.appendChild(controls);
        statusBar.appendChild(clock);

        const toggleButton = document.getElementById("toggle-sim");
        const pauseButton = document.getElementById("pause-sim");
        const speedSelect = document.getElementById("sim-speed");
        toggleButton.addEventListener("click", () => {
          if (!simulation.started) startSimulation();
          else stopSimulation();
        });
        pauseButton.addEventListener("click", () => {
          if (!simulation.started) return;
          if (simulation.running) pauseSimulation();
          else resumeSimulation();
        });
        speedSelect.addEventListener("change", event => {
          const nextValue = Number(event.target.value);
          setSimulationSpeed(nextValue);
        });
      }

      function ensureEventFeed() {
        const panel = document.querySelector(".incident-panel");
        if (!panel || panel.querySelector(".event-feed")) return;
        const feed = document.createElement("div");
        feed.className = "event-feed";
        feed.innerHTML = `
          <div class="list-caption">Registre operatiu</div>
          <div class="event-list" id="event-list"></div>
        `;
        const incidentList = panel.querySelector(".incident-list");
        incidentList.after(feed);
      }

      const simulation = {
        started: false,
        running: false,
        paused: false,
        speed: 1,
        speedRates: { 1: 1, 2: 2, 5: 60, 10: 360 },
        lastFrame: 0,
        animationFrame: 0,
        gameTime: Date.now(),
        lastGeneratedIncidentAt: Date.now(),
        events: []
      };

      function formatSimulationClock(timestamp = simulation.gameTime) {
        const date = new Date(timestamp);
        const weekday = new Intl.DateTimeFormat("ca-ES", { weekday: "long" }).format(date);
        const hour = new Intl.DateTimeFormat("ca-ES", { hour: "2-digit", minute: "2-digit" }).format(date);
        return `${capitalizeWord(weekday)}, ${hour}`;
      }

      function capitalizeWord(value) {
        return value.charAt(0).toUpperCase() + value.slice(1);
      }

      function updateSimulationClock() {
        const clock = document.getElementById("sim-clock");
        if (clock) {
          clock.textContent = formatSimulationClock();
        }
      }

      function recordSimulationEvent(title, description, incidentId = null) {
        const event = {
          id: `EV-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
          title,
          description,
          incidentId,
          timestamp: simulation.gameTime
        };
        const last = simulation.events[0];
        if (last && last.title === title && last.description === description) {
          return;
        }
        simulation.events.unshift(event);
        simulation.events = simulation.events.slice(0, 12);
        renderSimulationEvents();
        const status = document.getElementById("map-data-status");
        if (status) {
          status.textContent = description;
          status.hidden = false;
          status.classList.remove("error");
        }
      }

      function renderSimulationEvents() {
        const feed = document.getElementById("event-list");
        if (!feed) return;
        feed.innerHTML = simulation.events.slice(0, 6).map(event => `
          <div class="event-item">
            <strong>${event.title}</strong>
            <span>${event.description}</span>
            <small>${formatSimulationClock(event.timestamp)}</small>
          </div>
        `).join("");
      }

      function setSimulationSpeed(value) {
        const normalized = Number(value) || 1;
        simulation.speed = normalized;
        if (simulation.started) {
          recordSimulationEvent("Velocitat de simulació", `Temps del joc accelerat a ${normalized}x.`, null);
        }
      }

      function resolveIncidentType(type) {
        const input = String(type || "").toLowerCase();
        const candidates = Object.values(incidentTypeCatalog);
        const directMatch = candidates.find(entry => {
          return input.includes(entry.name.toLowerCase().replace(/[^a-z]/g, "")) || input.includes(entry.id.toLowerCase());
        });
        if (directMatch) return directMatch;
        if (input.includes("incendi")) return incidentTypeCatalog.forestFire;
        if (input.includes("inund") || input.includes("riuada") || input.includes("riu")) return incidentTypeCatalog.flood;
        if (input.includes("pluja") || input.includes("tempest")) return incidentTypeCatalog.rain;
        if (input.includes("tr\xe0nsit") || input.includes("accident") && input.includes("carretera")) return incidentTypeCatalog.traffic;
        if (input.includes("qu\xedmic") || input.includes("quimic")) return incidentTypeCatalog.chemical;
        if (input.includes("sanit") || input.includes("hospital")) return incidentTypeCatalog.medical;
        return incidentTypeCatalog.forestFire;
      }

      function normalizeIncidentType(type) {
        return resolveIncidentType(type).id;
      }

      function hydrateIncident(incident) {
        if (incident._hydrated) return incident;
        const meta = resolveIncidentType(incident.type);
        incident.typeKey = normalizeIncidentType(incident.type);
        incident.typeMeta = meta;
        incident.icon = incident.icon || meta.icon;
        incident.color = incident.color || meta.color;
        incident.risk = typeof incident.risk === "number" ? incident.risk : (incident.typeMeta?.defaultRisk || 52);
        incident.priority = typeof incident.priority === "number" ? incident.priority : 3;
        incident.history = Array.isArray(incident.history) ? incident.history : [{ time: formatSimulationClock(), text: "Incidència detectada." }];
        incident.resourcesAssigned = Number(incident.resourcesAssigned || 0);
        incident.populationRisk = typeof incident.populationRisk === "number" ? incident.populationRisk : (meta.populationRisk * 100);
        incident.consequences = incident.consequences || [meta.summary, "Risc de desbordament operatiu si no es limita la propagació."];
        incident.actions = Array.isArray(incident.actions) ? incident.actions : meta.actionList;
        incident._hydrated = true;
        return incident;
      }

      function getSeverityFromRisk(risk) {
        if (risk >= 85) return { severity: "Crítica", level: "critical" };
        if (risk >= 60) return { severity: "Important", level: "high" };
        if (risk >= 35) return { severity: "Seguiment", level: "warning" };
        if (risk >= 18) return { severity: "Baixa", level: "moderate" };
        return { severity: "Molt baixa", level: "low" };
      }

      function ensureIncidentState(incident) {
        if (!incident.state || incident.state === "") incident.state = "Detectat";
      }

      function sanitizeIncidentDescription(incident) {
        return incident.description || "Incidència gestionada pel centre de coordinació.";
      }

      function isIncidentResolved(incident) {
        return !!incident && /resol|tancat/i.test(String(incident.state || ""));
      }

      function getActiveIncidents() {
        return incidents.filter(incident => !isIncidentResolved(incident));
      }

      function refreshIncidentList() {
        const activeIncidents = getActiveIncidents();
        const countBadge = document.querySelector(".count-badge");
        if (countBadge) {
          countBadge.textContent = String(activeIncidents.length);
          countBadge.setAttribute("aria-label", `${activeIncidents.length} emergències`);
        }

        list.innerHTML = "";
        for (const incident of activeIncidents) {
          hydrateIncident(incident);
          const button = document.createElement("button");
          button.className = "incident-card";
          button.type = "button";
          button.dataset.id = incident.id;
          button.setAttribute("aria-pressed", String(selectedId === incident.id));
          const stateClass = /control|tancat|resol/i.test(incident.state) ? "controlled" : "";
          button.innerHTML = `
            <span class="incident-topline">
              <span class="incident-kind">${incident.type}</span>
              <span class="severity ${incident.level === "critical" ? "" : incident.level}">
                <span class="severity-dot"></span>${incident.severity || getSeverityFromRisk(incident.risk).severity}
              </span>
            </span>
            <span class="incident-location">${incident.shortLocation}</span>
            <span class="incident-meta">
              <span class="incident-state ${stateClass}">${incident.state}</span>
              <span>${incident.time || formatSimulationClock()}</span>
            </span>`;
          button.addEventListener("click", () => selectIncident(incident.id, true));
          list.append(button);
        }
      }

      function renderDetail(incident) {
        const currentIncident = incident || incidents.find(item => item.id === selectedId);
        if (!currentIncident) return;
        hydrateIncident(currentIncident);
        const serviceRows = (currentIncident.services || []).map(([name, count]) => `
          <div class="info-row">
            <span class="resource-name">
              <span class="resource-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M4 19h16M6 19V8l6-4 6 4v11M9 11h.01M15 11h.01M9 15h.01M15 15h.01" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>${name}
            </span>
            <span class="resource-count">${count}</span>
          </div>`).join("");

        const actionMarkup = `
          <button class="action-button primary" data-action="assign" type="button">Assignar recursos</button>
          <button class="action-button" data-action="observe" type="button">Registrar observació</button>
          <button class="action-button" data-action="control" type="button">Marcar controlat</button>
          <button class="action-button" data-action="resolve" type="button">Resoldre</button>
        `;

        document.getElementById("detail-title").textContent = currentIncident.type;
        document.getElementById("detail-content").innerHTML = `
          <section class="detail-summary">
            <div class="detail-status-row">
              <span class="status-pill">${currentIncident.state}</span>
              <span class="detail-id">${currentIncident.id}</span>
            </div>
            <p class="detail-description">${sanitizeIncidentDescription(currentIncident)}</p>
            <div class="detail-actions" aria-label="Accions de coordinació">
              ${actionMarkup}
            </div>
          </section>
          <section class="detail-section">
            <h3 class="detail-section-title">Informació de l’incident</h3>
            <div class="info-grid">
              <div><span class="info-label">Municipi / zona</span><span class="info-value">${currentIncident.shortLocation}</span></div>
              <div><span class="info-label">Hora d’inici</span><span class="info-value">${currentIncident.time || formatSimulationClock()} · Simulació</span></div>
              <div><span class="info-label">Gravetat</span><span class="info-value">${currentIncident.severity || getSeverityFromRisk(currentIncident.risk).severity}</span></div>
              <div><span class="info-label">Risc població</span><span class="info-value">${Math.round(currentIncident.risk || 52)}%</span></div>
            </div>
          </section>
          <section class="detail-section">
            <h3 class="detail-section-title">Serveis mobilitzats <span class="section-trailing">${(currentIncident.services || []).length} organismes</span></h3>
            <div class="resource-list">${serviceRows}</div>
          </section>
          <section class="detail-section">
            <h3 class="detail-section-title">Activitat recent <span class="section-trailing">${currentIncident.calls || "1 comunicació"}</span></h3>
            <div class="timeline">
              <div class="timeline-item">
                <span class="timeline-time">${currentIncident.time || formatSimulationClock()} · Actualització</span>
                <p class="timeline-copy">${currentIncident.update || "Incidència gestionada pel centre de coordinació."}</p>
              </div>
              ${(currentIncident.history || []).slice(0, 3).map(entry => `
                <div class="timeline-item">
                  <span class="timeline-time">${entry.time || formatSimulationClock()} · Historial</span>
                  <p class="timeline-copy">${entry.text}</p>
                </div>
              `).join("")}
            </div>
          </section>`;

        document.querySelectorAll(".action-button").forEach(button => {
          const action = button.dataset.action;
          button.disabled = /resol|tancat/i.test(currentIncident.state) && action !== "observe";
          button.addEventListener("click", () => {
            if (action === "assign") assignIncidentResources(currentIncident.id);
            else if (action === "observe") addIncidentObservation(currentIncident.id);
            else if (action === "control") setIncidentState(currentIncident.id, "Controlat");
            else if (action === "resolve") setIncidentState(currentIncident.id, "Resolut");
          });
        });
      }

      function selectIncident(id, moveMap) {
        const incident = incidents.find(item => item.id === id);
        if (!incident || isIncidentResolved(incident)) {
          closeDetail();
          return;
        }
        hydrateIncident(incident);
        selectedId = id;
        workspace.classList.add("detail-open");
        detailPanel.setAttribute("aria-hidden", "false");
        detailPanel.inert = false;
        renderDetail(incident);
        document.querySelectorAll(".incident-card").forEach(card => {
          card.setAttribute("aria-pressed", String(card.dataset.id === id));
        });
        for (const item of incidents) {
          const marker = markers.get(item.id);
          if (!marker) continue;
          marker.setIcon(markerIcon(item, item.id === id));
          marker.setZIndexOffset(item.id === id ? 1000 : 0);
        }
        if (moveMap) map.flyTo(incident.coordinates, Math.max(map.getZoom(), 8), { duration: 0.45 });
      }

      function closeDetail() {
        selectedId = null;
        workspace.classList.remove("detail-open");
        detailPanel.setAttribute("aria-hidden", "true");
        detailPanel.inert = true;
        document.querySelectorAll(".incident-card").forEach(card => card.setAttribute("aria-pressed", "false"));
        for (const incident of incidents) {
          const marker = markers.get(incident.id);
          if (marker) {
            marker.setIcon(markerIcon(incident, false));
            marker.setZIndexOffset(0);
          }
        }
      }

      function setIncidentState(id, nextState) {
        const incident = incidents.find(item => item.id === id);
        if (!incident) return null;
        const normalized = String(nextState || "").trim();
        if (!normalized) return incident;
        const validStates = ["Detectat", "Pendent d’avaluació", "Actiu", "En intervenció", "Controlat", "Resolut", "Tancat"];
        if (!validStates.includes(normalized)) {
          throw new Error(`Estat no vàlid: ${nextState}`);
        }
        incident.state = normalized;
        incident.update = `Canvi d’estat: ${normalized}.`;
        incident.history = incident.history || [];
        incident.history.unshift({ time: formatSimulationClock(), text: `Estat actualitzat a ${normalized}.` });
        recordSimulationEvent("Canvi d’estat", `${incident.type} passa a ${normalized}.`, incident.id);

        if (isIncidentResolved(incident)) {
          const marker = markers.get(incident.id);
          if (marker) {
            marker.remove();
            markers.delete(incident.id);
          }
          if (selectedId === id) {
            closeDetail();
          }
        }

        refreshIncidentList();
        if (selectedId === id && !isIncidentResolved(incident)) renderDetail(incident);
        return incident;
      }

      function assignIncidentResources(id) {
        const incident = incidents.find(item => item.id === id);
        if (!incident) return null;
        hydrateIncident(incident);
        const resourceName = incident.type.includes("Incendi") ? "Bombers" : incident.type.includes("Inund") ? "Protecció Civil" : "SEM";
        incident.resourcesAssigned += 1;
        if (!incident.assignedAt || incident.assignedAt === 0) {
          incident.assignedAt = simulation.gameTime;
        }
        incident.state = "En intervenció";
        incident.update = `Recursos assignats: ${resourceName}.`;
        incident.history = incident.history || [];
        incident.history.unshift({ time: formatSimulationClock(), text: `Assignat ${resourceName} al lloc.` });
        recordSimulationEvent("Recursos assignats", `${incident.type} rep suport operatiu al lloc.`, incident.id);
        refreshIncidentList();
        if (selectedId === id) renderDetail(incident);
        return incident;
      }

      function addIncidentObservation(id) {
        const incident = incidents.find(item => item.id === id);
        if (!incident) return null;
        const note = "Observació registrada des del centre de coordinació: es prioritza la informació disponible i la protecció de la població.";
        incident.update = note;
        incident.history = incident.history || [];
        incident.history.unshift({ time: formatSimulationClock(), text: note });
        recordSimulationEvent("Observació registrada", `${incident.type} actualitzat amb una nova nota operativa.`, incident.id);
        refreshIncidentList();
        if (selectedId === id) renderDetail(incident);
        return incident;
      }

      function ensureIncidentGeneratesOwnDetails(incident) {
        incident.type = incident.type || "Incendi forestal";
        incident.location = incident.location || "Ubicació pendent de verificació";
        incident.shortLocation = incident.shortLocation || incident.location.split("·")[0].trim() || "Ubicació";
        incident.time = incident.time || formatSimulationClock();
        incident.calls = incident.calls || "1 comunicació";
        incident.severity = incident.severity || getSeverityFromRisk(incident.risk || 52).severity;
        incident.level = incident.level || getSeverityFromRisk(incident.risk || 52).level;
        incident.state = incident.state || "Detectat";
        incident.update = incident.update || "Incidència registrada a la sala de coordinació.";
        incident.services = incident.services || [["Protecció Civil", "1 unitat"]];
        incident.coordinates = incident.coordinates || [41.8, 1.9];
        incident.description = incident.description || "Incidència creada manualment al sistema de simulació.";
      }

      function createIncident(details = {}) {
        const incident = { ...details };
        ensureIncidentGeneratesOwnDetails(incident);
        hydrateIncident(incident);
        const id = incident.id || `INC-${Date.now().toString().slice(-6)}`;
        incident.id = id;
        incidents.unshift(incident);
        recordSimulationEvent("Nou incident detectat", `${incident.type} a ${incident.shortLocation}.`, incident.id);
        refreshIncidentList();
        const marker = L.marker(incident.coordinates, { icon: markerIcon(incident, false) }).addTo(map);
        marker.bindTooltip(`${incident.type} · ${incident.shortLocation}`, { direction: "top", offset: [0, -22] });
        marker.on("click", () => {
          selectIncident(incident.id, false);
          document.querySelector(`[data-id="${incident.id}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
        });
        markers.set(incident.id, marker);
        return incident;
      }

      function generateScenarioIncident() {
        const templates = [
          { type: "Incendi forestal", shortLocation: "Girona", coordinates: [41.98, 2.82], location: "Girona · Garrotxa", description: "Foc de vegetació amb intensa propagació cap al nord de la comarca.", typeMeta: incidentTypeCatalog.forestFire },
          { type: "Inundació urbana", shortLocation: "Tarragona", coordinates: [41.12, 1.24], location: "Tarragona · Tarragonès", description: "Acumulació d’aigua i talls de circulació a diversos carrers baixos.", typeMeta: incidentTypeCatalog.flood },
          { type: "Plujes molt intenses", shortLocation: "Vic", coordinates: [41.93, 2.25], location: "Vic · Osona", description: "Precipitacions intenses amb risc de desbordament local i creixent del cabal.", typeMeta: incidentTypeCatalog.rain },
          { type: "Accident de trànsit greu", shortLocation: "Figueres", coordinates: [42.27, 2.95], location: "Figueres · AP-7", description: "Col·lisió múltiple amb retencions i talls de circulació en sentit sud.", typeMeta: incidentTypeCatalog.traffic },
          { type: "Accident químic", shortLocation: "Manresa", coordinates: [41.73, 1.83], location: "Manresa · Bages", description: "Fuita de material perillós en una zona industrial i risc de confinament provisional.", typeMeta: incidentTypeCatalog.chemical },
          { type: "Emergència sanitària col·lectiva", shortLocation: "Badalona", coordinates: [41.45, 2.24], location: "Badalona · Barcelonès", description: "Múltiples afectats en un espai públic amb necessitat de coordinació sanitària.", typeMeta: incidentTypeCatalog.medical }
        ];
        const templateIndex = Math.abs(Math.floor(simulation.gameTime / 1000 / 60 / 20)) % templates.length;
        const template = templates[templateIndex];
        const baseRisk = template.typeMeta.defaultRisk || 52;
        return createIncident({
          id: `INC-${Date.now().toString().slice(-6)}`,
          type: template.type,
          shortLocation: template.shortLocation,
          location: template.location,
          coordinates: template.coordinates,
          description: template.description,
          severity: getSeverityFromRisk(baseRisk).severity,
          level: getSeverityFromRisk(baseRisk).level,
          state: "Detectat",
          risk: baseRisk,
          populationRisk: template.typeMeta.populationRisk * 100,
          calls: "1 comunicació",
          services: [["Protecció Civil", "1 unitat"]],
          update: "Nova incidència generada automàticament segons l’escenari de coordinació.",
          time: formatSimulationClock(),
          actions: template.typeMeta.actionList,
          consequences: [template.typeMeta.summary]
        });
      }

      function evolveIncidents(secondsElapsed) {
        const factor = secondsElapsed / 60;
        for (const incident of incidents) {
          hydrateIncident(incident);
          ensureIncidentState(incident);
          if (/Tancat|Resolut/i.test(incident.state)) continue;

          const threat = incident.typeKey === "incendi" ? 0.8 : incident.typeKey === "inundacio" ? 0.55 : incident.typeKey === "pluges" ? 0.4 : incident.typeKey === "accident-trafic" ? 0.38 : incident.typeKey === "accident-quimic" ? 0.7 : incident.typeKey === "sanitaria" ? 0.2 : 0.3;
          const trend = Math.sin((simulation.gameTime / 180000) + incident.coordinates[0] + incident.coordinates[1]) * 0.6;
          const resourceModifier = incident.resourcesAssigned ? -0.42 : 0.18;
          const riskDelta = (trend + threat + resourceModifier) * factor;
          incident.risk = Math.max(6, Math.min(96, (incident.risk || 50) + riskDelta));

          const nextSeverity = getSeverityFromRisk(incident.risk);
          if (incident.severity !== nextSeverity.severity) {
            incident.severity = nextSeverity.severity;
            incident.level = nextSeverity.level;
            incident.update = `Gravetat actualitzada a ${nextSeverity.severity.toLowerCase()} segons l’evolució del focus.`;
            incident.history = incident.history || [];
            incident.history.unshift({ time: formatSimulationClock(), text: `Gravetat actualitzada: ${nextSeverity.severity}.` });
            recordSimulationEvent("Canvi de gravetat", `${incident.type} passa a ${nextSeverity.severity.toLowerCase()}.`, incident.id);
          }

          if (incident.risk > 76 && !/En intervenció|Controlat|Resolut|Tancat/.test(incident.state)) {
            incident.state = "En intervenció";
            incident.update = "L’incident requereix intervenció activa i coordinació dels recursos disponibles.";
            incident.history.unshift({ time: formatSimulationClock(), text: "Estat actualitzat a En intervenció." });
            recordSimulationEvent("Intervenció activa", `${incident.type} entra en intervenció directa.`, incident.id);
          }

          const elapsedAssignedTime = incident.assignedAt ? (simulation.gameTime - incident.assignedAt) : 0;
          if (incident.resourcesAssigned > 0 && elapsedAssignedTime > 60 * 60 * 1000 && !/Controlat|Resolut|Tancat/.test(incident.state)) {
            incident.state = "Controlat";
            incident.update = "L’incident està controlat i se’n monitoritza la resolució.";
            incident.history.unshift({ time: formatSimulationClock(), text: "Incidència controlada per l’equip assignat." });
            recordSimulationEvent("Incident controlat", `${incident.type} queda sota control operatiu.`, incident.id);
          }

          if (incident.resourcesAssigned > 0 && elapsedAssignedTime > 90 * 60 * 1000 && !/Resolut|Tancat/.test(incident.state)) {
            incident.state = "Resolut";
            incident.update = "L’incident s’ha resolt i queda disponible a l’historial operatiu.";
            incident.history.unshift({ time: formatSimulationClock(), text: "Incidència resolta i tancada en l’historial." });
            recordSimulationEvent("Incident resolt", `${incident.type} ja no està actiu.`, incident.id);
          }

          incident.time = formatSimulationClock();
          if (selectedId === incident.id) renderDetail(incident);
        }
        refreshIncidentList();
      }

      function stepSimulation() {
        if (!simulation.running) return;
        const now = performance.now();
        if (!simulation.lastFrame) simulation.lastFrame = now;
        const elapsed = now - simulation.lastFrame;
        simulation.lastFrame = now;
        const realSeconds = elapsed / 1000;
        const gameSeconds = realSeconds * (simulation.speedRates[simulation.speed] || 1);
        simulation.gameTime += gameSeconds * 1000;
        updateSimulationClock();
        evolveIncidents(realSeconds);

        if (simulation.gameTime - simulation.lastGeneratedIncidentAt > 18 * 60 * 1000) {
          generateScenarioIncident();
          simulation.lastGeneratedIncidentAt = simulation.gameTime;
        }

        simulation.animationFrame = requestAnimationFrame(stepSimulation);
      }

      function startSimulation() {
        if (simulation.running) return;
        simulation.started = true;
        simulation.running = true;
        simulation.paused = false;
        simulation.lastFrame = performance.now();
        const toggleButton = document.getElementById("toggle-sim");
        if (toggleButton) toggleButton.textContent = "Aturar";
        const pauseButton = document.getElementById("pause-sim");
        if (pauseButton) pauseButton.textContent = "Pausa";
        recordSimulationEvent("Simulació iniciada", "El torn de coordinació entra en funcionament i el temps del joc avança.", null);
        stepSimulation();
      }

      function pauseSimulation() {
        if (!simulation.running) return;
        simulation.running = false;
        simulation.paused = true;
        const pauseButton = document.getElementById("pause-sim");
        if (pauseButton) pauseButton.textContent = "Reprendre";
        if (simulation.animationFrame) cancelAnimationFrame(simulation.animationFrame);
        recordSimulationEvent("Pausa de simulació", "El torn queda en pausa i el temps del joc es bloqueja.", null);
      }

      function resumeSimulation() {
        if (simulation.running || !simulation.started) return;
        simulation.running = true;
        simulation.paused = false;
        simulation.lastFrame = performance.now();
        const pauseButton = document.getElementById("pause-sim");
        if (pauseButton) pauseButton.textContent = "Pausa";
        recordSimulationEvent("Simulació reanudada", "La coordinació torna a avançar al temps del joc.", null);
        stepSimulation();
      }

      function stopSimulation() {
        if (!simulation.started && !simulation.running) return;
        if (simulation.animationFrame) cancelAnimationFrame(simulation.animationFrame);
        simulation.running = false;
        simulation.started = false;
        simulation.paused = false;
        const toggleButton = document.getElementById("toggle-sim");
        if (toggleButton) toggleButton.textContent = "Iniciar";
        const pauseButton = document.getElementById("pause-sim");
        if (pauseButton) pauseButton.textContent = "Pausa";
        recordSimulationEvent("Simulació aturada", "El torn queda tancat i la simulació deixa d’actualitzar-se.", null);
      }

      function bindGlobalSimulationAPI() {
        window.simulation = simulation;
        window.gameState = simulation;
        window.getGameTime = () => simulation.gameTime;
        window.startSimulation = startSimulation;
        window.pauseSimulation = pauseSimulation;
        window.resumeSimulation = resumeSimulation;
        window.stopSimulation = stopSimulation;
        window.setSimulationSpeed = setSimulationSpeed;
        window.createIncident = createIncident;
        window.generateIncident = generateScenarioIncident;
        window.addIncidentObservation = addIncidentObservation;
        window.assignIncidentResources = assignIncidentResources;
        window.setIncidentState = setIncidentState;
        window.getIncidentList = () => incidents;
      }

      function initializeSimulation() {
        setupSimulationUI();
        ensureEventFeed();
        renderSimulationEvents();
        updateSimulationClock();
        incidents.forEach(incident => {
          hydrateIncident(incident);
          ensureIncidentGeneratesOwnDetails(incident);
          incident.time = incident.time || formatSimulationClock();
          if (!incident.history || incident.history.length === 0) {
            incident.history = [{ time: formatSimulationClock(), text: "Incidència registrada a la sala de coordinació." }];
          }
          incident.assignedAt = incident.assignedAt || 0;
        });
        bindGlobalSimulationAPI();
        document.getElementById("sim-speed").value = String(simulation.speed);
        recordSimulationEvent("Escenari actiu", "Sistema operatiu carregat i llistat d’incidències disponible.", null);
      }

      initializeSimulation();

      renderIncidentList = function() {
        if (!list) return;
        const visibleIncidents = getActiveIncidents().sort((a, b) => {
          const severityOrder = { critical: 4, high: 3, warning: 2, moderate: 1, low: 0 };
          return (severityOrder[b.level || "high"] || 0) - (severityOrder[a.level || "high"] || 0);
        });
        const countBadge = document.querySelector(".count-badge");
        if (countBadge) {
          countBadge.textContent = String(visibleIncidents.length);
          countBadge.setAttribute("aria-label", `${visibleIncidents.length} emergències`);
        }

        list.innerHTML = "";
        for (const incident of visibleIncidents) {
          hydrateIncident(incident);
          const button = document.createElement("button");
          button.className = "incident-card";
          button.type = "button";
          button.dataset.id = incident.id;
          button.setAttribute("aria-pressed", String(selectedId === incident.id));
          const stateClass = /control|tancat|resol/i.test(incident.state) ? "controlled" : "";
          button.innerHTML = `
            <span class="incident-topline">
              <span class="incident-kind">${incident.type}</span>
              <span class="severity ${incident.level === "critical" ? "" : incident.level}">
                <span class="severity-dot"></span>${incident.severity || getSeverityFromRisk(incident.risk).severity}
              </span>
            </span>
            <span class="incident-location">${incident.shortLocation}</span>
            <span class="incident-meta">
              <span class="incident-state ${stateClass}">${incident.state}</span>
              <span>${incident.time || formatSimulationClock()}</span>
            </span>`;
          button.addEventListener("click", () => selectIncident(incident.id, true));
          list.append(button);
        }
      };

      refreshIncidentList = renderIncidentList;

      renderIncidentList();
      if (selectedId) setTimeout(() => selectIncident(selectedId, false), 80);
