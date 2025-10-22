const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const cartes = [
    {
        id: "1",
        titre: "Panthéon",
        image: "images/panthéon.jpg",
        texte: "Un des campus où vous pouvez suivre notre formation.",
        coords: [48.8425, 2.3393],
        zoom: 16,
    },
    {
        id: "2",
        titre: "centre Pierre Mendes France",
        image: "images/tolbiac.jpg",
        texte: "un autre campus où vous pouvez suivre notre formation",
        coords: [48.82623, 2.36085],
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
const map = L.map("map").setView(carte.coords, carte.zoom);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
  }).addTo(map);

const marker = L.marker(carte.coords).addTo(map);
  marker.bindPopup(`<b>${carte.titre}</b>`).openPopup();

} else {
  container.innerHTML = "<p>Carte non trouvée.</p>";
}


