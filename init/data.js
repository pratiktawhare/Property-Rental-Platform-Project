const sampleListings = [
  {
    title: "Serene Beachside Room",
    description: "A peaceful retreat overlooking the Arabian Sea.",
    image: { url: "beachroom.jpg", filename: "beachroom" },
    price: 3500,
    location: "Goa",
    country: "India",
    geometry: { type: "Point", coordinates: [73.856255, 15.299326] },
    category: "Rooms"
  },
  {
    title: "Majestic Mountain Cabin",
    description: "Rustic cabin nestled in the Rockies.",
    image: { url: "mountaincabin.jpg", filename: "mountaincabin" },
    price: 12000,
    location: "Aspen, Colorado",
    country: "USA",
    geometry: { type: "Point", coordinates: [-106.818642, 39.191097] },
    category: "Mountains"
  },
  {
    title: "Royal Palace Stay",
    description: "Live like royalty in Jaipur's palatial heritage home.",
    image: { url: "royalpalace.jpg", filename: "royalpalace" },
    price: 15000,
    location: "Jaipur",
    country: "India",
    geometry: { type: "Point", coordinates: [75.787270, 26.912434] },
    category: "Iconic Cities"
  },
  {
    title: "Igloo Adventure",
    description: "Experience life in the Arctic Circle.",
    image: { url: "igloo.jpg", filename: "igloo" },
    price: 25000,
    location: "Rovaniemi",
    country: "Finland",
    geometry: { type: "Point", coordinates: [25.720887, 66.503947] },
    category: "Arctic"
  },
  {
    title: "Camping under the Stars",
    description: "Unplug and unwind in Rishikesh.",
    image: { url: "rishikeshcamp.jpg", filename: "rishikeshcamp" },
    price: 2500,
    location: "Rishikesh",
    country: "India",
    geometry: { type: "Point", coordinates: [78.267960, 30.086927] },
    category: "Camping"
  },
  {
    title: "French Countryside Castle",
    description: "Live the fairy tale in Loire Valley.",
    image: { url: "frenchcastle.jpg", filename: "frenchcastle" },
    price: 18000,
    location: "Loire Valley",
    country: "France",
    geometry: { type: "Point", coordinates: [0.336098, 47.387678] },
    category: "Castles"
  },
  {
    title: "Tropical Farmstay",
    description: "Reconnect with nature in Kerala.",
    image: { url: "keralafarm.jpg", filename: "keralafarm" },
    price: 3200,
    location: "Wayanad",
    country: "India",
    geometry: { type: "Point", coordinates: [76.132007, 11.608249] },
    category: "Farms"
  },
  {
    title: "Iconic Tokyo Apartment",
    description: "A minimalist stay in the heart of the Shibuya district.",
    image: { url: "tokyoapartment.jpg", filename: "tokyoapartment" },
    price: 18000,
    location: "Tokyo",
    country: "Japan",
    geometry: { type: "Point", coordinates: [139.691706, 35.689487] },
    category: "Iconic Cities"
  },
  {
    title: "Swiss Alps Retreat",
    description: "Luxury chalet with breathtaking views.",
    image: { url: "swisschalet.jpg", filename: "swisschalet" },
    price: 35000,
    location: "Zermatt",
    country: "Switzerland",
    geometry: { type: "Point", coordinates: [7.748615, 46.020736] },
    category: "Mountains"
  },
  {
    title: "Historic City Stay",
    description: "Walk through the lanes of history in Agra.",
    image: { url: "agrastay.jpg", filename: "agrastay" },
    price: 4000,
    location: "Agra",
    country: "India",
    geometry: { type: "Point", coordinates: [78.054453, 27.176670] },
    category: "Iconic Cities"
  },
  {
    title: "Treetop Getaway",
    description: "Escape to the jungles of Costa Rica.",
    image: { url: "costaricajungle.jpg", filename: "costaricajungle" },
    price: 30000,
    location: "Monteverde",
    country: "Costa Rica",
    geometry: { type: "Point", coordinates: [-84.830621, 10.283333] },
    category: "Others"
  },
  {
    title: "Serene Beachside Room",
    description: "A peaceful retreat overlooking the Arabian Sea.",
    image: { url: "beachroom.jpg", filename: "beachroom" },
    price: 3500,
    location: "Goa",
    country: "India",
    geometry: { type: "Point", coordinates: [73.856255, 15.299326] },
    category: "Rooms"
  },
  {
    title: "Majestic Mountain Cabin",
    description: "Rustic cabin nestled in the Rockies.",
    image: { url: "mountaincabin.jpg", filename: "mountaincabin" },
    price: 12000,
    location: "Aspen, Colorado",
    country: "USA",
    geometry: { type: "Point", coordinates: [-106.818642, 39.191097] },
    category: "Mountains"
  },
  {
    title: "Royal Palace Stay",
    description: "Live like royalty in Jaipur's palatial heritage home.",
    image: { url: "royalpalace.jpg", filename: "royalpalace" },
    price: 15000,
    location: "Jaipur",
    country: "India",
    geometry: { type: "Point", coordinates: [75.787270, 26.912434] },
    category: "Iconic Cities"
  },
  {
    title: "Igloo Adventure",
    description: "Experience life in the Arctic Circle.",
    image: { url: "igloo.jpg", filename: "igloo" },
    price: 25000,
    location: "Rovaniemi",
    country: "Finland",
    geometry: { type: "Point", coordinates: [25.720887, 66.503947] },
    category: "Arctic"
  },
  {
    title: "Camping under the Stars",
    description: "Unplug and unwind in Rishikesh.",
    image: { url: "rishikeshcamp.jpg", filename: "rishikeshcamp" },
    price: 2500,
    location: "Rishikesh",
    country: "India",
    geometry: { type: "Point", coordinates: [78.267960, 30.086927] },
    category: "Camping"
  },
  {
    title: "French Countryside Castle",
    description: "Live the fairy tale in Loire Valley.",
    image: { url: "frenchcastle.jpg", filename: "frenchcastle" },
    price: 18000,
    location: "Loire Valley",
    country: "France",
    geometry: { type: "Point", coordinates: [0.336098, 47.387678] },
    category: "Castles"
  },
  {
    title: "Tropical Farmstay",
    description: "Reconnect with nature in Kerala.",
    image: { url: "keralafarm.jpg", filename: "keralafarm" },
    price: 3200,
    location: "Wayanad",
    country: "India",
    geometry: { type: "Point", coordinates: [76.132007, 11.608249] },
    category: "Farms"
  },
  {
    title: "Iconic Tokyo Apartment",
    description: "A minimalist stay in the heart of the Shibuya district.",
    image: { url: "tokyoapartment.jpg", filename: "tokyoapartment" },
    price: 18000,
    location: "Tokyo",
    country: "Japan",
    geometry: { type: "Point", coordinates: [139.691706, 35.689487] },
    category: "Iconic Cities"
  },
  {
    title: "Swiss Alps Retreat",
    description: "Luxury chalet with breathtaking views.",
    image: { url: "swisschalet.jpg", filename: "swisschalet" },
    price: 35000,
    location: "Zermatt",
    country: "Switzerland",
    geometry: { type: "Point", coordinates: [7.748615, 46.020736] },
    category: "Mountains"
  },
  {
    title: "Historic City Stay",
    description: "Walk through the lanes of history in Agra.",
    image: { url: "agrastay.jpg", filename: "agrastay" },
    price: 4000,
    location: "Agra",
    country: "India",
    geometry: { type: "Point", coordinates: [78.054453, 27.176670] },
    category: "Iconic Cities"
  },
  {
    title: "Treetop Getaway",
    description: "Escape to the jungles of Costa Rica.",
    image: { url: "costaricajungle.jpg", filename: "costaricajungle" },
    price: 30000,
    location: "Monteverde",
    country: "Costa Rica",
    geometry: { type: "Point", coordinates: [-84.830621, 10.283333] },
    category: "Others"
  },
  {
    title: "Luxury Desert Tent",
    description: "A stunning desert experience in Jaisalmer.",
    image: { url: "jaisalmertent.jpg", filename: "jaisalmertent" },
    price: 9000,
    location: "Jaisalmer",
    country: "India",
    geometry: { type: "Point", coordinates: [70.908344, 26.915698] },
    category: "Camping"
  },
  {
    title: "Urban City Loft",
    description: "A sleek apartment in central Manhattan.",
    image: { url: "manhattanloft.jpg", filename: "manhattanloft" },
    price: 30000,
    location: "New York City",
    country: "USA",
    geometry: { type: "Point", coordinates: [-73.935242, 40.730610] },
    category: "Iconic Cities"
  },
  {
    title: "Hilltop Sanctuary",
    description: "Experience tranquility in the Nilgiris.",
    image: { url: "nilgirihills.jpg", filename: "nilgirihills" },
    price: 4500,
    location: "Ooty",
    country: "India",
    geometry: { type: "Point", coordinates: [76.695747, 11.406414] },
    category: "Mountains"
  },
  {
    title: "Scenic Vineyard Villa",
    description: "Relax in a Tuscan villa surrounded by vineyards.",
    image: { url: "tuscanvilla.jpg", filename: "tuscanvilla" },
    price: 15000,
    location: "Tuscany",
    country: "Italy",
    geometry: { type: "Point", coordinates: [11.255813, 43.769562] },
    category: "Farms"
  },
  {
    title: "Charming City Stay",
    description: "Enjoy the vibrant streets of Bengaluru.",
    image: { url: "bengalurustay.jpg", filename: "bengalurustay" },
    price: 6000,
    location: "Bengaluru",
    country: "India",
    geometry: { type: "Point", coordinates: [77.594566, 12.971598] },
    category: "Iconic Cities"
  },
  {
    title: "Remote Jungle Lodge",
    description: "Connect with nature in the Amazon Rainforest.",
    image: { url: "amazonlodge.jpg", filename: "amazonlodge" },
    price: 20000,
    location: "Manaus",
    country: "Brazil",
    geometry: { type: "Point", coordinates: [-60.025780, -3.119027] },
    category: "Others"
  },
  {
    title: "Eco-Friendly Treehouse",
    description: "Stay amidst the lush beauty of Meghalaya.",
    image: { url: "meghalayatreehouse.jpg", filename: "meghalayatreehouse" },
    price: 4500,
    location: "Shillong",
    country: "India",
    geometry: { type: "Point", coordinates: [91.880185, 25.578773] },
    category: "Farms"
  },
  {
    title: "Mediterranean Escape",
    description: "A cozy villa by the Aegean Sea.",
    image: { url: "aegeanvilla.jpg", filename: "aegeanvilla" },
    price: 20000,
    location: "Santorini",
    country: "Greece",
    geometry: { type: "Point", coordinates: [25.431339, 36.393156] },
    category: "Others"
  },
  {
    title: "Romantic Lakeside Cottage",
    description: "Relax by Dal Lake's pristine waters.",
    image: { url: "dalcottage.jpg", filename: "dalcottage" },
    price: 7000,
    location: "Srinagar",
    country: "India",
    geometry: { type: "Point", coordinates: [74.778487, 34.083670] },
    category: "Others"
  }
  // Add additional objects as needed to reach the total 30.
]
  
  module.exports = { data: sampleListings };