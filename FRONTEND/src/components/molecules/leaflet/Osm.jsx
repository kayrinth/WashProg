const Osm = {
  hot: {
    url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    attribution:
      "&copy; OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team",
  },
  maptiler: {
    url: "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=YOUR_API_KEY",
    attribution:
      '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a>',
  },
};

export default Osm;
