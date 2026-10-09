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
      map.on("click", event => {
        if (selectedId && !event.originalEvent.target.closest(".leaflet-marker-icon")) closeDetail();
      });
