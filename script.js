const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const cartes = [
    {
        id: "1",
        titre: "Panthéon",
        image: "images/panthéon.jpg",
        texte: "Un des campus où vous pouvez suivre notre formation.",
    },
    {
        id: "2",
        titre: "centre Pierre Mendes France",
        image: "images/tolbiac.jpg",
        texte: "un autre campus où vous pouvez suivre notre formation",
    },
];
const carte = cartes.find(c => c.id === id);

const container = document.getElementById("card-details");

if (carte) {
    container.innerHTML = `
    <h2>${carte.titre}</h2>
    <img src="${carte.image}" alt="${carte.titre}" style="width:400px;">
    <p>${carte.texte}</p>
    `;
} else {
    container.innerHTML = "<p>Carte non trouvée.</p>";
}
