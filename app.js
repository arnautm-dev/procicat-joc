      const incidents = [];

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
        waterAccumulation: {
          id: "waterAccumulation",
          name: "Acumulació d’aigua",
          icon: "💧",
          color: "#58a9e8",
          defaultRisk: 48,
          spread: 0.45,
          populationRisk: 0.52,
          actionList: ["Verificar punts baixos", "Balissar acumulacions", "Coordinar afectacions viàries"],
          summary: "Acumulació local d’aigua amb possibles afectacions a la mobilitat."
        },
        rain: {
          id: "rain",
          name: "Pluges molt intenses",
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
      const resourceDialog = document.getElementById("resource-dialog");
      const resourceAssignmentForm = document.getElementById("resource-assignment-form");
      const resourceAssignmentOptions = document.getElementById("resource-assignment-options");
      const resourceAssignmentError = document.getElementById("resource-assignment-error");
      let resourceAssignmentIncidentId = null;
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
      const enabledThematicLayers = new Set();
      const thematicLayers = {
        alert: null,
        radar: null
      };

      const boundaryDataBaseUrl = "https://raw.githubusercontent.com/ArnauInes/geometries_cat_bcn_2024/main/";
      const alertLevels = new Map();
      const selectedCounties = new Set();
      const esAlerts = [];
      let selectedEsAlertId = null;
      let esAlertMessageCatalogPromise = null;
      let esAlertMessageCatalog = null;
      let esAlertPreviewAudio = null;
      let nextEsAlertSequence = 1;
      let nextEsAlertEventSequence = 1;
      const esAlertLevelDetails = {
        low: { label: "Baix", color: "yellow", reduction: 10 },
        medium: { label: "Mitjà", color: "orange", reduction: 20 },
        high: { label: "Alt", color: "red", reduction: 30 }
      };
      const municipalityStatuses = new Map();
      const alertColors = {
        yellow: "#f2d54a",
        orange: "#f49a4b",
        red: "#f05252"
      };
      let municipalityFeatures = [];
      let countyFeatures = [];
      let municipalitiesByCode = new Map();
      let municipalitiesByName = new Map();
      let countiesByCode = new Map();
      let countiesByName = new Map();
      let scenarioMunicipalityLocations = [];
      let boundaryDataLoaded = false;
      const municipalityPopulationWeights = new Map(Object.entries({
        "Barcelona": 160,
        "L'Hospitalet de Llobregat": 28,
        "Terrassa": 23,
        "Badalona": 22,
        "Sabadell": 22,
        "Lleida": 14,
        "Tarragona": 14,
        "Mataró": 13,
        "Santa Coloma de Gramenet": 12,
        "Reus": 11,
        "Girona": 10,
        "Sant Cugat del Vallès": 10,
        "Cornellà de Llobregat": 9,
        "Sant Boi de Llobregat": 9,
        "Manresa": 8,
        "Rubí": 8,
        "Vilanova i la Geltrú": 7,
        "Viladecans": 7,
        "Castelldefels": 7,
        "El Prat de Llobregat": 7,
        "Granollers": 7,
        "Cerdanyola del Vallès": 6,
        "Vic": 5,
        "Figueres": 5,
        "Blanes": 5,
        "Olot": 4,
        "Igualada": 4,
        "Tortosa": 4,
        "Salou": 4,
        "Lloret de Mar": 4,
        "Sant Feliu de Llobregat": 4,
        "Sant Joan Despí": 4,
        "Vilafranca del Penedès": 4,
        "Esplugues de Llobregat": 4,
        "Gavà": 4,
        "Ripollet": 4,
        "Sant Adrià de Besòs": 4,
        "Montcada i Reixac": 4,
        "Sant Pere de Ribes": 3,
        "Sant Vicenç dels Horts": 3,
        "Pineda de Mar": 3,
        "Vila-seca": 3,
        "El Vendrell": 3,
        "Cambrils": 3,
        "Calafell": 3,
        "Premià de Mar": 3,
        "Valls": 3,
        "Martorell": 3,
        "Mollet del Vallès": 3,
        "Tàrrega": 2,
        "Mollerussa": 2,
        "Balaguer": 2,
        "Banyoles": 2,
        "Palamós": 2,
        "Roses": 2,
        "Caldes de Montbui": 2,
        "Cardedeu": 2,
        "Sant Celoni": 2,
        "Canovelles": 2,
        "Parets del Vallès": 2,
        "Sant Quirze del Vallès": 2,
        "Sant Just Desvern": 2,
        "Cunit": 2,
        "Mont-roig del Camp": 2,
        "La Bisbal d'Empordà": 2,
        "Sant Carles de la Ràpita": 2,
        "Berga": 2,
        "Cervera": 2,
        "Olesa de Montserrat": 2,
        "Castellar del Vallès": 2,
        "Barberà del Vallès": 2,
        "Sant Andreu de la Barca": 2,
        "Salt": 2,
        "Palafrugell": 2,
        "Sant Feliu de Guíxols": 2,
        "Amposta": 2,
        "La Seu d'Urgell": 1
      }).map(([name, weight]) => [normalizeAdministrativeName(name), weight]));

      const weatherModel = {
        seed: null,
        storms: [],
        startedAt: null,
        nextStormAt: null,
        nextStormSequence: 0,
        createdEpisodes: new Set(),
        random: null
      };
      const radarState = { forecastHours: 0, lastRenderTime: null, lastSimulationRenderTime: null, playbackTimer: null };

      function createRadarLayer() {
        map.createPane("radarPane");
        map.getPane("radarPane").classList.add("leaflet-radar-pane");
        map.getPane("radarPane").style.zIndex = "425";
        return L.layerGroup();
      }

      thematicLayers.radar = createRadarLayer();

      function createSeededRandom(seed) {
        let state = seed >>> 0;
        return () => {
          state += 0x6D2B79F5;
          let value = state;
          value = Math.imul(value ^ (value >>> 15), value | 1);
          value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
          return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
        };
      }

      function initializeWeatherModel() {
        const randomSeed = new Uint32Array(1);
        crypto.getRandomValues(randomSeed);
        weatherModel.seed = randomSeed[0];
        const random = createSeededRandom(weatherModel.seed);
        weatherModel.random = random;
        weatherModel.startedAt = simulation.gameTime;
        weatherModel.nextStormAt = simulation.gameTime + (25 + random() * 95) * 60 * 1000;
        weatherModel.nextStormSequence = 0;
        weatherModel.createdEpisodes = new Set();
        weatherModel.storms = [];
      }

      function evolveWeatherModel() {
        if (weatherModel.seed === null) return;
        while (simulation.gameTime >= weatherModel.nextStormAt) {
          const stormStart = weatherModel.nextStormAt;
          weatherModel.nextStormSequence += 1;
          weatherModel.storms.push({
            id: `storm-${weatherModel.nextStormSequence}`,
            latitude: 40.55 + weatherModel.random() * 2.25,
            longitude: 0.15 + weatherModel.random() * 3.3,
            driftLatitude: (weatherModel.random() - 0.5) * 0.28,
            driftLongitude: (weatherModel.random() - 0.5) * 0.55,
            radiusKm: 8 + weatherModel.random() * 34,
            intensity: 4 + weatherModel.random() ** 1.7 * 34,
            startOffset: stormStart - weatherModel.startedAt,
            duration: (35 + weatherModel.random() * 145) * 60 * 1000,
            phase: weatherModel.random() * Math.PI * 2,
            orientation: (weatherModel.random() - 0.5) * Math.PI,
            elongation: 1 + weatherModel.random() * 1.3
          });
          weatherModel.nextStormAt = stormStart + (45 + weatherModel.random() * 165) * 60 * 1000;
        }
        weatherModel.storms = weatherModel.storms.filter(storm =>
          weatherModel.startedAt + storm.startOffset + storm.duration + 3 * 3600000 >= simulation.gameTime
        );
      }

      function getStormPosition(storm, timestamp) {
        const elapsedHours = (timestamp - weatherModel.startedAt - storm.startOffset) / 3600000;
        return {
          latitude: storm.latitude + storm.driftLatitude * elapsedHours,
          longitude: storm.longitude + storm.driftLongitude * elapsedHours
        };
      }

      function getPrecipitationAt(latitude, longitude, timestamp) {
        if (weatherModel.seed === null) return { intensity: 0, stormId: null };
        let intensity = 0;
        let dominantStormId = null;
        let dominantIntensity = 0;
        for (const storm of weatherModel.storms) {
          const age = (timestamp - weatherModel.startedAt - storm.startOffset) / storm.duration;
          if (age <= 0 || age >= 1) continue;
          const center = getStormPosition(storm, timestamp);
          const latitudeDelta = (latitude - center.latitude) * 111;
          const longitudeDelta = (longitude - center.longitude) * 83 * Math.cos(latitude * Math.PI / 180);
          const along = latitudeDelta * Math.cos(storm.orientation) + longitudeDelta * Math.sin(storm.orientation);
          const across = -latitudeDelta * Math.sin(storm.orientation) + longitudeDelta * Math.cos(storm.orientation);
          const distance = Math.sqrt((along / storm.elongation) ** 2 + across ** 2);
          const spatialWeight = Math.exp(-0.5 * (distance / storm.radiusKm) ** 2);
          const temporalWeight = Math.sin(Math.PI * age) ** 0.7;
          const cellIntensity = storm.intensity * spatialWeight * temporalWeight * (0.88 + 0.12 * Math.sin(age * Math.PI * 4 + storm.phase));
          intensity += cellIntensity;
          if (cellIntensity > dominantIntensity) {
            dominantIntensity = cellIntensity;
            dominantStormId = storm.id;
          }
        }
        return { intensity, stormId: dominantStormId };
      }

      function getAccumulatedRainfall(latitude, longitude, timestamp, duration = 3 * 3600000) {
        const sampleInterval = 10 * 60000;
        const firstSample = Math.max(weatherModel.startedAt, timestamp - duration);
        let accumulated = 0;
        const stormAccumulation = new Map();
        for (let sampleTime = firstSample; sampleTime < timestamp; sampleTime += sampleInterval) {
          const elapsed = Math.min(sampleInterval, timestamp - sampleTime);
          const sample = getPrecipitationAt(latitude, longitude, sampleTime + elapsed / 2);
          const rainfall = sample.intensity * elapsed / 3600000;
          accumulated += rainfall;
          if (sample.stormId) stormAccumulation.set(sample.stormId, (stormAccumulation.get(sample.stormId) || 0) + rainfall);
        }
        const stormId = [...stormAccumulation].sort((a, b) => b[1] - a[1])[0]?.[0] || null;
        return { amount: accumulated, stormId };
      }

      function getWeatherAt(latitude, longitude, timestamp = simulation.gameTime) {
        const precipitation = getPrecipitationAt(latitude, longitude, timestamp);
        const accumulation = getAccumulatedRainfall(latitude, longitude, timestamp);
        return {
          timestamp,
          intensity: precipitation.intensity,
          accumulatedRainfall: accumulation.amount,
          stormId: precipitation.stormId || accumulation.stormId
        };
      }

      const radarGrid = Array.from({ length: 11 * 13 }, (_, index) => ({
        latitude: 40.5 + Math.floor(index / 13) * 0.22,
        longitude: 0.05 + (index % 13) * 0.29
      }));

      function renderRadar() {
        const radarLayer = thematicLayers.radar;
        radarLayer.clearLayers();
        if (weatherModel.seed === null) {
          updateWeatherControls();
          return;
        }
        const targetTime = simulation.gameTime + radarState.forecastHours * 3600000;
        radarState.lastRenderTime = targetTime;
        radarState.lastSimulationRenderTime = simulation.gameTime;
        for (const point of radarGrid) {
          const { intensity } = getPrecipitationAt(point.latitude, point.longitude, targetTime);
          if (intensity < 1.3) continue;
          const color = intensity < 4 ? "#4778e8" : intensity < 10 ? "#35cbd2" : intensity < 20 ? "#68e47a" : intensity < 30 ? "#f0cf4b" : intensity < 40 ? "#f49a4b" : "#e54e54";
          const radius = 12500 + Math.min(intensity, 40) * 850;
          L.circle([point.latitude, point.longitude], {
            radius,
            stroke: false,
            fillColor: color,
            fillOpacity: Math.min(0.64, 0.18 + intensity / 85),
            pane: "radarPane",
            interactive: false
          }).addTo(radarLayer);
        }
        updateWeatherControls();
      }

      function refreshRadarLayer() {
        renderRadar();
      }

      function formatClockTime(timestamp) {
        return new Intl.DateTimeFormat("ca-ES", { hour: "2-digit", minute: "2-digit" }).format(new Date(timestamp));
      }

      function updateWeatherControls() {
        document.querySelectorAll(".weather-time-option").forEach(button => {
          const offset = Number(button.dataset.weatherOffset);
          button.setAttribute("aria-pressed", String(offset === radarState.forecastHours));
          button.classList.toggle("selected", offset === radarState.forecastHours);
          button.querySelector("small").textContent = formatClockTime(simulation.gameTime + offset * 3600000);
        });
      }

      function setRadarForecast(hours) {
        radarState.forecastHours = hours;
        renderRadar();
      }

      function stopRadarPlayback() {
        if (radarState.playbackTimer !== null) {
          window.clearInterval(radarState.playbackTimer);
          radarState.playbackTimer = null;
        }
        const button = document.getElementById("weather-playback");
        button.textContent = "Reproduir";
        button.setAttribute("aria-pressed", "false");
      }

      function toggleRadarPlayback() {
        if (radarState.playbackTimer !== null) {
          stopRadarPlayback();
          return;
        }
        const button = document.getElementById("weather-playback");
        button.textContent = "Pausar";
        button.setAttribute("aria-pressed", "true");
        radarState.playbackTimer = window.setInterval(() => {
          setRadarForecast((radarState.forecastHours + 1) % 4);
        }, 1400);
      }

      document.querySelectorAll(".weather-time-option").forEach(button => {
        button.addEventListener("click", () => setRadarForecast(Number(button.dataset.weatherOffset)));
      });
      document.getElementById("weather-playback").addEventListener("click", toggleRadarPlayback);

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

      function getCountyAlertColor(county) {
        const activeAlert = esAlerts.find(alert => alert.status === "active" && alert.county === county);
        const legacyLevel = alertLevels.get(county);
        return activeAlert
          ? alertColors[esAlertLevelDetails[activeAlert.level].color]
          : legacyLevel ? alertColors[legacyLevel] : null;
      }

      function countyStyle(feature) {
        const county = feature.properties.nom_comarca;
        const selected = selectedCounties.has(county);
        const alertColor = getCountyAlertColor(county);
        const color = alertColor || (selected ? "#56b5a8" : "#73838a");
        return {
          className: "es-alert-county-boundary",
          color: selected ? "#56b5a8" : color,
          weight: selected ? 3 : alertColor ? 1.8 : 1.4,
          opacity: selected || alertColor ? 0.98 : 0.7,
          fillColor: color,
          fillOpacity: alertColor ? (selected ? 0.4 : 0.36) : selected ? 0.28 : 0
        };
      }

      function createAlertLayer(features) {
        return L.geoJSON(features, {
          style: countyStyle,
          onEachFeature(feature, layer) {
            layer.on("click", event => {
              if (!enabledThematicLayers.has("alert")) return;
              L.DomEvent.stopPropagation(event.originalEvent);
              toggleCountySelection(feature.properties.nom_comarca);
            });
          }
        });
      }

      function refreshCountyLayer() {
        thematicLayers.alert?.setStyle(countyStyle);
      }

      function toggleCountySelection(county) {
        if (selectedCounties.has(county)) selectedCounties.delete(county);
        else selectedCounties.add(county);
        refreshCountyLayer();
        renderSelectedAlertCounties();
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
        const color = getCountyAlertColor(feature.properties.nom_comarca);
        const level = Object.entries(alertColors).find(([, candidateColor]) => candidateColor === color)?.[0] || "none";
        return {
          name: feature.properties.nom_comarca,
          code: feature.properties.codi_comarca,
          level
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
        refreshCountyLayer();
        return getCountyAlert(feature.properties.codi_comarca);
      }

      function listCountyAlerts(options = {}) {
        requireBoundaryData();
        const affectedOnly = options.affectedOnly === true;
        return countyFeatures
          .filter(feature => !affectedOnly || getCountyAlertColor(feature.properties.nom_comarca))
          .map(feature => getCountyAlert(feature.properties.codi_comarca));
      }

      Object.assign(window, {
        setMunicipalityStatus,
        getMunicipalityStatus,
        listMunicipalityStatuses,
        setCountyAlert,
        getCountyAlert,
        listCountyAlerts,
        getESAlertList: () => esAlerts.map(alert => ({
          ...alert,
          counties: [alert.county],
          affectedIncidentIds: [...alert.affectedIncidentIds]
        })),
        finalizeESAlert: finalizeEsAlert
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
          scenarioMunicipalityLocations = municipalityFeatures.map(feature => {
            const bounds = L.geoJSON(feature).getBounds();
            return {
              feature,
              coordinates: bounds.isValid() ? bounds.getCenter() : null
            };
          }).filter(municipality => municipality.coordinates);
          countiesByCode = new Map(countyFeatures.map(feature => [
            feature.properties.codi_comarca,
            feature
          ]));
          countiesByName = new Map(countyFeatures.map(feature => [
            normalizeAdministrativeName(feature.properties.nom_comarca),
            feature
          ]));
          thematicLayers.alert = createAlertLayer(countyFeatures);
          boundaryDataLoaded = true;

          status.hidden = true;
          status.classList.remove("error");
          enabledThematicLayers.forEach(layerName => thematicLayers[layerName]?.addTo(map));
          document.getElementById("open-es-alert").disabled = false;
          for (const incident of getActiveIncidents()) applyActiveEsAlertsToIncident(incident);
          refreshIncidentList();
          return true;
        } catch (error) {
          console.error("No s’han pogut carregar els límits municipals i comarcals.", error);
          status.textContent = "No s’han pogut carregar els límits reals. Comprova la connexió i torna a carregar la pàgina.";
          status.classList.add("error");
          status.hidden = false;
          return false;
        }
      }

      const esAlertCategories = {
        flood: "pluges intenses i inundacions",
        fire: "incendis forestals",
        chemical: "accidents químics i núvols tòxics",
        medical: "emergències sanitàries col·lectives"
      };
      const esAlertCategoryLabels = {
        ...esAlertCategories,
        manual: "altres / redacció manual"
      };

      function parseEsAlertMessages(markdown) {
        const messages = Object.fromEntries(Object.keys(esAlertCategories).map(category => [category, []]));
        let category = null;
        let currentMessage = null;
        let language = null;
        for (const line of markdown.split(/\r?\n/)) {
          const heading = /^\s*\d+\.\s+(.+?)\s*$/.exec(line);
          if (heading) {
            const normalizedHeading = normalizeAdministrativeName(heading[1]);
            const matchedCategory = Object.entries(esAlertCategories)
              .find(([, title]) => normalizedHeading.includes(normalizeAdministrativeName(title)));
            if (matchedCategory) {
              category = matchedCategory[0];
              currentMessage = null;
            } else if (category) {
              currentMessage = { title: heading[1], ca: [], es: [] };
              messages[category].push(currentMessage);
            }
            language = null;
            continue;
          }
          const languageLabel = normalizeAdministrativeName(line);
          if (languageLabel === "catala") {
            language = currentMessage ? "ca" : null;
            continue;
          }
          if (languageLabel === "castella") {
            language = currentMessage ? "es" : null;
            continue;
          }
          if (!line.trim()) {
            language = null;
            continue;
          }
          if (currentMessage && language) currentMessage[language].push(line.trim());
        }
        for (const categoryMessages of Object.values(messages)) {
          for (let index = categoryMessages.length - 1; index >= 0; index -= 1) {
            const message = categoryMessages[index];
            message.ca = message.ca.join("\n").trim();
            message.es = message.es.join("\n").trim();
            if (!message.ca || !message.es) categoryMessages.splice(index, 1);
          }
        }
        return messages;
      }

      function loadEsAlertMessages() {
        if (!esAlertMessageCatalogPromise) {
          esAlertMessageCatalogPromise = fetch("es-alert-messages.md")
            .then(response => {
              if (!response.ok) throw new Error(`No s’ha pogut llegir es-alert-messages.md (${response.status}).`);
              return response.text();
            })
            .then(parseEsAlertMessages);
        }
        return esAlertMessageCatalogPromise;
      }

      function getIncidentCounty(incident) {
        if (!boundaryDataLoaded) return null;
        const locationParts = String(incident.location || "").split("·").map(part => part.trim()).filter(Boolean);
        const locationCounty = locationParts.length > 1 ? locationParts[locationParts.length - 1] : "";
        const countyFeature = countiesByName.get(normalizeAdministrativeName(locationCounty));
        if (countyFeature) return countyFeature.properties.nom_comarca;
        const municipality = municipalitiesByName.get(normalizeAdministrativeName(incident.shortLocation || ""));
        return municipality ? municipality.properties.nom_comarca : null;
      }

      function getIncidentAlertCategory(incident) {
        const type = normalizeIncidentType(incident.type);
        if (type === "forestFire") return "fire";
        if (type === "flood" || type === "rain") return "flood";
        if (type === "chemical") return "chemical";
        if (type === "medical") return "medical";
        return "manual";
      }

      function suggestEsAlertCategory() {
        const scores = new Map();
        for (const incident of getActiveIncidents()) {
          if (!selectedCounties.has(getIncidentCounty(incident))) continue;
          const category = getIncidentAlertCategory(incident);
          const score = scores.get(category) || { count: 0, risk: 0 };
          score.count += 1;
          score.risk += Number(incident.risk) || 0;
          scores.set(category, score);
        }
        return [...scores].sort((a, b) =>
          b[1].count - a[1].count || b[1].risk - a[1].risk || a[0].localeCompare(b[0])
        )[0]?.[0] || "manual";
      }

      function replaceAffectedCounties(text, language) {
        const counties = [...selectedCounties].join(", ");
        const replacement = language === "ca"
          ? `les comarques afectades: ${counties}`
          : `las comarcas afectadas: ${counties}`;
        return text.replace(/\bla zona afectada\b/gi, replacement);
      }

      function getAlertMessageText() {
        const catalan = document.getElementById("es-alert-message-ca").value.trim();
        const spanish = document.getElementById("es-alert-message-es").value.trim();
        return catalan && spanish ? `${catalan}\n\n${spanish}` : "";
      }

      function updateEsAlertComposer() {
        const selected = [...selectedCounties];
        document.getElementById("es-alert-preview-counties").textContent = selected.length
          ? `Comarques afectades: ${selected.join(", ")}`
          : "Selecciona com a mínim una comarca al mapa.";
        document.getElementById("es-alert-preview-message").textContent = getAlertMessageText() || "El missatge bilingüe apareixerà aquí.";
        document.getElementById("send-es-alert").disabled = selected.length === 0;
      }

      function renderSelectedAlertCounties() {
        const list = document.getElementById("es-alert-county-list");
        const names = [...selectedCounties].sort((a, b) => a.localeCompare(b, "ca"));
        document.getElementById("es-alert-county-count").textContent = String(names.length);
        list.replaceChildren();
        for (const county of names) {
          const row = document.createElement("div");
          row.className = "es-alert-county-chip";
          const name = document.createElement("span");
          name.textContent = county;
          const remove = document.createElement("button");
          remove.type = "button";
          remove.textContent = "Treu";
          remove.setAttribute("aria-label", `Treu ${county} de la selecció`);
          remove.addEventListener("click", () => toggleCountySelection(county));
          row.append(name, remove);
          list.append(row);
        }
        updateEsAlertComposer();
      }

      function applyEsAlertTemplate() {
        const category = document.getElementById("es-alert-category").value;
        const templateIndex = Number(document.getElementById("es-alert-template").value);
        const templates = esAlertMessageCatalog;
        if (!templates || category === "manual" || !Number.isInteger(templateIndex)) return;
        const message = templates[category]?.[templateIndex];
        if (!message) return;
        document.getElementById("es-alert-message-ca").value = replaceAffectedCounties(message.ca, "ca");
        document.getElementById("es-alert-message-es").value = replaceAffectedCounties(message.es, "es");
        updateEsAlertComposer();
      }

      async function populateEsAlertTemplates(preferredCategory = null) {
        const categorySelect = document.getElementById("es-alert-category");
        const templateSelect = document.getElementById("es-alert-template");
        const status = document.getElementById("es-alert-message-status");
        if (preferredCategory) categorySelect.value = preferredCategory;
        try {
          const messages = await loadEsAlertMessages();
          esAlertMessageCatalog = messages;
          status.hidden = true;
          templateSelect.replaceChildren();
          const category = categorySelect.value;
          const categoryMessages = messages[category] || [];
          for (const [index, message] of categoryMessages.entries()) {
            const option = document.createElement("option");
            option.value = String(index);
            option.textContent = message.title;
            templateSelect.append(option);
          }
          templateSelect.disabled = categoryMessages.length === 0;
          if (categoryMessages.length) {
            const levelIndex = { low: 0, medium: 1, high: 2 }[document.getElementById("es-alert-level").value] || 0;
            templateSelect.value = String(Math.min(levelIndex, categoryMessages.length - 1));
            applyEsAlertTemplate();
          } else {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "No hi ha cap plantilla per a aquest tipus; redacta els dos idiomes.";
            templateSelect.append(option);
            document.getElementById("es-alert-message-ca").value = "";
            document.getElementById("es-alert-message-es").value = "";
            updateEsAlertComposer();
          }
        } catch (error) {
          console.error("No s’han pogut carregar les plantilles d’ES-Alert.", error);
          status.textContent = "No s’ha pogut llegir el fitxer de missatges. Pots redactar els textos en català i castellà manualment.";
          status.hidden = false;
          templateSelect.replaceChildren();
          const option = document.createElement("option");
          option.value = "";
          option.textContent = "Plantilles no disponibles";
          templateSelect.append(option);
          templateSelect.disabled = true;
        }
      }

      function getEsAlertCategoryLabel(category) {
        return capitalizeWord(esAlertCategoryLabels[category] || esAlertCategoryLabels.manual);
      }

      function renderEsAlertRecords() {
        const list = document.getElementById("es-alert-record-list");
        list.replaceChildren();
        const records = [...esAlerts].sort((a, b) => b.sentAt - a.sentAt);
        for (const alert of records) {
          const row = document.createElement("div");
          row.className = `es-alert-record${selectedEsAlertId === alert.id ? " selected" : ""}`;
          const heading = document.createElement("div");
          heading.className = "es-alert-record-heading";
          const title = document.createElement("span");
          title.textContent = `${alert.levelLabel} · ${getEsAlertCategoryLabel(alert.category)}`;
          const status = document.createElement("small");
          status.textContent = alert.status === "active"
            ? "Activa"
            : alert.status === "replaced"
              ? `Substituïda · ${alert.endedTime}`
              : `Finalitzada · ${alert.endedTime}`;
          heading.append(title, status);
          const countyText = document.createElement("span");
          countyText.textContent = alert.county;
          const actions = document.createElement("div");
          const select = document.createElement("button");
          select.type = "button";
          select.textContent = selectedEsAlertId === alert.id ? "Seleccionada" : "Selecciona";
          select.addEventListener("click", () => {
            selectedEsAlertId = alert.id;
            renderEsAlertRecords();
          });
          actions.append(select);
          if (alert.status === "active") {
            const finish = document.createElement("button");
            finish.type = "button";
            finish.textContent = "Finalitza alerta";
            finish.addEventListener("click", () => finalizeEsAlert(alert.id));
            actions.append(finish);
          }
          row.append(heading, countyText, actions);
          list.append(row);
        }
        const selectedAlert = esAlerts.find(alert => alert.id === selectedEsAlertId);
        const detail = document.getElementById("es-alert-record-detail");
        if (!selectedAlert) {
          detail.textContent = "";
        } else {
          const status = selectedAlert.status === "active"
            ? "Activa"
            : selectedAlert.status === "replaced"
              ? `Substituïda (${selectedAlert.endedTime})`
              : `Finalitzada (${selectedAlert.endedTime})`;
          detail.textContent = `Comarca: ${selectedAlert.county}\nNivell: ${selectedAlert.levelLabel}\nTipus: ${getEsAlertCategoryLabel(selectedAlert.category)}\nEnviada: ${selectedAlert.sentTime}\nEstat: ${status}\n\n${selectedAlert.message}`;
        }
        const activeCount = esAlerts.filter(alert => alert.status === "active").length;
        document.getElementById("es-alert-active-count").textContent = String(activeCount);
      }

      function renderEsAlertTimeline() {
        const timeline = document.getElementById("es-alert-timeline");
        timeline.replaceChildren();
        const events = esAlerts.flatMap(alert => [
          {
            time: alert.sentAt,
            sequence: alert.sentSequence,
            title: `Enviament · ${alert.levelLabel} · ${getEsAlertCategoryLabel(alert.category)}`,
            text: `${alert.county} · ${alert.sentTime}`
          },
          ...(alert.endedAt === null ? [] : [{
            time: alert.endedAt,
            sequence: alert.endedSequence,
            title: `${alert.status === "replaced" ? "Substitució" : "Finalització"} · ${alert.levelLabel} · ${getEsAlertCategoryLabel(alert.category)}`,
            text: `${alert.county} · ${alert.endedTime}`
          }])
        ]).sort((a, b) => b.time - a.time || b.sequence - a.sequence);
        for (const event of events) {
          const row = document.createElement("div");
          row.className = "es-alert-timeline-entry";
          const title = document.createElement("strong");
          title.textContent = event.title;
          const text = document.createElement("span");
          text.textContent = event.text;
          row.append(title, text);
          timeline.append(row);
        }
      }

      function openEsAlertPanel(incident = null) {
        if (incident && selectedCounties.size === 0) {
          const county = getIncidentCounty(incident);
          if (county) selectedCounties.add(county);
        }
        if (!enabledThematicLayers.has("alert")) setActiveLayer("alert");
        renderSelectedAlertCounties();
        renderEsAlertRecords();
        renderEsAlertTimeline();
        const dialog = document.getElementById("es-alert-dialog");
        if (!dialog.open) dialog.showModal();
        populateEsAlertTemplates(incident ? getIncidentAlertCategory(incident) : suggestEsAlertCategory());
      }

      function applyEsAlertToIncident(alert, incident) {
        if (alert.status !== "active" || isIncidentResolved(incident)) return;
        if (getIncidentCounty(incident) !== alert.county) return;
        if (getIncidentAlertCategory(incident) !== alert.category) return;
        alert.affectedIncidentIds = alert.affectedIncidentIds || [];
        if (alert.affectedIncidentIds.includes(incident.id)) return;
        alert.affectedIncidentIds.push(incident.id);

        hydrateIncident(incident);
        incident.esAlertReductionsByCategory = incident.esAlertReductionsByCategory || {};
        const targetReduction = esAlertLevelDetails[alert.level].reduction;
        const previousReduction = Number(incident.esAlertReductionsByCategory[alert.category]) || 0;
        const additionalReduction = Math.max(0, targetReduction - previousReduction);
        if (additionalReduction === 0) return;
        incident.esAlertReductionsByCategory[alert.category] = targetReduction;
        incident.risk = Math.max(0, (Number(incident.risk) || 0) - additionalReduction);
        const severity = getSeverityFromRisk(incident.risk);
        incident.severity = severity.severity;
        incident.level = severity.level;
        incident.update = `ES-Alert de nivell ${alert.levelLabel} enviada a ${alert.county}. Gravetat actualitzada a ${incident.severity}.`;
        incident.history.unshift({
          time: alert.sentTime,
          text: `${incident.update} Reducció de risc aplicada: ${additionalReduction} punts.`
        });
        refreshIncidentMarker(incident);
        if (selectedId === incident.id) renderDetail(incident);
      }

      function applyEsAlertReduction(alert) {
        alert.affectedIncidentIds = [];
        for (const incident of getActiveIncidents()) applyEsAlertToIncident(alert, incident);
        refreshIncidentList();
      }

      function applyActiveEsAlertsToIncident(incident) {
        for (const alert of esAlerts) {
          if (alert.status === "active") applyEsAlertToIncident(alert, incident);
        }
      }

      function sendEsAlert() {
        const counties = [...selectedCounties];
        const level = document.getElementById("es-alert-level").value;
        const category = document.getElementById("es-alert-category").value;
        const catalan = document.getElementById("es-alert-message-ca").value.trim();
        const spanish = document.getElementById("es-alert-message-es").value.trim();
        const error = document.getElementById("es-alert-form-error");
        if (!counties.length || !esAlertLevelDetails[level] || !esAlertCategoryLabels[category] || !catalan || !spanish) {
          error.textContent = "Cal seleccionar com a mínim una comarca i proporcionar el missatge en català i castellà.";
          error.hidden = false;
          return;
        }
        error.hidden = true;
        const sentAt = simulation.gameTime;
        const sentTime = formatSimulationClock();
        const replacedAlerts = esAlerts.filter(alert =>
          alert.status === "active" && counties.includes(alert.county)
        );
        for (const alert of replacedAlerts) endEsAlert(alert, "replaced", sentAt, sentTime);

        const createdAlerts = counties.map(county => ({
          id: `ES-${Date.now()}-${nextEsAlertSequence++}`,
          county,
          level,
          levelLabel: esAlertLevelDetails[level].label,
          category,
          messageCatalan: catalan,
          messageSpanish: spanish,
          message: `${catalan}\n\n${spanish}`,
          sentAt,
          sentSequence: nextEsAlertEventSequence++,
          sentTime,
          status: "active",
          endedAt: null,
          endedTime: null,
          affectedIncidentIds: []
        }));
        esAlerts.unshift(...createdAlerts);
        const [previewAlert] = createdAlerts;
        selectedEsAlertId = previewAlert.id;
        for (const alert of createdAlerts) applyEsAlertReduction(alert);
        refreshCountyLayer();
        renderEsAlertRecords();
        renderEsAlertTimeline();
        document.getElementById("es-alert-dialog").close();
        openEsAlertPreview(previewAlert);
      }

      function endEsAlert(alert, status, endedAt = simulation.gameTime, endedTime = formatSimulationClock()) {
        alert.status = status;
        alert.endedAt = endedAt;
        alert.endedSequence = nextEsAlertEventSequence++;
        alert.endedTime = endedTime;
        for (const incidentId of alert.affectedIncidentIds) {
          const incident = incidents.find(item => item.id === incidentId);
          if (!incident) continue;
          incident.history.unshift({
            time: alert.endedTime,
            text: `ES-Alert ${alert.id} ${status === "replaced" ? "substituïda" : "finalitzada"} a ${alert.county}. La gravetat de l’emergència no s’ha restaurat.`
          });
          if (selectedId === incident.id) renderDetail(incident);
        }
      }

      function finalizeEsAlert(id) {
        const alert = esAlerts.find(item => item.id === id);
        if (!alert || alert.status !== "active") return;
        endEsAlert(alert, "ended");
        refreshCountyLayer();
        renderEsAlertRecords();
        renderEsAlertTimeline();
      }

      function openEsAlertPreview(alert) {
        const dialog = document.getElementById("es-alert-phone-dialog");
        document.getElementById("es-alert-phone-level").textContent = `ES-Alert · Nivell ${alert.levelLabel}`;
        document.getElementById("es-alert-phone-counties").textContent = `Comarca afectada: ${alert.county}`;
        document.getElementById("es-alert-phone-message").textContent = alert.message;
        const audioStatus = document.getElementById("es-alert-audio-status");
        audioStatus.textContent = "Reproduint el so d’ES-Alert en bucle.";
        dialog.showModal();
        let audio;
        try {
          audio = new Audio("sounds/es-alert-sound.mp3");
          esAlertPreviewAudio = audio;
          audio.loop = true;
          const playback = audio.play();
          if (playback) {
            playback.catch(error => {
              if (esAlertPreviewAudio !== audio || !dialog.open) return;
              console.warn("No s’ha pogut reproduir el so d’ES-Alert.", error);
              audioStatus.textContent = "El navegador no ha permès reproduir el so. L’alerta continua activa.";
            });
          }
        } catch (error) {
          if ((audio && esAlertPreviewAudio !== audio) || !dialog.open) return;
          console.warn("No s’ha pogut iniciar el so d’ES-Alert.", error);
          audioStatus.textContent = "El navegador no ha permès reproduir el so. L’alerta continua activa.";
        }
      }

      function stopEsAlertPreviewAudio() {
        if (!esAlertPreviewAudio) return;
        esAlertPreviewAudio.pause();
        esAlertPreviewAudio.currentTime = 0;
        esAlertPreviewAudio.removeAttribute("src");
        esAlertPreviewAudio.load();
        esAlertPreviewAudio = null;
      }

      document.getElementById("open-es-alert").addEventListener("click", () => openEsAlertPanel());
      document.getElementById("close-es-alert").addEventListener("click", () => document.getElementById("es-alert-dialog").close());
      document.getElementById("cancel-es-alert").addEventListener("click", () => document.getElementById("es-alert-dialog").close());
      document.getElementById("es-alert-form").addEventListener("submit", event => {
        event.preventDefault();
        sendEsAlert();
      });
      document.getElementById("es-alert-level").addEventListener("change", () => populateEsAlertTemplates());
      document.getElementById("es-alert-category").addEventListener("change", () => populateEsAlertTemplates());
      document.getElementById("es-alert-template").addEventListener("change", applyEsAlertTemplate);
      document.getElementById("es-alert-message-ca").addEventListener("input", updateEsAlertComposer);
      document.getElementById("es-alert-message-es").addEventListener("input", updateEsAlertComposer);
      const esAlertPhoneDialog = document.getElementById("es-alert-phone-dialog");
      document.getElementById("close-es-alert-preview").addEventListener("click", () => {
        stopEsAlertPreviewAudio();
        esAlertPhoneDialog.close();
      });
      esAlertPhoneDialog.addEventListener("cancel", stopEsAlertPreviewAudio);
      esAlertPhoneDialog.addEventListener("close", stopEsAlertPreviewAudio);

      function markerIcon(incident, selected) {
        const color = incident.level === "critical" ? "#f05252"
          : incident.level === "high" ? "#f49a4b"
            : incident.level === "warning" ? "#e8c35c"
              : incident.level === "moderate" ? "#58a9e8" : "#57c392";
        return L.divIcon({
          className: "",
          html: `<div class="incident-marker${selected ? " selected" : ""}" style="--marker-color:${color}"><span>!</span></div>`,
          iconSize: [32, 38],
          iconAnchor: [16, 32]
        });
      }

      function refreshIncidentMarker(incident) {
        const marker = markers.get(incident.id);
        if (marker) marker.setIcon(markerIcon(incident, incident.id === selectedId));
      }

      function setActiveLayer(layerName) {
        const layer = thematicLayers[layerName];
        const isEnabled = enabledThematicLayers.has(layerName);
        if (isEnabled) {
          enabledThematicLayers.delete(layerName);
          layer?.removeFrom(map);
        } else {
          enabledThematicLayers.add(layerName);
          layer?.addTo(map);
        }
        const button = document.querySelector(`.layer-option[data-layer="${layerName}"]`);
        if (button) {
          button.classList.toggle("selected", !isEnabled);
          button.setAttribute("aria-pressed", String(!isEnabled));
        }
        if (layerName === "radar") {
          const controls = document.getElementById("weather-controls");
          controls.hidden = isEnabled;
          if (isEnabled) {
            stopRadarPlayback();
            renderRadar();
          }
        }
        if (layerName === "alert") {
          const alertButton = document.getElementById("open-es-alert");
          alertButton.hidden = isEnabled;
          alertButton.disabled = !boundaryDataLoaded;
          refreshCountyLayer();
        }
        renderMapLegend();
      }

      function renderMapLegend() {
        const legends = {
          alert: `
            <span class="map-legend-caption">ES-Alert per comarques</span>
            <span class="map-legend-item"><span class="legend-dot alert-yellow"></span> Baix</span>
            <span class="map-legend-item"><span class="legend-dot alert-orange"></span> Mitjà</span>
            <span class="map-legend-item"><span class="legend-dot alert-red"></span> Alt</span>
            <span class="map-legend-item"><span class="legend-dot alert-none"></span> Sense alerta</span>
            <span class="map-legend-item"><span class="legend-dot alert-selected"></span> Selecció actual</span>`,
          radar: `
            <span class="map-legend-caption">Radar de precipitació · simulació</span>
            <span class="map-legend-item"><span class="legend-dot rain-light"></span> Feble</span>
            <span class="map-legend-item"><span class="legend-dot rain-moderate"></span> Moderada</span>
            <span class="map-legend-item"><span class="legend-dot rain-heavy"></span> Forta</span>
            <span class="map-legend-item"><span class="legend-dot rain-storm"></span> Tempesta</span>`
        };
        const activeLegends = [...enabledThematicLayers].map(layerName => legends[layerName]);
        document.getElementById("map-legend-items").innerHTML = `
            <span class="map-legend-caption">Incidències actives</span>
            <span class="map-legend-item"><span class="legend-dot"></span> Crítica</span>
            <span class="map-legend-item"><span class="legend-dot high"></span> Important</span>
            <span class="map-legend-item"><span class="legend-dot warning"></span> Seguiment</span>
            <span class="map-legend-item"><span class="legend-dot moderate"></span> Baixa</span>
            <span class="map-legend-item"><span class="legend-dot low"></span> Molt baixa</span>
            ${activeLegends.join("")}`;
      }

      const mapLegend = document.getElementById("map-legend");
      const mapLegendToggle = document.getElementById("map-legend-toggle");
      mapLegendToggle.addEventListener("click", () => {
        const isExpanded = mapLegendToggle.getAttribute("aria-expanded") === "true";
        mapLegend.classList.toggle("collapsed", isExpanded);
        mapLegendToggle.setAttribute("aria-expanded", String(!isExpanded));
        mapLegendToggle.setAttribute("aria-label", isExpanded ? "Ampliar la llegenda" : "Contraure la llegenda");
      });

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
      document.querySelectorAll(".layer-option").forEach(button => {
        button.addEventListener("click", event => {
          event.stopPropagation();
          setActiveLayer(button.dataset.layer);
        });
      });
      document.getElementById("open-es-alert").hidden = true;
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
        .simulator-button.pause {
          border-color: rgb(181 149 86 / 40%);
          background: rgb(78 71 55 / 90%);
          color: #fff1d4;
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
          <label class="simulator-speed">
            <span>Velocitat</span>
            <select id="sim-speed" aria-label="Velocitat de simulació">
              <option value="1">1x</option>
              <option value="2">2x</option>
              <option value="4">4x</option>
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
        const speedSelect = document.getElementById("sim-speed");
        speedSelect.addEventListener("change", updateWeatherControls);
        toggleButton.addEventListener("click", () => {
          if (!simulation.started) startSimulation();
          else if (simulation.running) pauseSimulation();
          else resumeSimulation();
        });
        speedSelect.addEventListener("change", event => {
          const nextValue = Number(event.target.value);
          setSimulationSpeed(nextValue);
        });
      }

      const simulation = {
        started: false,
        running: false,
        paused: false,
        speed: 1,
        speedRates: { 1: 1, 2: 2, 4: 4, 5: 60, 10: 360 },
        lastFrame: 0,
        animationFrame: 0,
        gameTime: Date.now(),
        lastGeneratedIncidentAt: Date.now()
      };

      function formatSimulationClock(timestamp = simulation.gameTime) {
        const date = new Date(timestamp);
        const weekday = new Intl.DateTimeFormat("ca-ES", { weekday: "long" }).format(date);
        const hour = new Intl.DateTimeFormat("ca-ES", { hour: "2-digit", minute: "2-digit" }).format(date);
        return `${capitalizeWord(weekday)}, ${hour}`;
      }

      function getIncidentStartTimestamp(time) {
        const match = /^(\d{1,2}):(\d{2})$/.exec(String(time || ""));
        if (!match) return simulation.gameTime;
        const date = new Date(simulation.gameTime);
        date.setHours(Number(match[1]), Number(match[2]), 0, 0);
        const timestamp = date.getTime();
        return timestamp > simulation.gameTime ? timestamp - 24 * 60 * 60 * 1000 : timestamp;
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

      function setSimulationSpeed(value) {
        const normalized = Number(value) || 1;
        simulation.speed = normalized;
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
        if (input.includes("acumul")) return incidentTypeCatalog.waterAccumulation;
        if (input.includes("pluj") || input.includes("plug") || input.includes("tempest")) return incidentTypeCatalog.rain;
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

      function getStableIncidentSeverity(risk, currentLevel, controlled = false) {
        const hysteresis = 5;
        const severityByLevel = {
          critical: { severity: "Crítica", threshold: 85, rank: 4 },
          high: { severity: "Important", threshold: 60, rank: 3 },
          warning: { severity: "Seguiment", threshold: 35, rank: 2 },
          moderate: { severity: "Baixa", threshold: 18, rank: 1 },
          low: { severity: "Molt baixa", threshold: 0, rank: 0 }
        };
        const currentSeverity = severityByLevel[currentLevel];
        const nextSeverity = getSeverityFromRisk(risk);
        const nextLevel = severityByLevel[nextSeverity.level];
        if (!currentSeverity || !nextLevel) return nextSeverity;
        if (controlled && nextLevel.rank > currentSeverity.rank) {
          return { severity: currentSeverity.severity, level: currentLevel };
        }
        if (nextLevel.rank > currentSeverity.rank && risk < nextLevel.threshold + hysteresis) {
          return { severity: currentSeverity.severity, level: currentLevel };
        }
        if (nextLevel.rank < currentSeverity.rank && risk >= currentSeverity.threshold - hysteresis) {
          return { severity: currentSeverity.severity, level: currentLevel };
        }
        return nextSeverity;
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
        const services = currentIncident.services || [];
        const serviceRows = services.length ? services.map(([name, count]) => `
          <div class="info-row">
            <span class="resource-name">
              <span class="resource-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none"><path d="M4 19h16M6 19V8l6-4 6 4v11M9 11h.01M15 11h.01M9 15h.01M15 15h.01" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </span>${name}
            </span>
            <span class="resource-count">${count}</span>
          </div>`).join("") : `<p class="timeline-copy">Encara no s’ha mobilitzat cap servei.</p>`;

        const actionMarkup = `
          <button class="action-button primary" data-action="assign" type="button">Assignar recursos</button>
          <button class="action-button" data-action="observe" type="button">Registrar observació</button>
          <button class="action-button" data-action="control" type="button">Marcar controlat</button>
          <button class="action-button" data-action="es-alert" type="button">Enviar ES-Alert</button>
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
              <div><span class="info-label">Risc població</span><span class="info-value" data-incident-risk>${Math.round(currentIncident.risk || 52)}%</span></div>
            </div>
          </section>
          <section class="detail-section">
            <h3 class="detail-section-title">Serveis mobilitzats <span class="section-trailing">${services.length} ${services.length === 1 ? "organisme" : "organismes"}</span></h3>
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

        detailPanel.querySelectorAll(".action-button").forEach(button => {
          const action = button.dataset.action;
          button.disabled = isIncidentResolved(currentIncident) ||
            (action === "control" && currentIncident.state === "Controlat");
          button.addEventListener("click", () => {
            if (action === "assign") assignIncidentResources(currentIncident.id);
            else if (action === "observe") addIncidentObservation(currentIncident.id);
            else if (action === "control") setIncidentState(currentIncident.id, "Controlat");
            else if (action === "es-alert") openEsAlertPanel(currentIncident);
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
        if (normalized === "Controlat") {
          controlIncident(incident, "Incidència controlada; el risc i la gravetat s’han reduït.");
        } else {
          incident.state = normalized;
          incident.update = `Canvi d’estat: ${normalized}.`;
          incident.history = incident.history || [];
          incident.history.unshift({ time: formatSimulationClock(), text: `Estat actualitzat a ${normalized}.` });
        }
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
        refreshIncidentMarker(incident);
        if (selectedId === id && !isIncidentResolved(incident)) renderDetail(incident);
        return incident;
      }

      function lowerIncidentSeverity(incident) {
        const currentSeverity = getSeverityFromRisk(incident.risk);
        const nextRiskCeiling = {
          critical: 84,
          high: 59,
          warning: 34,
          moderate: 17
        }[currentSeverity.level];
        if (nextRiskCeiling === undefined) return false;
        incident.risk = Math.min(incident.risk, nextRiskCeiling);
        const nextSeverity = getSeverityFromRisk(incident.risk);
        incident.severity = nextSeverity.severity;
        incident.level = nextSeverity.level;
        return true;
      }

      function controlIncident(incident, update) {
        const wasControlled = incident.state === "Controlat";
        if (!wasControlled) incident.controlledAt = simulation.gameTime;
        incident.state = "Controlat";
        if (!wasControlled) lowerIncidentSeverity(incident);
        incident.update = update;
        incident.history = incident.history || [];
        incident.history.unshift({ time: formatSimulationClock(), text: `${update} Gravetat actual: ${incident.severity}.` });
        refreshIncidentMarker(incident);
      }

      const incidentResourceOptions = {
        forestFire: ["Bombers", "Agents Rurals", "Protecció Civil", "Mossos d’Esquadra"],
        flood: ["Bombers", "Protecció Civil", "Mossos d’Esquadra", "Agència Catalana de l’Aigua"],
        waterAccumulation: ["Bombers", "Protecció Civil", "Mossos d’Esquadra", "Agència Catalana de l’Aigua"],
        rain: ["Bombers", "Protecció Civil", "Mossos d’Esquadra", "Agència Catalana de l’Aigua"],
        traffic: ["SEM", "Mossos d’Esquadra", "Bombers", "Protecció Civil"],
        chemical: ["Bombers", "Mossos d’Esquadra", "SEM", "Protecció Civil"],
        medical: ["SEM", "Mossos d’Esquadra", "Protecció Civil"]
      };
      const incidentResolutionMinutes = {
        forestFire: 360,
        flood: 240,
        waterAccumulation: 150,
        rain: 180,
        traffic: 120,
        chemical: 480,
        medical: 360
      };

      function openResourceAssignmentDialog(incident) {
        resourceAssignmentIncidentId = incident.id;
        const resources = incidentResourceOptions[incident.typeKey] || ["Bombers", "Mossos d’Esquadra", "SEM", "Protecció Civil"];
        resourceAssignmentOptions.innerHTML = resources.map((name, index) => `
          <div class="resource-assignment-row">
            <label class="resource-assignment-label">
              <input type="checkbox" name="resource" value="${name}">
              ${name}
            </label>
            <span class="resource-assignment-quantity">
              <input type="number" name="quantity" min="1" max="50" value="1" aria-label="Nombre d’unitats de ${name}" disabled>
              unitats
            </span>
          </div>`).join("");
        resourceAssignmentError.hidden = true;
        resourceDialog.showModal();
      }

      resourceAssignmentOptions.addEventListener("change", event => {
        if (event.target.matches('input[type="checkbox"]')) {
          event.target.closest(".resource-assignment-row").querySelector('input[type="number"]').disabled = !event.target.checked;
        }
      });
      resourceAssignmentForm.addEventListener("submit", event => {
        event.preventDefault();
        const assignments = [...resourceAssignmentOptions.querySelectorAll(".resource-assignment-row")]
          .filter(row => row.querySelector('input[type="checkbox"]').checked)
          .map(row => ({
            name: row.querySelector('input[type="checkbox"]').value,
            count: Number(row.querySelector('input[type="number"]').value)
          }));
        if (!assignments.length) {
          resourceAssignmentError.hidden = false;
          return;
        }
        assignIncidentResources(resourceAssignmentIncidentId, assignments);
        resourceDialog.close();
      });
      document.getElementById("close-resource-dialog").addEventListener("click", () => resourceDialog.close());
      document.getElementById("cancel-resource-assignment").addEventListener("click", () => resourceDialog.close());
      resourceDialog.addEventListener("close", () => {
        resourceAssignmentIncidentId = null;
      });

      function assignIncidentResources(id, assignments = null) {
        const incident = incidents.find(item => item.id === id);
        if (!incident) return null;
        hydrateIncident(incident);
        if (!assignments) {
          openResourceAssignmentDialog(incident);
          return incident;
        }
        if (!Array.isArray(assignments) || assignments.length === 0 ||
          assignments.some(({ name, count }) =>
            typeof name !== "string" || !name.trim() || !Number.isInteger(count) || count < 1 || count > 50
          )) {
          throw new Error("Cal assignar com a mínim un recurs amb una quantitat entre 1 i 50 unitats.");
        }
        let assignedCount = 0;
        for (const { name, count } of assignments) {
          const existingService = incident.services.find(service => service[0] === name);
          const existingCount = existingService ? Number.parseInt(existingService[1], 10) : 0;
          const nextCount = (Number.isFinite(existingCount) ? existingCount : 0) + count;
          if (existingService) existingService[1] = `${nextCount} ${nextCount === 1 ? "unitat" : "unitats"}`;
          else incident.services.push([name, `${count} ${count === 1 ? "unitat" : "unitats"}`]);
          assignedCount += count;
        }
        incident.resourcesAssigned += assignedCount;
        if (!incident.assignedAt || incident.assignedAt === 0) {
          incident.assignedAt = simulation.gameTime;
        }
        if (incident.state !== "Controlat") incident.state = "En intervenció";
        const resourceSummary = assignments.map(({ name, count }) => `${name}: ${count}`).join(", ");
        incident.update = `Recursos assignats (${resourceSummary} unitats).`;
        incident.history = incident.history || [];
        incident.history.unshift({ time: formatSimulationClock(), text: `Recursos mobilitzats: ${resourceSummary}.` });
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
        incident.services = Array.isArray(incident.services) ? incident.services : [];
        incident.coordinates = incident.coordinates || [41.8, 1.9];
        incident.description = incident.description || "Incidència creada manualment al sistema de simulació.";
      }

      function createIncident(details = {}) {
        const incident = { ...details };
        ensureIncidentGeneratesOwnDetails(incident);
        incident.createdAt = Number.isFinite(incident.createdAt)
          ? incident.createdAt
          : getIncidentStartTimestamp(incident.time);
        hydrateIncident(incident);
        const id = incident.id || `INC-${Date.now().toString().slice(-6)}`;
        incident.id = id;
        incidents.unshift(incident);
        const marker = L.marker(incident.coordinates, { icon: markerIcon(incident, false) }).addTo(map);
        marker.bindTooltip(`${incident.type} · ${incident.shortLocation}`, { direction: "top", offset: [0, -22] });
        marker.on("click", () => {
          selectIncident(incident.id, true);
          document.querySelector(`[data-id="${incident.id}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
        });
        markers.set(incident.id, marker);
        applyActiveEsAlertsToIncident(incident);
        refreshIncidentList();
        return incident;
      }

      const fallbackScenarioMunicipalities = [
        { feature: { properties: { nom_municipi: "Barcelona", nom_comarca: "Barcelonès" } }, coordinates: { lat: 41.3874, lng: 2.1686 } },
        { feature: { properties: { nom_municipi: "Girona", nom_comarca: "Gironès" } }, coordinates: { lat: 41.9794, lng: 2.8214 } },
        { feature: { properties: { nom_municipi: "Lleida", nom_comarca: "Segrià" } }, coordinates: { lat: 41.6176, lng: 0.6200 } },
        { feature: { properties: { nom_municipi: "Tarragona", nom_comarca: "Tarragonès" } }, coordinates: { lat: 41.1189, lng: 1.2445 } },
        { feature: { properties: { nom_municipi: "Vic", nom_comarca: "Osona" } }, coordinates: { lat: 41.9300, lng: 2.2540 } }
      ];

      function generateScenarioIncident() {
        const templates = [
          { type: "Incendi forestal", description: "Foc de vegetació amb propagació afavorida per les condicions locals.", typeMeta: incidentTypeCatalog.forestFire, weight: 1 },
          { type: "Accident de trànsit greu", description: "Col·lisió amb afectació a la circulació i necessitat d’atenció als implicats.", typeMeta: incidentTypeCatalog.traffic, weight: 1 },
          { type: "Accident químic", description: "Possible fuita de material perillós amb risc de confinament preventiu.", typeMeta: incidentTypeCatalog.chemical, weight: 1 },
          { type: "Emergència sanitària col·lectiva", description: "Diverses persones afectades amb necessitat de coordinació sanitària.", typeMeta: incidentTypeCatalog.medical, weight: 0.05 }
        ];
        const random = weatherModel.random || Math.random;
        const totalTemplateWeight = templates.reduce((total, candidate) => total + candidate.weight, 0);
        let templateSelection = random() * totalTemplateWeight;
        let template = templates[templates.length - 1];
        for (const candidate of templates) {
          templateSelection -= candidate.weight;
          if (templateSelection < 0) {
            template = candidate;
            break;
          }
        }
        const isPopulationSensitive = template.typeMeta.id === "forestFire" || template.typeMeta.id === "chemical";
        const availableMunicipalities = scenarioMunicipalityLocations.length
          ? scenarioMunicipalityLocations
          : fallbackScenarioMunicipalities;
        const municipalities = availableMunicipalities.map(municipality => ({
          ...municipality,
          weight: isPopulationSensitive
            ? municipalityPopulationWeights.get(normalizeAdministrativeName(municipality.feature.properties.nom_municipi)) || 1
            : 1
        }));
        if (municipalities.length === 0) {
          throw new Error("No hi ha municipis amb coordenades vàlides per generar una incidència.");
        }
        const totalWeight = municipalities.reduce((total, municipality) => total + municipality.weight, 0);
        let selection = random() * totalWeight;
        let selectedMunicipality = municipalities[municipalities.length - 1];
        for (const municipality of municipalities) {
          selection -= municipality.weight;
          if (selection < 0) {
            selectedMunicipality = municipality;
            break;
          }
        }
        const municipalityName = selectedMunicipality.feature.properties.nom_municipi;
        const countyName = selectedMunicipality.feature.properties.nom_comarca;
        const baseRisk = template.typeMeta.defaultRisk || 52;
        return createIncident({
          id: `INC-${Date.now().toString().slice(-6)}`,
          type: template.type,
          shortLocation: municipalityName,
          location: `${municipalityName} · ${countyName}`,
          coordinates: [
            selectedMunicipality.coordinates.lat,
            selectedMunicipality.coordinates.lng
          ],
          description: `${template.description} Municipi afectat: ${municipalityName}.`,
          severity: getSeverityFromRisk(baseRisk).severity,
          level: getSeverityFromRisk(baseRisk).level,
          state: "Detectat",
          risk: baseRisk,
          populationRisk: template.typeMeta.populationRisk * 100,
          calls: "1 comunicació",
          services: [],
          update: "Nova incidència generada automàticament segons l’escenari de coordinació.",
          time: formatSimulationClock(),
          actions: template.typeMeta.actionList,
          consequences: [template.typeMeta.summary]
        });
      }

      function evaluateWeatherExposure(municipality, timestamp = simulation.gameTime) {
        const precipitation = getPrecipitationAt(municipality.coordinates.lat, municipality.coordinates.lng, timestamp);
        const accumulation = getAccumulatedRainfall(municipality.coordinates.lat, municipality.coordinates.lng, timestamp);
        const risk = Math.min(96, precipitation.intensity * 1.8 + accumulation.amount * 2.4);
        return {
          precipitation,
          accumulatedRainfall: accumulation.amount,
          stormId: precipitation.stormId || accumulation.stormId,
          risk
        };
      }

      function processWeatherIncidents() {
        if (weatherModel.seed === null) return false;
        for (const incident of incidents) {
          if (!incident.weatherStormId || isIncidentResolved(incident)) continue;
          const exposure = evaluateWeatherExposure({
            coordinates: { lat: incident.coordinates[0], lng: incident.coordinates[1] }
          });
          incident.accumulatedRainfall = Math.max(incident.accumulatedRainfall || 0, exposure.accumulatedRainfall);
          const nextRisk = Math.max(incident.risk || 0, Math.min(96, 35 + exposure.risk * 0.7));
          const nextSeverity = getStableIncidentSeverity(nextRisk, incident.level);
          if (nextSeverity.severity !== incident.severity) {
            incident.risk = nextRisk;
            incident.severity = nextSeverity.severity;
            incident.level = nextSeverity.level;
            refreshIncidentMarker(incident);
            incident.update = `L’acumulació de pluja arriba a ${incident.accumulatedRainfall.toFixed(1)} mm.`;
            incident.history.unshift({ time: formatSimulationClock(), text: incident.update });
            if (selectedId === incident.id) renderDetail(incident);
            refreshIncidentList();
          } else {
            incident.risk = nextRisk;
          }
        }

        const municipalities = scenarioMunicipalityLocations.length
          ? scenarioMunicipalityLocations
          : fallbackScenarioMunicipalities;
        const impactedMunicipalities = municipalities.map(municipality => ({
          municipality,
          exposure: evaluateWeatherExposure(municipality)
        })).filter(({ exposure }) =>
          exposure.stormId &&
          exposure.risk >= 55 &&
          (
            exposure.precipitation.intensity >= 20 && exposure.accumulatedRainfall >= 7 ||
            exposure.precipitation.intensity >= 12 && exposure.accumulatedRainfall >= 18 ||
            exposure.accumulatedRainfall >= 30
          )
        );
        if (!impactedMunicipalities.length) return false;

        impactedMunicipalities.sort((a, b) => b.exposure.risk - a.exposure.risk);
        const selected = impactedMunicipalities[0];
        const { municipality, exposure } = selected;
        const municipalityName = municipality.feature.properties.nom_municipi;
        const countyName = municipality.feature.properties.nom_comarca;
        const episodeKey = exposure.stormId;
        const existingIncident = incidents.find(incident =>
          incident.weatherStormId === episodeKey && !isIncidentResolved(incident)
        );
        if (existingIncident) {
          const previousRainfall = existingIncident.accumulatedRainfall || 0;
          existingIncident.accumulatedRainfall = Math.max(previousRainfall, exposure.accumulatedRainfall);
          existingIncident.risk = Math.max(existingIncident.risk, Math.min(96, 35 + exposure.risk * 0.7));
          if (existingIncident.accumulatedRainfall >= previousRainfall + 3) {
            existingIncident.update = `La pluja s’intensifica a ${municipalityName}: ${exposure.precipitation.intensity.toFixed(1)} mm/h i ${existingIncident.accumulatedRainfall.toFixed(1)} mm acumulats.`;
            existingIncident.history.unshift({ time: formatSimulationClock(), text: existingIncident.update });
            refreshIncidentMarker(existingIncident);
            refreshIncidentList();
          }
          return true;
        }
        if (weatherModel.createdEpisodes.has(episodeKey)) return true;

        weatherModel.createdEpisodes.add(episodeKey);
        const occurrenceChance = Math.min(0.2, 0.06 + Math.max(0, exposure.risk - 55) * 0.0035);
        if (weatherModel.random() > occurrenceChance) return true;
        const isFlood = exposure.accumulatedRainfall >= 30 || exposure.precipitation.intensity >= 32;
        const isWaterAccumulation = !isFlood &&
          exposure.precipitation.intensity >= 12 &&
          exposure.accumulatedRainfall >= 18;
        const incidentType = isFlood
          ? "Inundació urbana"
          : isWaterAccumulation ? "Acumulació d’aigua" : "Pluges molt intenses";
        const incidentRisk = Math.min(96, Math.round(35 + exposure.risk * 0.7));
        const severity = getSeverityFromRisk(incidentRisk);
        const rainfallDescription = `Pluja de ${exposure.precipitation.intensity.toFixed(1)} mm/h i acumulació de ${exposure.accumulatedRainfall.toFixed(1)} mm.`;
        const incident = createIncident({
          id: `INC-PL-${Math.floor(simulation.gameTime)}-${weatherModel.createdEpisodes.size}`,
          type: incidentType,
          shortLocation: municipalityName,
          location: `${municipalityName} · ${countyName}`,
          coordinates: [municipality.coordinates.lat, municipality.coordinates.lng],
          description: `${isFlood ? "Possible inundació amb afectació a punts baixos i vies" : isWaterAccumulation ? "Acumulació d’aigua amb possible afectació a la mobilitat" : "Precipitació intensa amb risc local d’acumulació d’aigua"} a ${municipalityName}. ${rainfallDescription}`,
          severity: severity.severity,
          level: severity.level,
          state: "Detectat",
          risk: incidentRisk,
          calls: "1 comunicació del 112",
          services: [],
          update: "Seguiment d’una afectació meteorològica confirmada pel radar.",
          time: formatSimulationClock(),
          weatherStormId: exposure.stormId,
          weatherEpisodeKey: episodeKey,
          accumulatedRainfall: exposure.accumulatedRainfall,
          history: [{ time: formatSimulationClock(), text: `Incidència generada per precipitació intensa detectada al radar. ${rainfallDescription}` }]
        });
        if (incident && selectedId === incident.id) renderDetail(incident);
        return true;
      }

      function evolveIncidents(secondsElapsed) {
        const factor = secondsElapsed / 60;
        let shouldRefreshIncidentList = false;
        for (const incident of incidents) {
          hydrateIncident(incident);
          ensureIncidentState(incident);
          if (/Tancat|Resolut/i.test(incident.state)) continue;
          let incidentDetailsChanged = false;

          const threat = {
            forestFire: 0.8,
            flood: 0.55,
            waterAccumulation: 0.42,
            rain: 0.4,
            traffic: 0.38,
            chemical: 0.7,
            medical: 0.2
          }[incident.typeKey] || 0.3;
          const trend = Math.sin((simulation.gameTime / 180000) + incident.coordinates[0] + incident.coordinates[1]) * 0.6;
          const resourceModifier = incident.resourcesAssigned
            ? -0.75 - Math.min(incident.resourcesAssigned, 6) * 0.1
            : 0.18;
          const controlModifier = incident.state === "Controlat" ? -0.45 : 0;
          const riskDelta = (trend + threat + resourceModifier + controlModifier) * factor;
          incident.risk = Math.max(6, Math.min(96, (incident.risk || 50) + riskDelta));

          const nextSeverity = getStableIncidentSeverity(
            incident.risk,
            incident.level,
            incident.state === "Controlat"
          );
          if (incident.severity !== nextSeverity.severity) {
            incident.severity = nextSeverity.severity;
            incident.level = nextSeverity.level;
            refreshIncidentMarker(incident);
            incident.update = `Gravetat actualitzada a ${nextSeverity.severity.toLowerCase()} segons l’evolució del focus.`;
            incident.history = incident.history || [];
            incident.history.unshift({ time: formatSimulationClock(), text: `Gravetat actualitzada: ${nextSeverity.severity}.` });
            shouldRefreshIncidentList = true;
            incidentDetailsChanged = true;
          }

          if (incident.risk > 76 && !/En intervenció|Controlat|Resolut|Tancat/.test(incident.state)) {
            incident.state = "En intervenció";
            incident.update = "L’incident requereix intervenció activa i coordinació dels recursos disponibles.";
            incident.history.unshift({ time: formatSimulationClock(), text: "Estat actualitzat a En intervenció." });
            shouldRefreshIncidentList = true;
            incidentDetailsChanged = true;
          }

          const elapsedAssignedTime = incident.assignedAt ? (simulation.gameTime - incident.assignedAt) : 0;
          const resolutionMinutes = incidentResolutionMinutes[incident.typeKey] || 240;
          const resolutionDuration = resolutionMinutes * 60 * 1000;
          const elapsedControlledTime = incident.controlledAt
            ? simulation.gameTime - incident.controlledAt
            : 0;
          if (incident.resourcesAssigned > 0 &&
            elapsedAssignedTime >= resolutionDuration * 0.25 &&
            incident.state !== "Controlat") {
            controlIncident(incident, "La intervenció ha contingut l’incident; se’n monitoritza l’evolució.");
            shouldRefreshIncidentList = true;
            incidentDetailsChanged = true;
          }

          const resolutionTimeReached = incident.resourcesAssigned > 0
            ? elapsedAssignedTime >= resolutionDuration
            : incident.controlledAt && elapsedControlledTime >= resolutionDuration;
          if (resolutionTimeReached) {
            incident.state = "Tancat";
            incident.update = "La incidència s’ha resolt després del temps estimat d’intervenció.";
            incident.history.unshift({ time: formatSimulationClock(), text: "Incidència resolta i tancada automàticament." });
            const marker = markers.get(incident.id);
            if (marker) {
              marker.remove();
              markers.delete(incident.id);
            }
            if (selectedId === incident.id) closeDetail();
            shouldRefreshIncidentList = true;
            continue;
          }

          if (selectedId === incident.id) {
            const riskDisplay = detailPanel.querySelector("[data-incident-risk]");
            if (riskDisplay) riskDisplay.textContent = `${Math.round(incident.risk)}%`;
            if (incidentDetailsChanged) renderDetail(incident);
          }
        }
        if (shouldRefreshIncidentList) refreshIncidentList();
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
        evolveWeatherModel();
        updateSimulationClock();
        evolveIncidents(gameSeconds);

        if (simulation.gameTime - simulation.lastGeneratedIncidentAt > 18 * 60 * 1000) {
          if (!processWeatherIncidents()) generateScenarioIncident();
          simulation.lastGeneratedIncidentAt = simulation.gameTime;
        }
        if (enabledThematicLayers.has("radar") &&
          simulation.gameTime - radarState.lastSimulationRenderTime >= 5 * 60000) {
          renderRadar();
        }

        simulation.animationFrame = requestAnimationFrame(stepSimulation);
      }

      function startSimulation() {
        if (simulation.running) return;
        if (weatherModel.seed === null) initializeWeatherModel();
        refreshRadarLayer();
        simulation.started = true;
        simulation.running = true;
        simulation.paused = false;
        simulation.lastFrame = performance.now();
        const toggleButton = document.getElementById("toggle-sim");
        if (toggleButton) {
          toggleButton.textContent = "Pausar";
          toggleButton.classList.add("pause");
        }
        refreshIncidentList();
        stepSimulation();
      }

      function pauseSimulation() {
        if (!simulation.running) return;
        simulation.running = false;
        simulation.paused = true;
        const toggleButton = document.getElementById("toggle-sim");
        if (toggleButton) {
          toggleButton.textContent = "Reprendre";
          toggleButton.classList.remove("pause");
        }
        if (simulation.animationFrame) cancelAnimationFrame(simulation.animationFrame);
      }

      function resumeSimulation() {
        if (simulation.running || !simulation.started) return;
        simulation.running = true;
        simulation.paused = false;
        simulation.lastFrame = performance.now();
        const toggleButton = document.getElementById("toggle-sim");
        if (toggleButton) {
          toggleButton.textContent = "Pausar";
          toggleButton.classList.add("pause");
        }
        stepSimulation();
      }

      function stopSimulation() {
        if (!simulation.started && !simulation.running) return;
        if (simulation.animationFrame) cancelAnimationFrame(simulation.animationFrame);
        simulation.running = false;
        simulation.started = false;
        simulation.paused = false;
        const toggleButton = document.getElementById("toggle-sim");
        if (toggleButton) {
          toggleButton.textContent = "Iniciar";
          toggleButton.classList.remove("pause");
        }
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
        window.weatherSimulation = {
          get seed() { return weatherModel.seed; },
          get storms() { return weatherModel.storms.map(storm => ({ ...storm })); },
          getWeatherAt,
          getForecast: (latitude, longitude) => [0, 1, 2, 3].map(hours =>
            getWeatherAt(latitude, longitude, simulation.gameTime + hours * 3600000)
          )
        };
      }

      function initializeSimulation() {
        setupSimulationUI();
        updateSimulationClock();
        incidents.forEach(incident => {
          hydrateIncident(incident);
          ensureIncidentGeneratesOwnDetails(incident);
          incident.createdAt = Number.isFinite(incident.createdAt)
            ? incident.createdAt
            : getIncidentStartTimestamp(incident.time);
          incident.time = incident.time || formatSimulationClock();
          if (!incident.history || incident.history.length === 0) {
            incident.history = [{ time: formatSimulationClock(), text: "Incidència registrada a la sala de coordinació." }];
          }
          incident.assignedAt = incident.assignedAt || 0;
        });
        bindGlobalSimulationAPI();
        document.getElementById("sim-speed").value = String(simulation.speed);
      }

      initializeSimulation();

      renderIncidentList = function() {
        if (!list) return;
        const severityOrder = { critical: 4, high: 3, warning: 2, moderate: 1, low: 0 };
        const sortMode = document.getElementById("incident-sort").value;
        const visibleIncidents = getActiveIncidents().sort((a, b) => {
          if (sortMode === "type") return a.type.localeCompare(b.type, "ca");
          if (sortMode === "newest") return b.createdAt - a.createdAt;
          if (sortMode === "oldest") return a.createdAt - b.createdAt;
          return (severityOrder[b.level || "high"] || 0) - (severityOrder[a.level || "high"] || 0);
        });
        const countBadge = document.querySelector(".count-badge");
        if (countBadge) {
          countBadge.textContent = String(visibleIncidents.length);
          countBadge.setAttribute("aria-label", `${visibleIncidents.length} emergències`);
        }

        list.innerHTML = "";
        if (visibleIncidents.length === 0) {
          const emptyState = document.createElement("div");
          emptyState.className = "list-caption";
          emptyState.textContent = simulation.started
            ? "Esperant noves emergències..."
            : "Inicia el torn per rebre emergències";
          list.append(emptyState);
          return;
        }
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

      document.getElementById("incident-sort").addEventListener("change", renderIncidentList);
      renderIncidentList();
      if (selectedId) setTimeout(() => selectIncident(selectedId, false), 80);
