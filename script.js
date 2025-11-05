// utilitaire : normaliser (supprime accents + passe en minuscules)
function normalizeStr(s) {
  if (!s) return "";
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const genre = params.get("genre");

  // --- données ---
  const cartes = [
    {
      id: "1",
      titre: "Panthéon",
      image: "images/panthéon.jpg",
      texte: "Un des campus où vous pouvez suivre notre formation.",
      genre: "action",
      pins: [
        { coords: [48.8425, 2.3393], label: "panthéon" },
        { coords: [48.82623, 2.36085], label: "autre campus" }
      ],
      zoom: 16
    },
    {
      id: "2",
      titre: "Centre Pierre Mendes France",
      image: "images/tolbiac.jpg",
      texte: "un autre campus où vous pouvez suivre notre formation",
      genre: "comédie",
      pins: [
        { coords: [48.82623, 2.36085], label: "centre Tolbiac" }
      ],
      zoom: 16
    }
  ];

  // --- conteneurs potentiels ---
  const cardsContainer = document.getElementById("cards-container"); // pages.html
  const detailContainer = document.getElementById("card-details"); // view.html
  const pageTitle = document.getElementById("page-title") || document.querySelector("h1");

  console.log("params:", { id, genre });

  // --- affichage par genre (pages.html) ---
  if (genre) {
    if (!cardsContainer) {
      console.warn("pages.html: #cards-container introuvable. Vérifie l'ID dans ton HTML.");
    } else {
      // vider avant d'ajouter
      cardsContainer.innerHTML = "";

      // filtrage robuste (accents, casse)
      const filtered = cartes.filter(c => normalizeStr(c.genre) === normalizeStr(genre));
      console.log("cartes filtrées:", filtered);

      if (pageTitle) pageTitle.textContent = `Films du genre : ${genre}`;

      if (filtered.length === 0) {
        const p = document.createElement("p");
        p.textContent = "Aucun film trouvé pour ce genre.";
        cardsContainer.appendChild(p);
      } else {
        // créer chaque carte proprement (évite innerHTML +=)
        filtered.forEach(carte => {
          const link = document.createElement("a");
          link.href = `view.html?id=${encodeURIComponent(carte.id)}`;
          link.style.textDecoration = "none";
          link.style.color = "black";

          const card = document.createElement("div");
          card.className = "card"; // applique ton CSS existant

          const img = document.createElement("img");
          img.src = carte.image;
          img.alt = carte.titre;

          const titre = document.createElement("p");
          titre.textContent = carte.titre;

          card.appendChild(img);
          card.appendChild(titre);
          link.appendChild(card);
          cardsContainer.appendChild(link);
        });
      }
    }
  }

  // --- affichage détaillé par id (view.html) ---
  if (id) {
    if (!detailContainer) {
      console.warn("view.html: #card-details introuvable. Vérifie l'ID dans ton HTML.");
    } else {
      const carte = cartes.find(c => c.id === id);
      if (!carte) {
        detailContainer.innerHTML = "<p>Carte non trouvée.</p>";
      } else {
        detailContainer.innerHTML = `
          <h2>${carte.titre}</h2>
          <img src="${carte.image}" alt="${carte.titre}" style="width:400px;">
          <p>${carte.texte}</p>
          <div id="map" style="width:400px;height:300px;margin-top:20px;border-radius:10px;"></div>
        `;

        // initialiser Leaflet seulement si la lib L existe et si carte.pins est défini
        if (typeof L !== "undefined" && Array.isArray(carte.pins) && carte.pins.length > 0) {
          try {
            const map = L.map("map");
            const latlngs = carte.pins.map(pin => pin.coords);
            map.fitBounds(latlngs, { padding: [50, 50] });

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              maxZoom: 19,
              attribution: "© OpenStreetMap"
            }).addTo(map);

            map.attributionControl.setPrefix(false);

            carte.pins.forEach(pin => {
              L.marker(pin.coords).addTo(map).bindPopup(pin.label);
            });
          } catch (err) {
            console.error("Erreur initialisation Leaflet:", err);
            document.getElementById("map").textContent = "Impossible d'afficher la carte.";
          }
        } else {
          // si Leaflet non chargé, montrer message informatif
          if (typeof L === "undefined") {
            console.warn("Leaflet non chargé. Ajoute les <link>/<script> de Leaflet dans view.html si tu veux la carte.");
            document.getElementById("map").textContent = "Librairie de carte non chargée.";
          } else {
            document.getElementById("map").textContent = "Aucune position disponible.";
          }
        }
      }
    }
  }
});