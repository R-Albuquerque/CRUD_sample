var emailtxt;
var emailcount = 0;
var chosenemails = [];

var phonetxt;
var phonecount = 0;
var chosenphones = [];


  // togBut(chosenemails, 'email');
  // $("#emaillist").val(chosenemails);
  // $("#emails").val("");
  // $("#emailwarn").html("");

$('.cpf').mask('000.000.000-00', {reverse: true});

if (readyCountry == "Brazil") {
  $('.cep').mask('00000-000');
}

function delemail(t,c) {
  var index = chosenemails.indexOf(c);
  if (index > -1) {
    chosenemails.splice(index, 1);
  }
  t.remove();
  $("#emaillist").val(chosenemails);
  togBut(chosenemails, "email");

}

function delphone(t,c) {
  var index = chosenphones.indexOf(c);
  if (index > -1) {
    chosenphones.splice(index, 1);
  }
  t.remove();
  $("#phonelist").val(chosenphones);
  togBut(chosenphones, "phone");
}



function togBut(list, field){
  var ident = '#no'+field;

  var emptylists = false;
    if (list.length <= 0) {
      $(':input[type="submit"]').prop('disabled', true);
      $(`#no${field}`).text(`Must have at least one ${field}`);
    }
    else{
      $(`#no${field}`).text("");
    }

    var ls2c = [chosenphones,chosenemails];
    for (var i = 0; i < ls2c.length; i++) {
      if (ls2c[i].length <= 0) {
        emptylists = true;
        break;
      }
    }
    if (!emptylists) {
      $(':input[type="submit"]').prop('disabled', false);
    }
}


// ========== TO BE EXECUTED AFTER DOCUMENT LOADS
$(document).ready(function(){

    for (let i = 0; i < readyMails.length; i++) {
        $('#emailbox').append(
        `<span type ="button" class='emailpill btn btn-info'
        onclick="delemail(this, '${cleanemailphone(readyMails[i])}')">${cleanemailphone(readyMails[i])}</span>`
      );
      chosenemails.push(cleanemailphone(readyMails[i]));
      $("#emaillist").val(chosenemails);
      emailcount++;
      // console.log(chosenemails);
    }
    
    for (let j = 0; j < readyPhones.length; j++) {
        // const element = array[i];
        $('#phonebox').append(
            `<span type ="button" class='emailpill btn btn-info'
            onclick="delphone(this, '${readyPhones[j]}')">${readyPhones[j]}</span>`
          );
          chosenphones.push(readyPhones[j]);
          $("#phonelist").val(chosenphones);
          phonecount++;
    }
    console.log($("#emaillist").val());
    console.log($("#phonelist").val());
    var provinceKeys = Object.keys(provinces_states);
    var countrySelect = $("#inputCountry");
    var stateSelect = $("#inputState");
    
    for(var k=0; k<provinceKeys.length; k++){
        if (provinceKeys[k] == readyCountry){
            console.log(readyCountry);
            console.log(provinceKeys[k]);
            countrySelect.val(readyCountry);
            var this_country = countrySelect.val();
            console.log(this_country);
            console.log(readyState);
            selectProvinces(readyCountry)
            for (let m = 0; m < provinces_states[readyCountry].length; m++) {
                if(provinces_states[readyCountry][m] = readyState){
                    stateSelect.val(readyState);   
                }
            }
        break
        }
           
    }

  $('#inputCity').val(readyCity);

  $("#inputAddress").val(address[0]);
  $("#inputAddress2").val(address[1]);

  $(':input[type="text"]').keyup(function(){
    var this_inp = $(this).val();
    $(this).val(cleanInput(this_inp));
  });

  $(':input[type="submit"]').prop('disabled', true);
  $('#rmstp').prop('disabled', true);

  togBut(chosenemails, "email");
  togBut(chosenphones, "phone");

  $("#addemail").click(function(){
    emailtxt = $("#emails").val();
    if (emailtxt == "") {
      $("#emailwarn").html("Insert email.");
    }
    else if (!validateEmail(emailtxt)) {
      $("#emailwarn").html("Insert valid email.");
    }
    else {
      $('#emailbox').append(
        `<span type ="button" class='emailpill btn btn-info'
        onclick="delemail(this, '${cleanemailphone(emailtxt)}')">${cleanemailphone(emailtxt)}</span>`
      );
      chosenemails.push(cleanemailphone(emailtxt));
      emailcount++;
      // console.log(chosenemails);
      togBut(chosenemails, 'email');
      $("#emaillist").val(chosenemails);
      $("#emails").val("");
      $("#emailwarn").html("");
    }
  });

  $("#addphone").click(function(){
    var phoneNum = cleanemailphone($("#phones").val());
    phonetxt = $("#countryCode").val() + phoneNum;
    if (cleanphone(phonetxt) == "") {
      $("#phonewarn").html("Insert phone.");
    }
    else {
      $('#phonebox').append(
        `<span type ="button" class='emailpill btn btn-info'
        onclick="delphone(this, '${cleanphone(phonetxt)}')">${cleanphone(phonetxt)}</span>`
      );
      chosenphones.push(cleanphone(phonetxt));
      phonecount++;
      togBut(chosenphones, 'phone');
      $("#phonelist").val(chosenphones);
      $("#phones").val("");
      $("#phonewarn").html("");
      console.log(chosenphones.length);
    }
  });

});



