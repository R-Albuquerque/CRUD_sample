var provinceKeys = Object.keys(provinces_states);

window.onload = function() {
   var countrySelect = document.getElementById("inputCountry");
    
   for(var i=0; i<provinceKeys.length; i++){
      let optionCountry = document.createElement('option');
         optionCountry.setAttribute('value',provinceKeys[i]);
         optionCountry.innerHTML = provinceKeys[i];
         countrySelect.appendChild(optionCountry);
     }
     countrySelect.selectedIndex = 31;
     provinces_states["Brazil"].forEach(function(sts){
         var init_states = document.createElement('option');
         init_states.setAttribute('value',sts);
         init_states.innerHTML = sts;
         document.getElementById("inputState").appendChild(init_states);
   });
   document.getElementById("inputState").selectedIndex = 7;

   let phoneCodeSelect = document.getElementById("countryCode");
    
   //  console.log(countryCodeKeys.indexOf("Brazil"));
    for(var j=0; j<countryCodes.length; j++){
        let optionCountryCode = document.createElement('option');
           optionCountryCode.setAttribute('value',countryCodes[j]["code"]);
           optionCountryCode.innerHTML = countryCodes[j]["name"]+" ("+countryCodes[j]["code"]+")";
           phoneCodeSelect.appendChild(optionCountryCode);
      }
      phoneCodeSelect.selectedIndex = 32;
   //    provinces_states["Brazil"].forEach(function(sts){
   //      var init_states = document.createElement('option');
   //      init_states.setAttribute('value',sts);
   //      init_states.innerHTML = sts;
   //      document.getElementById("inputState").appendChild(init_states);
   //   });
     document.getElementById("inputState").selectedIndex = 7;
     
 
  }
  

  function selectProvinces(c){
     var stateSelect = document.getElementById("inputState");
     stateSelect.innerHTML = '';
     var num_est = provinces_states.length;
     var index = -1;
     if (c == "Brazil") {
      $('.cep').mask('00000-000');
      }
      else{
         $('.cep').unmask();
      }
    console.log(c);
     for(var i=0; i<provinceKeys.length; i++){
        // console.log(provinceKeys[i]);
        if(provinceKeys[i] == c){
                   index = c;
                   console.log(provinces_states[c]);
                }
      }
 
  
     if(index != -1){
        provinces_states[index].forEach(function(state_prov){
           var optionState = document.createElement('option');
           optionState.setAttribute('value',state_prov);
           optionState.innerHTML = state_prov;
           stateSelect.appendChild(optionState);
        });
     }
     else{
        stateSelect.innerHTML = '';
     }
  
  }