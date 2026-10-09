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

      const list = document.getElementById("incident-list");
      const workspace = document.getElementById("workspace");
      const detailPanel = document.getElementById("detail-panel");
      const map = L.map("map", {
        zoomControl: true,
        scrollWheelZoom: true,
        attributionControl: false,
        zoomSnap: 0.25
      }).setView([41.83, 1.65], 7.4);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
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
