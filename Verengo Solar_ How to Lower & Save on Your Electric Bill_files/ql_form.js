(function($, Drupal)
{
// Our function name is prototyped as part of the Drupal.ajax namespace, adding to the commands:
  Drupal.ajax.prototype.commands.afterAjaxCallback = function(ajax, response, status)
  {
// The value we passed in our Ajax callback function will be available inside the
// response object. Since we defined it as selectedValue in our callback, it will be
// available in response.selectedValue. Usually we would not use an alert() function
// as we could use ajax_command_alert() to do it without having to define a custom
// ajax command, but for the purpose of demonstration, we will use an alert() function
// here:
    // alert("RECEIVED AJAX COMMAND");
    verengoUI.ql_slp.dataModel_succcess(response);
  },
  Drupal.ajax.prototype.commands.afterAjaxFailedCallback = function(ajax, response, status)
  {
// The value we passed in our Ajax callback function will be available inside the
// response object. Since we defined it as selectedValue in our callback, it will be
// available in response.selectedValue. Usually we would not use an alert() function
// as we could use ajax_command_alert() to do it without having to define a custom
// ajax command, but for the purpose of demonstration, we will use an alert() function
// here:
    // alert("RECEIVED AJAX COMMAND");
    verengoUI.ql_slp.dataModel_fail(ajax, response, status);
  };
}(jQuery, Drupal));
