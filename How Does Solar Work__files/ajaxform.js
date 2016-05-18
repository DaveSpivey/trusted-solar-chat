
function ajaxCall() { //fuction to return the xml http object
        var xmlhttp=false;
        try{
            xmlhttp=new XMLHttpRequest();
        }
        catch(e)    {
            try{
                xmlhttp= new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch(e){
                try{
                xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
                }
                catch(e1){
                    xmlhttp=false;
                }
            }
        }

        return xmlhttp;
    }


    function getZip(zipCode) {
    
	var zipCode = document.form1.zipCode.value;
        //var valid = "0123456789";
	}
	
	
	function sleep(delay)
	{
		var start = new Date().getTime();
		while (new Date().getTime() < start + delay);
	}



	function delay(naptime){
		naptime = naptime * 1000;
		var sleeping = true;
		var now = new Date();
		var alarm;
		var startingMSeconds = now.getTime();
		while(sleeping){
		alarm = new Date();
		alarmMSeconds = alarm.getTime();
		if(alarmMSeconds - startingMSeconds > naptime){ sleeping = false; }
		}
	}



	function validateZIP(zipCode) {
	/*
	//if(zipCode.length != 5) {
	//alert("Whoops, please enter a valid zip code");
	//return false;
	//}
	
	//if (validateZip(zipCode) == "false") {
	//alert("Invalid characters in your zip code.  Please try again.");
	//return false;
	//}
	
	//if (zipCode <5)
	//alert("Please enter valid zip code");
	*/


        var strURL="solar_qualify-step1.php?zipcode="+zipCode;
        var req = ajaxCall();

        processing = '<div style="height:590px; background-color:#fff;"><p align="center">Processing...<br><img src="/v2/images/ajax-loader.gif" width="31" height="31" /></p></div>';
        document.getElementById('mega_center').innerHTML = processing;


        if (req) {

            req.onreadystatechange = function() {
                if (req.readyState == 4) {
                    // only if "OK"
                    if (req.status == 200) {

                      //document.getElementById('mega_center').innerHTML=req.responseText;

                        var div = document.getElementById('mega_center');
                        div.innerHTML = req.responseText; 

                        //runScripts(div);

                    } else {
                        alert("There was a problem while using XMLHTTP:\n" + req.statusText);
                    }
                }
            }
            req.open("GET", strURL, true);
            req.send(null);
        }
        loadingmap= '<div style="height:300px; padding-top:150px; background-color:#fff;"><p align="center">Loading...<br><img src="/v2/images/ajax-loader.gif" width="31" height="31" /></p></div>';
        setTimeout("document.getElementById('map').innerHTML = loadingmap",2500);

			 //alert("Zip Code: "+zipCode) ;
			 //showAddress(zipCode);
		setTimeout("load()",3500);

		window.location.hash="centerbox";

		 //load();
		//window.onunload = GUnload;
    }




    function qualify2() {
		var myform = document.form2;
		var name= myform.name.value;
		var email= myform.email.value;
		var phone= myform.phone.value;

		var address= myform.address.value;
		var city= myform.city.value;
		var state= myform.state.value;
		var zipCode = myform.zip.value;
		var energyCost = myform.energycost.value;

		err = 'The following fields are not correct filled:\n';

		if (myform.energycost.value == false){
			err += 'No Electric bill amount.\n';
		}


		if (myform.address.value == false){
			err += 'No Valid Address.\n';
		}
		if (myform.name.value == false){
			err += 'No Valid Name.\n';
		}
		if (myform.phone.value == false){
			err += 'No Valid Phone.\n';
		}
		if (myform.email.value == false){
			err += 'No Valid Email.\n';
		}
		if (err != 'The following fields are not correct filled:\n'){
			alert (err);
			return false;
		}


        var strURL="solar_qualify-step2.php?name="+name+"&phone="+phone+"&email="+email+"&address="+address+"&city="+city+"&state="+state+"&zipcode="+zipCode+"&energycost="+energyCost;
        var req = ajaxCall();

        document.getElementById('mega_center').innerHTML = '<div style="height:300px; background-color:#fff;"><p align="center">Processing...<br><img src="/v2/images/ajax-loader.gif" width="31" height="31" /></p></div>';

        if (req) {

            req.onreadystatechange = function() {
                if (req.readyState == 4) {
                    // only if "OK"
                    if (req.status == 200) {
                        document.getElementById('mega_center').innerHTML=req.responseText;
                    } else {
                        alert("There was a problem while using XMLHTTP:\n" + req.statusText);
                    }
                }
            }
            req.open("GET", strURL, true);
            req.send(null);
        }
    }


    function referralInfo() {
	
		var leadid = document.form3.leadid.value;
		var referred = document.form3.referred.value;
		var details = document.form3.details.value;
		var newsletter = document.form3.newsletter.value;
		
        var strURL="solar_qualify-step3.php?leadid="+leadid+"&referred="+referred+"&details="+details+"&newsletter="+newsletter;
        var req = ajaxCall();

        document.getElementById('mega_center').innerHTML = '<div style="height:300px; background-color:#fff;"><p align="center">Processing...<br><img src="/v2/images/ajax-loader.gif" width="31" height="31" /></p></div>';

        if (req) {

            req.onreadystatechange = function() {
                if (req.readyState == 4) {
                    // only if "OK"
                    if (req.status == 200) {
                        document.getElementById('mega_center').innerHTML=req.responseText;
                    } else {
                        alert("There was a problem while using XMLHTTP:\n" + req.statusText);
                    }
                }
            }
            req.open("GET", strURL, true);
            req.send(null);
        }
    }