/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Luan Lima Campos Student ID: 119386191 Date: 2021-01-28
*
*
********************************************************************************/ 


let restaurantData = [];
let currentRestaurant = {};
let page = 1; //current page
let perPage = 10; //number of restaurants per page
let map = null; //leaflet map object
let avg = (grades) => {
  var sum = 0;
  var average = 0;
  for (let i = 0; i < grades.length; i++) {
    sum += grades[i].score;
  }
  average = sum / grades.length;
  return average.toFixed(2);
};

let tableRows = _.template(
  `<% _.forEach(restaurantData, function(restaurant){ %>
    <tr data-id=<%- restaurant._id %>>
      <td><%- restaurant.name %></td>
      <td><%- restaurant.cuisine %></td>
      <td><%- restaurant.address.building %> <%- restaurant.address.street%></td>
      <td><%- avg(restaurant.grades) %></td>
    <% }); %>
  `
);

let loadRestaurantData = () => {
  fetch(
    `https://dry-lowlands-75857.herokuapp.com/api/restaurants?page=${page}&perPage=${perPage}`
  )
    .then((res) => res.json())
    .then((data) => {
      //assign data returned from fetch to the local variable
      restaurantData = data;
      //return the data to the tableRows template
      let populateTable = tableRows({ restaurants: data });
      $("#restaurant-table tbody").html(populateTable);
      $("#current-page").html(page);
    });
};

$(document).ready(function () {
  //load the restaurant data
  loadRestaurantData();

  //click event for all table rows
  $("#restaurant-table tbody").on("click", "tr", function () {
    //get the currenct restaurant and assign it to the global variable
    restaurantData.forEach((element) => {
      if (element._id === $(this).attr("data-id")) {
        currentRestaurant = _.cloneDeep(element);
      }
    });
    //set the modal title to the restaurant name
    $(".modal-title").html(currentRestaurant.name);
    //set the modal address to the restaurant address
    $("#restaurant-address").html(
      currentRestaurant.address.building +
        " " +
        currentRestaurant.address.street
    );
    //open modal
    $("#restaurant-modal").modal({
      backdrop: "static", // disable clicking on the backdrop to close
      keyboard: false, // disable using the keyboard to close
    });
  });

  //click event for previous page
  $("#previous-page").on("click", function () {
    if (page > 1) {
      page--;
      loadRestaurantData();
    }
  });

  //click event for next page
  $("#next-page").on("click", function () {
    page++;
    loadRestaurantData();
  });

  //
  $("#restaurant-modal").on("shown.bs.modal", function () {
    //render the map
    map = new L.Map('leaflet', {
      center: [currentRestaurant.address.coord[1], currentRestaurant.address.coord[0]],
      zoom: 18,
      layers: [
          new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
      ]
  });
  
  L.marker([currentRestaurant.address.coord[1], currentRestaurant.address.coord[0]]).addTo(map);
  
  });

  //
  $("#restaurant-modal").on("hidden.bs.modal", function () {
    map.remove();
  })
});
