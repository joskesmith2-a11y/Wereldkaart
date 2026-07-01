// =====================
// DATA
// =====================

const jos = ["Denmark","Tunisia","Mexico"];

const nick = ["Egypt","Turkey","United Arab Emirates","China","Philippines","Vietnam","Latvia","Montenegro","Canary Islands"];

const both = ["Malta","Croatia","Luxembourg","Portugal","France","United Kingdom","Thailand","Belgium","Austria","Italy","India","Nepal","Hungary","Greece"];

const together = ["Germany","Spain","Poland","Czech Republic"];

// =====================
// COLORS
// =====================

const colors = {
  jos: "#8B5CF6",
  nick: "#7DD3FC",
  both: "#F472B6",
  together: "#EC4899"
};

let currentFilter = "all";

// =====================
// MAP
// =====================

const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 5
}).addTo(map);

// =====================
// HELPER
// =====================

function getCategory(country) {
  if (together.includes(country)) return "together";
  if (both.includes(country)) return "both";
  if (jos.includes(country)) return "jos";
  if (nick.includes(country)) return "nick";
  return null;
}

function getColor(cat) {
  return colors[cat] || "#ddd";
}

// =====================
// LOAD GEOJSON WORLD
// =====================

fetch("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")
  .then(res => res.json())
  .then(data => {

    L.geoJson(data, {
      style: feature => {
        const name = feature.properties.name;
        const cat = getCategory(name);

        return {
          color: "#333",
          weight: 0.5,
          fillColor: getColor(cat),
          fillOpacity: cat ? 0.7 : 0.1
        };
      },

      onEachFeature: function (feature, layer) {
        const name = feature.properties.name;
        const cat = getCategory(name);

        layer.bindTooltip(`
          <b>${name}</b><br>
          ${cat ? cat.toUpperCase() : "Niet bezocht"}
        `);

        layer.on({
          mouseover: function (e) {
            e.target.setStyle({ weight: 2 });
          },
          mouseout: function (e) {
            e.target.setStyle({ weight: 0.5 });
          }
        });
      }
    }).addTo(map);
  });

// =====================
// FILTER (simpel refresh model)
// =====================

function setFilter(type) {
  currentFilter = type;
  location.reload(); // simpelste manier zonder extra complexity
}
