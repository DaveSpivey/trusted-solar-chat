/*jslint regexp: true, browser: true*/
/*global  $, geoip2, console, google, Modernizr, Snap */

/*POSSIBLY THIS ENTIRE SCRIPT IS NO LONGER NEEDED. 
TODO: Deprecate, delete this script in favor of gyi.js, and, eventually, 
delete gyi.js too and move all funnel script into Body Script block of get-your-iquote */

var wwwwidth,
	unveiled = true,
	autocomplete,
	didScroll = false,
	sVg = document.createElement('svg').getAttributeNS ? true : false,
    /* FOR DEPRECATED SOLAR-QUOTE FUNNEL? THESE NEXT THREE ARRAY DECLARATIONS MIGHT BE NO LONGER NEEDED */
	componentForm = {
		street_number: 'short_name',
		route: 'long_name',
		locality: 'long_name',
		administrative_area_level_1: 'short_name',
		postal_code: 'long_name'
	},
	inputForm = {
		route : 'field4',
		locality: 'field5',
		administrative_area_level_1 : 'field6',
		postal_code: 'field7'
	},
	// used in solar-quote.js to correctly assign cookied form inputs
	formMap = {
		field1 : 'field1',
		field2 : 'field2',
		field3 : 'field3',
		field4 : 'field4',
		field5 : 'field5',
		field6 : 'field6',
		field7 : 'field7',
		field8 : 'field8',
		field9 : 'field9'
	},
	stateList = {
		AL: 'Alabama',
		AK: 'Alaska',
		AZ: 'Arizona',
		AR: 'Arkansas',
		CA: 'California',
		CO: 'Colorado',
		CT: 'Connecticut',
		DE: 'Delaware',
		DC: 'District Of Columbia',
		FL: 'Florida',
		GA: 'Georgia',
		HI: 'Hawaii',
		ID: 'Idaho',
		IL: 'Illinois',
		IN: 'Indiana',
		IA: 'Iowa',
		KS: 'Kansas',
		KY: 'Kentucky',
		LA: 'Louisiana',
		ME: 'Maine',
		MD: 'Maryland',
		MA: 'Massachusetts',
		MI: 'Michigan',
		MN: 'Minnesota',
		MS: 'Mississippi',
		MO: 'Missouri',
		MT: 'Montana',
		NE: 'Nebraska',
		NV: 'Nevada',
		NH: 'New Hampshire',
		NJ: 'New Jersey',
		NM: 'New Mexico',
		NY: 'New York',
		NC: 'North Carolina',
		ND: 'North Dakota',
		OH: 'Ohio',
		OK: 'Oklahoma',
		OR: 'Oregon',
		PA: 'Pennsylvania',
		RI: 'Rhode Island',
		SC: 'South Carolina',
		SD: 'South Dakota',
		TN: 'Tennessee',
		TX: 'Texas',
		UT: 'Utah',
		VT: 'Vermont',
		VA: 'Virginia',
		WA: 'Washington',
		WV: 'West Virginia',
		WI: 'Wisconsin',
		WY: 'Wyoming'
	},
	// https://developer.mozilla.org/en-US/docs/Web/API/document.cookie		
	docCookies = {
		getItem: function (sKey) {
			if (!sKey) { return null; }
			return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
		},
		setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
			if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
			// setting default to 4 weeks
			var sExpires = "; max-age=" + 60*60*24*28;
			if (vEnd) {
				switch (vEnd.constructor) {
				case Number:
					sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
					break;
				case String:
					sExpires = "; expires=" + vEnd;
					break;
				case Date:
					sExpires = "; expires=" + vEnd.toUTCString();
					break;
				}
			}
			document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
			return true;
		},
		removeItem: function (sKey, sPath, sDomain) {
			if (!this.hasItem(sKey)) { return false; }
			document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
			return true;
		},
		hasItem: function (sKey) {
			if (!sKey) { return false; }
			return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
		},
		keys: function () {
			var nLen, nIdx, aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
			for (nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx + 1) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
			return aKeys;
		}
	},
	cmrFun = {
        i : true,
        isaosa : '',
		urlOsaParam : '',
        retina : window.devicePixelRatio > 1,
		resized : false,
        siteCountry : '',
		countryLookup : function () {
			var cookieCountry = docCookies.getItem('country');
			var urlCountry = cmrFun.getParam('site');            
            if ( urlCountry !== null ) {
                cmrFun.siteCountry = urlCountry.toUpperCase();
                console.log ('We set the site country to ' + cmrFun.siteCountry );
            } else if (cookieCountry === null && typeof geoip2 !== 'undefined') {
				var country,
					onSuccess = function(location){
						country = location.country.iso_code;						
						docCookies.setItem('country', country);
						cmrFun.countryRedirect(country);
					},
					onError = function(error){
						cmrFun.countryRedirect('US');
					};
				geoip2.city(onSuccess, onError);
			} else {
				cmrFun.countryRedirect(cookieCountry);
			}		
		},
		// Country Redirect Check
		countryRedirect : function (country) {
			switch (country) {
				case 'AU' :
					window.open('http://www.sungevity.com.au/', "_self");
				break;
				case 'NL' :
					window.open('http://www.sungevity.nl/', "_self");
                break;
				case 'US' :
					// No redirect. Display the requested URL on this site.
				break;
				default:
				return false;
			}
		},
        // sets URL parameters
        setParam : function (url, name, value) { 
            // console.log('Url is now ' + url + ' and name is ' + name + ' and value is ' + value);
            if (!url || url === '' || url === '/')
                url = 'http://www.sungevity.com/';
            var newUrl = url.trim() + (url.indexOf('?') >= 0 ? "&" : '?') + encodeURIComponent(name) + "=" + encodeURIComponent(value); 
            return newUrl;
        },            
		// used in getParam
		xfilter: function (term) {
			var filterX = /[a-zA-z_\-0-9@.]/;
			return term.match(filterX) ? term : '';
		},	
		// retrieves URL parameters
		getParam : function (name) {
			var param = decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [,""])[1].replace(/\+/g, '%20'));
			param = cmrFun.xfilter(param);
			return param || null;
		},	
		// fading image cycler
		fader : function (p) {
			var pActive = p,
				pNext = pActive.next();

			if (pActive.is(':last-child')) {
				pNext = $('.fader > div:first-child');
			}

			pActive.hide().removeClass('active');
			pNext.addClass('active').fadeIn();
			pNext.find('img.show-me').unveil(2000).removeClass('show-me');
		},
		// SVG animations on how it works
		animateMeLater : function (el, l, d) {
			var eltl = el.getTotalLength();

			el.style.transition = el.style.WebkitTransition = 'none';
			el.style.strokeDasharray = eltl + ' ' + eltl;
			el.style.strokeDashoffset = eltl;
			el.getBoundingClientRect();
			el.style.transition = el.style.WebkitTransition = 'stroke-dashoffset ' + l + 's ease-in-out';
			el.style.transitionDelay = d + 's';
			el.style.strokeDashoffset = '0';
		},
		// state anchors
		scrollMe : function (you) {
			$('html, body').animate({
				scrollTop: $(you).offset().top - 53
			}, 1250);
		},
		// onscroll throttle
		doOnScroll : function () {
			didScroll = true;
		},
		// onresize throttle
		doOnResize : function() {
			cmrFun.resized = true;
		},
		// resize for 3 column layout to match heights
		resizeCol : function (element) {
			var topHeight = 0;
			$(element).removeAttr('style').each( function () {
				var myHeight = $(this).height();
				topHeight = Math.max(topHeight, myHeight);
			});
			$(element).height(topHeight);
		},
		// retrieve ie version
		ieV : function () {
			var sAgent = window.navigator.userAgent;
			var Idx = sAgent.indexOf("MSIE");
			if (Idx > 0) {
				return Idx;
			} else if(!!navigator.userAgent.match(/Trident\/7\./)){
				return 11;
			} else {
				return 0;
			}
		},
		// resize videos
		vidResize : function (vid) {
			var newW = $(vid).parents('div').width(),
				newH = newW * 0.5625;
			$(vid).css({'height' : newH, 'width' : newW});
		},
		// replace svg with png where needed
		svgReplace : function (path) {
			// replace svg with png path
			var pNg = $(path).attr('data-png'),
				pngW = $(path).width(),
				pngH = $(path).height();
			$(path).hide().after('<img src="' + pNg + '" />');
		},
		// SVG resize for homepage only
		svgResize : function (mySVG, prop, wwwwidth) {
			wwwwidth = typeof(wwwwidth) != 'undefined' ? wwwwidth : Math.ceil($(window).width() - $('.localized .column.four').offset().left) - 638;
			mySVG.css(prop, wwwwidth);
		},
		// retrieves original image size
		natImg : function (img) {
			// Create new offscreen image to test
			var wh, newImage = new Image(); 
			newImage.src = img.attr("src");		
			
			wh = {width : newImage.width, height : newImage.height};		
			return wh;
		},
		// resets map height to match container
		mapHeight : function (me) {
			var fullURL,
				baseURL = '//maps.googleapis.com/maps/api/staticmap?',
				attrs = 'zoom=18&format=png&sensor=false&maptype=roadmap&style=feature:water|visibility:on|color:0x96bbc3&style=feature:administrative|color:0x96bbc3|visibility:simplified&style=feature:transit|color:0xf26322',
				gnuWidth = me.width(),
				gnuHeight = me.parents('.column.eight').siblings('.column.four').height(),
				center = 'center=' + me.attr('data-center'),
				size = 'size=' + gnuWidth + 'x' + gnuHeight;
			
			fullURL = baseURL + center + '&' + size + '&' + attrs;
			
			me.attr('src', fullURL);
		},
		// scroll on homepage in CTA
		homepageScrollDown : function () {
			$('html, body').animate({
				scrollTop: $('.localized').offset().top - 150
			}, 1250);			
		},

        
		// AJAX ISA/OSA Function - Request to local resource to determine service area. Sets isaosa var to 'ISA' or 'OSA'.
		getSA : function (zip, lead_record_type, callback) {
            var lrt = lead_record_type===undefined?'residential':lead_record_type
			$.ajax({
				url : "/service-area-lookup?z=" + zip + "&lrt=" + lrt, 
				dataType : 'html',
				success : function (data) {
                    var saData = JSON.parse($("#servicearea", data).text()); 
                    console.log('Returned saData is ' + saData.service);
					if (saData.service > 0) {
                        cmrFun.i = true;
                        cmrFun.isaosa = 'ISA';
                        callback(zip,lead_record_type,'ISA');
					} else {
                        cmrFun.i = false;
                        cmrFun.isaosa = 'OSA';
                        callback(zip,lead_record_type,'OSA');
					}
				}
			});
		},
        // MiniFunnel - url redirection callback to /solar-quote
        sendToFunnel : function (zip,lead_record_type,sa) {
                var state = getState(zip);
	            if (!state) state =  docCookies.getItem('state'); 
            	if (sa == 'OSA') {
                    window.location.href = "/sunshine-network?i=" + cmrFun.i  + "&sa=" + sa + '&z=' + zip;
                } else {
                window.open("/get-your-iquote?i="+ cmrFun.i +"&sa="+ sa +"&state="+ state +"&z="+ zip +"&site="+ cmrFun.siteCountry + "&lrt="+ lead_record_type, "_self");
                }
        },            
		// MiniFunnel - set up redirection 
		processQuote : function (event, me) {
			event.preventDefault();
			var goURL;
            var zip = String(me.siblings('[data-class="zip-pass"]').val());
            var lead_record_type = $('#float_lrt').val()
			if (cmrFun.validAte('zip', zip, me, false)) {
				docCookies.setItem('zipCode', zip); 
                cmrFun.getSA(zip, lead_record_type, cmrFun.sendToFunnel);
			} else {
				me.siblings('[data-class="zip-pass"]').addClass('error').attr("placeholder", "Invalid Zip Code").val('');
			}
		},
          
        /* CAN REMOVE ALL SOLAR-QUOTE FUNNEL FUNCTIONS */
        // Solar-Quote Funnel: validate form fields before submission
		validAte : function (wType, wValue, me, form) {
			var tipTop,
				regex = '',
				message = me.attr('data-error');

			switch (wType) {
				case 'phone' :
					regex = /^\(?([0-9]{3})\)?[\-\. ]?([0-9]{3})[\-\. ]?([0-9]{4})$/;
					break;
				case 'email' :
					regex = /^\w+([\.\-]?\w+)*@\w+([\.\-]?\w+)*(\.\w{2,3})+$/;
					break;
				case 'zip' :
					regex = /\b\d{5}\b/g;
					break;
				case 'state' :
					regex = /\b[A-Z]{2}\b/ig;
					break;		
				case 'firstname' :
				case 'lastname' :
				case 'city' :
				case 'street' :
					regex = /[\w\d\s\,\.]+/;
					break;
				default :
					regex = /[\w\d\s\,\.]+/;
					break;
			}
			
			if (regex.test(wValue)) {
				if(form) {
					me.removeClass('error');				
				} else {
					return true;
				}
			} else {
				if(form) {
					me.addClass('error');
					tipTop = me.position().top - 10;
					$('.success-message').text(message).css('top', tipTop);				
				} else {
					return false;
				}
			}
		},
        // Solar-Quote Funnel: callback to show or hide OSA button
        osaButtonHide : function (zip,sa) {
               if (sa === 'ISA') {
                       $('.conceal').hide();                         
					} else {
                       $('.conceal').show();
                       cmrFun.urlOsaParam = '?osa=true';
				}
        },
        // Solar-Quote Funnel: show or hide OSA button
		osaRedirectButton : function () {
			if ($('input[name="own"]:checked').val() === 'no') {
				$('.conceal').show();
				cmrFun.urlOsaParam = '?oyh=false';
            } else {
                var zip = ( $('#postal_code input').val() ) ? $('#postal_code input').val() : cmrFun.getParam('z');
                cmrFun.getSA(zip,cmrFun.osaButtonHide);
            }
        },
        // Solar-Quote Funnel: filter utility list
		utilityFilter : function (val) {
			var vl = val.toUpperCase(),
				options = '<option value="other">Select Utility Company</option>',
				states = $('.states').filter(function( index ) {
					return $(this).hasClass(vl);
				}).get();
			
			$('.utility select').find('option').remove().end();
						
			if(states.length > 0) {
				for (var state in states) {
					var s = states[state],
						name = s.innerHTML,
						id = s.getAttribute('data-id');

					options += '<option value="'+ id +'">'+ name +'</option>';
				}	
				$('.utility').removeClass('osa');
			} else {
				options += '<option value="na">Your Local Utility Provider</option>';
				$('.utility').addClass('osa');
				$('.conceal').show();
			}
			
			cmrFun.osaRedirectButton();
			
			$('.utility select').append(options);			
		},
		// Solar-Quote Funnel Setup: initiates /solar-quote form (and to some extent on /sunshine-network)
		initializeForm : function () {
			var rc = cmrFun.getParam('referral-code'),
				formZip = cmrFun.getParam('z'),
				formState = cmrFun.getParam('state');
			
			$('.utility select').find('option').remove()
				.end().append('<option value="other">Select Utility Company</option>');		
			
			// run through fields and set some options // add placeholders
			$('.FormWidgettheme li.helper').each(function () {
				if($(this).hasClass('phone')) {
					$(this).find('input').attr('maxlength', '20').attr('type','tel').mask("(999) 999-9999");
				} else if($(this).hasClass('zip')) {
					$(this).find('input').attr('maxlength', '5').attr('type','tel');
				} else if($(this).hasClass('email')) {
					$(this).find('input').attr('type','email');
				} else if($(this).hasClass('state')) {
					$(this).find('input').hide();
					
					var selected = '',
						options = '<option value="null">Select A State</option>';
					for (var x in stateList) {
				
						if(formState && formState === x) {
							selected = 'selected="selected"';
							cmrFun.utilityFilter(x);
							$('.state input').val(x);
							
						} else {
							selected = '';
						}					
						options += '<option ' + selected + ' value="'+ x +'">'+ stateList[x] +'</option>';
					}
					$(this).append('<select id="stateSelect">' + options + '</select>');
				}

				if ($(this).find('label').length > 0) {
					var pl = $(this).find('label').text().replace(/\s+/g, ' ');
					$(this).find('input, textarea').attr('placeholder', pl);
					$(this).find('label').hide();
				}
			});	
			
            
            
			$('#stateSelect').attr('tabindex','6');
            
            $('#stateSelect').on("change", function () {
				var selectedState = $('option:selected', this).val();				
				$('.state input').val(selectedState);	
				cmrFun.utilityFilter(selectedState);
			});			
            
            $('#postal_code input').change(function () {
                cmrFun.osaRedirectButton();
            });	
            
			$('.home label').attr('tabindex','9');		
            

            $('input.go-button').attr('tabindex','14');
            
            $('li#osa-go').attr('tabindex','15');		

			if ($('.qual-tool').length > 0) {
				
				if(rc) {
					document.getElementById('field13').value =  rc;
				}
				
				if(formZip) {
					document.getElementById('field7').value = formZip;
				}
                
				var inputs = '';
				inputs += '<li class="home fifty"><legend>Do you own your home? *</legend>';
				inputs += '<div><label for="yes">Yes <input type="radio" value="yes" id="yes" name="own"></label>';
				inputs += '<label for="no">No <input type="radio" value="no" id="no" name="own"></label></div></li>';
				$('.FormWidgettheme li.email').after(inputs);

				$('input[name="own"]').on("change", function () {
					if ($('input[name="own"]:checked').val() === 'no') {
						$('.own input').prop('checked', false);	
					} else {
						$('.own input').prop('checked', true);
					}
					
					cmrFun.osaRedirectButton();

					$('.home label').removeClass('selected');
					$(this).parents('label').addClass('selected');
				});		
			}

			$('.FormWidgettheme li.go-button').after('<li class="conceal" id="osa-go">GO</li>');

			$('.FormWidgettheme .conceal').on('click', function () {
				$('.FormWidgettheme li input, .FormWidgettheme li textarea').each(function () {
					var myId = $(this).attr('id'),
						myVal = $(this).val();
					docCookies.setItem(myId, myVal);
					
					if(myId === 'field6') {
						formState = myVal;
					}
				});
				
				formZip = formZip !== null ? formZip : '';
				formState = formState !== null ? formState : '';
				window.location.href = "/sunshine-network" + cmrFun.urlOsaParam + '&z=' + formZip + '&state=' + formState;
			});

			$('.FormWidgettheme li.helper input, .FormWidgettheme li.helper textarea').on('focus', function () {
				var conText = $(this).parents('li').attr('data-context'),
					tipTop = $(this).position().top - 10;

				if ($(this).hasClass('error')) {
					conText = $(this).parents('li').attr('data-error');
					$('.success-message').addClass('error');
				} else {
					$('.success-message').removeClass('error');				
				}
				$('.success-message').text(conText).addClass('open').css('top', tipTop);
			});		

			$('.FormWidgettheme li.helper input, .FormWidgettheme li.helper textarea').on('blur', function () {
				var my = $(this),
					myVal = my.val(),
					myType = my.parents('li').attr('data-type');

				cmrFun.validAte(myType, myVal, my, true);
			});
		}
        /*TO REMOVE ALL SOLAR-QUOTE FUNNELS, DELETE TO HERE */
	};

