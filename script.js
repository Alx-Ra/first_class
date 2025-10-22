const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const cartes = [
    {
        id: "1",
        titre: "Panthéon",
        image: "images/panthéon.jpg",
        texte: "Un des campus où vous pouvez suivre notre formation.",
        pins: [
            {coords: [48.8425, 2.3393], label: "panthéon"},
            {coords: [48.82623, 2.36085], label: "autre campus"},
        ],
        zoom: 16,
    },
    {
        id: "2",
        titre: "centre Pierre Mendes France",
        image: "images/tolbiac.jpg",
        texte: "un autre campus où vous pouvez suivre notre formation",
        pins: [
            {coords: [48.82623, 2.36085], label: "centre Tolbiac"},
        ],
        zoom: 16,
    },
];
const carte = cartes.find(c => c.id === id);

const container = document.getElementById("card-details");

if (carte) {
    container.innerHTML = `
    <h2>${carte.titre}</h2>
    <img src="${carte.image}" alt="${carte.titre}" style="width:400px;">
    <p>${carte.texte}</p>
    <div id="map" style="width:400px;height:300px;margin-top:20px;border-radius:10px;"></div>
    `;
const map = L.map("map");
const latlngs = carte.pins.map(pin => pin.coords);
map.fitBounds(latlngs, {padding: [50, 50]});

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);

map.attributionControl.setPrefix(false);

carte.pins.forEach(pin => {
    L.marker(pin.coords).addTo(map).bindPopup(`${pin.label}`);
});

} else {
  container.innerHTML = "<p>Carte non trouvée.</p>";
}


