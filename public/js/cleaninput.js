const cleanInput = (inp) => (inp.replace("<", "")
                              .replace("{", "")
                              .replace("[", "")
                              .replace(";", ".")
                              // .replace("#", "")
                              .replace("=", "")
                              .replace("\\", ""));

 // Cleans emailegory and ingredient text inputs
function cleanemailphone(input){
  var clean = cleanInput(input).replace(",", "")
                               .replace("/", "")
                               .replace("#", "")
                               .replace("+", "")
                               .replace("*", "")
                               .replace('"', "")
                               .replace("'", "");
                              //  .replace('"', "&#34;")
                              //  .replace("'", "&#39;");
  
      return clean;
}
function cleanphone(input){
      // console.log(input);
      return input.replace(/\D/g,'');
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}