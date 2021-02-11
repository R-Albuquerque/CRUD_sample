var keys = Object.keys(provinces_states);
window.onload = function() {
    let element = document.getElementById("inputCountry");
    
    console.log(keys.indexOf("Brazil"));
    for(var i=0; i<keys.length; i++){
        let optionCountry = document.createElement('option');
           optionCountry.setAttribute('value',keys[i]);
           optionCountry.innerHTML = keys[i];
           element.appendChild(optionCountry);
      }
      element.selectedIndex = 31;
      provinces_states["Brazil"].forEach(function(sts){
        var init_states = document.createElement('option');
        init_states.setAttribute('value',sts);
        init_states.innerHTML = sts;
        document.getElementById("inputState").appendChild(init_states);
     });
     document.getElementById("inputState").selectedIndex = 7;
 
  }
  

  function selectProvinces(c){
     var stateSelect = document.getElementById("inputState");
     stateSelect.innerHTML = '';
     var num_est = provinces_states.length;
     var index = -1;
     
    console.log(c);
     for(var i=0; i<keys.length; i++){
        // console.log(keys[i]);
        if(keys[i] == c){
                   index = c;
                   console.log(provinces_states[2]);
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