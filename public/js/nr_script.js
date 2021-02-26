var emailtxt;
var emailcount = 0;
var chosenemails = [];

var phonetxt;
var phonecount = 0;
var chosenphones = [];



$('.cpf').mask('000.000.000-00', {reverse: true});
$('.cep').mask('00000-000');


function delemail(t,c) {
  var index = chosenemails.indexOf(c);
  if (index > -1) {
    chosenemails.splice(index, 1);
  }
  t.remove();
  $("#emaillist").val(chosenemails);
  togBut(chosenemails, "email");
  // console.log(chosenings);
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
  // console.log(ident);
  // console.log($(ident).text());
  var emptylists = false;
    if (list.length <= 0) {
      $(':input[type="submit"]').prop('disabled', true);
      $(`#no${field}`).text(`Must have at least one ${field}`);
    }
    else{
      $(`#no${field}`).text("");
    }

    // console.log(list);
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
    var phoneNum = $("#phones").val()
    phonetxt = $("#countryCode").val() + cleanemailphone(phoneNum);
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
