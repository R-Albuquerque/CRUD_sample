
$(document).ready(function(){

    $.ajax({
      url: './clients',
      type: 'GET',
      data: {},
      success: function (data) {
        console.log(data);
        data.forEach((item, i) => {
          

          a_client =`<div class="card">
                      
                      <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">CPF: ${item.number}</p>
                        <a href='./clients/view/${item.id}'>
                        <span><u>Click for more info</u></span>
                        </a>
                        </div>
  
                        </div>`
  
  
          $("#clientCards").append(a_client);

        });
      }, // close 'success'
      error: function (error) {
        alert(JSON.stringify(error));
      },
    }); // close AJAX call
  });
  