var verengoUI=verengoUI||{},$=jQuery.noConflict();verengoUI.global={init:function(){verengoUI.global.md=new MobileDetect(window.navigator.userAgent,760),this.checkOS(),this.mainMenu()},checkOS:function(){"use strict";var n=window.navigator.appVersion,i="Unknown OS";-1!=n.indexOf("Win")&&(i="windows"),-1!=n.indexOf("Mac")&&(i="macos"),-1!=n.indexOf("X11")&&(i="unix"),-1!=n.indexOf("Linux")&&(i="linux"),$("html").addClass(i)},inputValidate:function(n){"use strict";var i,e=function(n){var e=n.attr("type");if(n.is("select"))return!(""===n.val()||null===n.val()||n.val()===!1||void 0===n.val());if("text"===e){var t=n.val().trim();return!(""===t||null===t||t===!1||void 0===t)}return"email"===e?(i=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,i.test(n.val())):"tel"===e?(i=/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/i,i.test(n.val())):"checkbox"===e||"radio"===e?n.is(":checked"):void 0};if(n.length>1){var t={},o=[];return n.each(function(){t[$(this).attr("type")]=t[$(this).attr("type")]||[],t[$(this).attr("type")].push(this)}),$.each(t,function(n,i){var a=!1;if("checkbox"===n||"radio"===n)$.each(t[n],function(){e($(this))&&(a=!0)});else{var r=[];$(this).each(function(){r.push(e($(this)))}),a=-1===$.inArray(!1,r)}o.push(a)}),-1===$.inArray(!1,o)}return e(n)},getUrlVars:function(){var n,i,e=window.location.href.slice(window.location.href.indexOf("?")+1).split("&"),t={};for(i=0;i<e.length;i++)n=e[i].split("="),t[n[0]]=n[1];return t},camelToDash:function(n){return n.replace(/\W+/g,"-").replace(/([a-z\d])([A-Z])/g,"$1-$2").toLowerCase()},mainMenu:function(){var n=verengoUI.global,i=$(".top-nav"),e=i.find(".top-bar"),t=e.find(".dropdown-toggle"),o=e.find(".close-nav"),a=i.find(".dropdown-wrapper"),r=function(){n.md.isPhoneSized()||$("html").hasClass("tablet")&&$(window).width()<=992?a.collapse("show"):a.show(),t.hide(),o.show()},l=function(){n.md.isPhoneSized()||$("html").hasClass("tablet")&&$(window).width()<=992?a.collapse("hide"):a.hide(),o.hide(),t.show()};t.on("click",r),o.on("click",l)}},$(document).ready(function(){verengoUI.global.init()});