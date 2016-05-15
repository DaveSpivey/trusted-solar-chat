$(document).ready(function() {

  $('#show-details').click(showDetails);
  $('#detail-close').click(closeDetails);

})

var savings = 700;
var size = "5kW"

setTimeout(function(){
  $('#show-details').show();
}, 20000)

function showDetails() {
  $('#show-details').hide();
  $('#customer-details').show();
  $('#savings-detail').append('<p>Estimated Annual Savings: $' + savings);
  $('#savings-detail').append('<p>Recommended Solar Installation Size: ' + size);
}

function closeDetails() {
  $('#customer-details').hide();
  $('#show-details').show();
}