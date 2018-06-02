$(document).ready(() => {
    $(".modal").modal();
    $('.datepicker').datepicker({
        format : 'dd/mm/yyyy'
    });

})

$("#date").change(() => {
    setTimeout(() => {
        if ( isValid($("#date").val())) {
            $("#date").removeClass("invalid");
            $("#date").addClass("valid");
        }
        else {
            $("#date").removeClass("valid");
            $("#date").addClass("invalid");
        }
    }, 10);
    
})

$("#addSend").click(() => {
    var form = $("#addForm").serializeArray();
    console.log(form);
    
    
    if (!form[0].value) {
        iziToast.error({
            title: "Digite o nome do produto",
            position: "topRight"
        });
    }
    else if (!form[1].value) {
        iziToast.error({
            title: "Digite o codigo de barras",
            position: "topRight"
        });
    }
    else if (!form[2].value) {
        iziToast.error({
            title: "Digite o preço",
            position: "topRight"
        });
    }
    else if (!form[3].value) {
        iziToast.error({
            title: "Digite a data de validade",
            position: "topRight"
        });
    }
    else if (!isValid($("#date").val())) {
        iziToast.error({
            title: "Produto já vencido",
            position: "topRight"
        });
    }
    else {
        $.post("/cadProd", 
            {
                name: form[0].value,
                barcode: form[1].value,
                price: form[2].value,
                valid: form[3].value
            }, (data, status) => {
                console.log(status);
            }
        )
    }
    
    
});



function getDay() {

    var date = new Date();
    var day = ""+date.getDate();
    var mounth = ""+(date.getMonth()+1);
    var year = ""+date.getFullYear();

    if (day.length == 1) {
        day = "0"+day;
    }
    if (mounth.length == 1) {
        mounth = "0"+mounth;
    }

    return day+"/"+mounth+"/"+year;

}

function isValid(date1) {
    var day = date1.substring(0, 2);
    var mounth = date1.substring(3, 5);
    var year = date1.substring(6, date1.length);

    if (new Date(mounth+"/"+day+"/"+year) < new Date) {
        return false;
    }
    else return true;  
}