////////////////// Wait until everything is ready... //////////////

$(document).ready(function () {
	
	var myWW = $(window).width(),
		hpSVG, light = document.getElementById('lightpath'),
		burst = document.getElementById('lightburst'),
		holder = document.querySelector('.lightbase path'),
		menu = $('#navigation-menu'),
		menuToggle = $('#js-mobile-menu'),
		hpTrue = $('.localized').length > 0,
		curZip = docCookies.getItem('zipCode'),
		first,
		second;
	
	if(typeof geoip2 !== 'undefined') {
		cmrFun.countryLookup();
	}
    
    if (cmrFun.siteCountry === 'US') {
        $('a').each(function(){
            $(this).attr('href', cmrFun.setParam($(this).attr('href'),'site','US') );
        });
    }
		
	if (hpTrue) {
		hpSVG = $('.svgburst svg');
		cmrFun.svgResize(hpSVG,'right');
		$('.float-quote').hide();
	}
	
	if(cmrFun.retina) {
		$('body').addClass('retina');
	}
	
	if ($('iframe').length > 0) {
		$('iframe').filter(function () {
			var viME = $(this);
			if ($(this).attr('src').indexOf('vimeo') >= 0) {
				cmrFun.vidResize(viME);
			}
		});
	}
	
	setInterval(function () {
		if (didScroll) {
			didScroll = false;
			var paths, height = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight,
				fC = $('#footer'),
				sQ, sQpos, fPos;
			
			if ($('.later').length > 0 && sVg) {
				$('.later').not('.animated').each(function () {
					var sSvG = $(this),
						pos = sSvG.offset().top - $(window).scrollTop();
					if (pos <= height - 150) {
						paths = $(this).addClass('animated').find("path");

						$.each(paths, function (i) {
							//get the total length
							var iP = paths[i];
							cmrFun.animateMeLater(iP, 3, 0);
						});

					}
				});
			}
						
			if ($('.float-quote').length > 0) {
				fPos = fC.offset().top - $(window).scrollTop();
				
				if (hpTrue) {
					sQ = $('.localized');
					sQpos = sQ.offset().top - $(window).scrollTop();
					
					if (sQpos < -150 && $('.float-quote').length > 0) {
						$('.float-quote').fadeIn();
					} else if (sQpos >= -150 && $('.float-quote').length > 0) {
						$('.float-quote').fadeOut();
					}
				}
				
				if (fPos <= height - 53 && $('.float-quote.fixed').length > 0) {
					$('.float-quote').removeClass('fixed').addClass('static');
				} else if (fPos >= height && $('.float-quote.static').length > 0) {
					$('.float-quote').removeClass('static').addClass('fixed');
				}
			}
		}
		
		if(cmrFun.resized) {
			cmrFun.resized = false;
			myWW = $(window).width();
			
			if(myWW >= 1024) {
				menu.removeAttr('style');
				$('.navigation-menu-button').removeClass('open');
			}
			
			if($('.column3').length > 0 && myWW > 768) {
				cmrFun.resizeCol('.column3 .four');
			}

			if (hpTrue) {
				cmrFun.svgResize(hpSVG,'right');
			}

			if(myWW >= 1024 && $('body').hasClass('lt-unveil')) {
				$('body').removeClass('lt-unveil').addClass('gt-unveil');
				$(".bg-loader").unveil();
			} else if(myWW < 1024 && $('body').hasClass('gt-unveil')) {
				$('body').removeClass('gt-unveil').addClass('lt-unveil');
				$(".bg-loader").unveil();
			} 		

			if ($('iframe').length > 0) {
				$('iframe').filter(function () {
					var viME = $(this);
					if ($(this).attr('src').indexOf('vimeo') >= 0) {
						cmrFun.vidResize(viME);
					}
				});
			}
		}
	}, 250);
	
	if ($('.later').length > 0 && Modernizr.svg) {
		cmrFun.animateMeLater(holder, 0.5, 0);
		cmrFun.animateMeLater(light, 3, 0);
		cmrFun.animateMeLater(burst, 3, 3);
	}
	
	if ($('.fader').length > 0) {
		window.setInterval(function () {
			var fadeMe = $('.fader .active');
			cmrFun.fader(fadeMe);
		}, 5000);
	}
    /* No longer need this bit, once solar-quote funnel is deprecated */
	if ($('.FormWidgettheme').length > 0) {
		cmrFun.initializeForm();
	}
	
	$(menuToggle).on('click', function (e) {
		e.preventDefault();
		$(this).toggleClass('open');
		menu.slideToggle(function () {
			if (menu.is(':hidden')) {
				menu.removeAttr('style');
			}
		});
	});
	
	$('.state-anchors a').on('click', function (e) {
		e.preventDefault();
		var goTo = $(this).attr('href');
		cmrFun.scrollMe(goTo);
	});
    
    $('a.Scroll_Anchor').on('click', function (e) {
		e.preventDefault();
		var goTo = $(this).attr('href');
		cmrFun.scrollMe(goTo);
	});
	
	$('.home-page .desktop').on('click', function (e) {
		e.preventDefault();
		cmrFun.homepageScrollDown();
	});	
		
	$('#float_go, #quote_go').click(function(event) {
		cmrFun.processQuote(event, $(this));
	});

	// underline under the active nav item
	$(".nav .nav-link").click(function () {
		$(".nav .nav-link").each(function () {
			$(this).removeClass("active-nav-item");
		});
		$(this).addClass("active-nav-item");
		$(".nav .more").removeClass("active-nav-item");
	});

	$('.accordion-tabs').each(function () {
		$(this).children('li').first().children('a').addClass('is-active').next().addClass('is-open').show();
	});

	$('.accordion-tabs li a').on('click', function (event) {
		if (!$(this).hasClass('is-active')) {
			event.preventDefault();
			var accordionTabs = $('.accordion-tabs');
			accordionTabs.find('.is-open').removeClass('is-open').hide();
			accordionTabs.find('.is-active').removeClass('is-active');
			$(this).addClass('is-active');
			$(this).siblings('.tab-content').addClass('is-open').show();
		} else {
			event.preventDefault();
		}
	});

	$('.faq').click(function () {
		var me = $(this);

		if (me.hasClass('is-open') === true) {
			$('.faq-answer').slideUp();
			$('.faq').removeClass('is-open');
		} else {
			$('.faq').removeClass('is-open');
			$('.faq-answer').hide();
			me.addClass('is-open');
			if(cmrFun.ieV() > 0) {
				if(cmrFun.ieV() <= 9) {
					me.addClass('is-ie');
				} else {
					var whichIE = 'is-ie' + cmrFun.ieV();
					me.addClass(whichIE);
				}
			}
			me.find('.faq-answer').slideDown();
		}
	});
	
	$('.toggler').click(function (e) {
		e.preventDefault();
		$('.slide-toggle').slideToggle();
	});
	
	$('.slide-toggle .close').click(function (e) {
		e.preventDefault();
		$(this).parents('.slide-toggle').slideUp();
	});
	
	if($('.column3').length > 0 && myWW > 768) {
		cmrFun.resizeCol('.column3 .four');
	}	
	
	window.onscroll = cmrFun.doOnScroll;
	window.onresize = cmrFun.doOnResize;
	
	if($('.maps').length > 0) {
		$('.map').each(function(){
			var mimi = $(this);
			cmrFun.mapHeight(mimi);
		});
	}
	
	$(".bg-loader").unveil();
	if(myWW > 880) {
		$('body').addClass('gt-unveil');
	} else if(myWW <= 880){
		$('body').addClass('lt-unveil');
	}
    
});