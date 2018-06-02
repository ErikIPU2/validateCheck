$(document).ready(() => {
    $(".modal").modal();
    $('.dropdown-trigger').dropdown();
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

$("#radioBar").change(() => {
    $("#barcodeS").removeAttr('disabled');
    $("#nameS").attr('disabled', 'disabled');
})

$("#radioName").change(() => {
    $("#nameS").removeAttr('disabled');
    $("#barcodeS").attr('disabled', 'disabled');
})

$("#addSend").click(() => {
    var form = $("#addForm").serializeArray();    
    
    if (!form[0].value) {
        iziToast.error({
            title: "Digite o nome do produto"
        });
    }
    else if (!form[1].value) {
        iziToast.error({
            title: "Digite o codigo de barras"
        });
    }
    else if (!form[2].value) {
        iziToast.error({
            title: "Digite o preço"
        });
    }
    else if (!form[3].value) {
        iziToast.error({
            title: "Digite a data de validade"
        });
    }
    else if (!isValid($("#date").val())) {
        iziToast.error({
            title: "Produto já vencido"
        });
    }
    else {
        $.post("/cadProd", 
            {
                name: form[0].value,
                barcode: form[1].value,
                price: form[2].value,
                valid: form[3].value
            }, 
            
            (data, status) => {
                if (data) {
                    iziToast.success({
                        title: "Produto adionado",
                        position: "topRight"
                    });
                    $("#name").val("");
                    $("#barcode").val("");
                    $("#preco").val("");
                    $("#date").val("");
                    M.updateTextFields();
                }
            }
        )
    }
    
    
});

$("#findAll").click(() => {
    $.get("/getProd", (data, status) => {
        $("#tableView").html(GENERATORTABLE(data));
    })
})

$("#findInvalid").click(() => {
    $.get("/getProd", (data, status) => {
        var prop = [];
        for (var i = 0; i < data.length; i++) {
            if (!isValid(data[i].valid)) {
                prop.push(data[i]);
            }
        }
        $("#tableView").html(GENERATORTABLE(prop));
        
    });
})

$("#findAllM").click(() => {
    $.get("/getProd", (data, status) => {
        $("#tableView").html(GENERATORTABLE(data));
    })
})

$("#findInvalidM").click(() => {
    $.get("/getProd", (data, status) => {
        var prop = [];
        for (var i = 0; i < data.length; i++) {
            if (!isValid(data[i].valid)) {
                prop.push(data[i]);
            }
        }
        $("#tableView").html(GENERATORTABLE(prop));
        
    });
})

$("#prodS").click(() => {
    var form = ($("#searchForm").serializeArray())[0].value;
    if (form == "barcode") {
        var barcode = $("#barcodeS").val();
        if (!barcode) {
            iziToast.error({
                title: "Digite o codigo de barras"
            })
        }
        else {
            $.get("/getProd", (data, status) => {
                var prop = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].barcode == barcode) {
                        prop.push(data[i]);
                    }
                }

                if (!prop.length) {
                    iziToast.warning({
                        title: "Nenhum produto encontrado"
                    })
                }
                else {
                    $("#tableView").html(GENERATORTABLE(prop));

                    iziToast.info({
                        title: prop.length + " produtos encontrados",
                        position: "bottomLeft"
                    });

                    $("#barcodeS").val("");
                    $("#nameS").val("");
                    M.updateTextFields();

                    $("#findModal").modal("close");
                }
            });
        }
        
    }
    else if (form == "name") {
        var name = $("#nameS").val();
        if (!name) {
            iziToast.error({
                title: "Digite o nome do produto"
            })
        }
        else {
            $.get("/getProd", (data, status) => {
                var prop = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].name == name) {
                        prop.push(data[i]);
                    }
                }

                if (!prop.length) {
                    iziToast.warning({
                        title: "Nenhum produto encontrado"
                    })
                }
                else {
                    $("#tableView").html(GENERATORTABLE(prop));
                    iziToast.info({
                        title: prop.length + " produtos encontrados",
                        position: "bottomLeft"
                    });
                    $("#barcodeS").val("");
                    $("#nameS").val("");
                    M.updateTextFields();

                    $("#findModal").modal("close");
                }
            })
        }
    }
    
    
});

function GENERATORTABLE(data) {

    var cont = 0;
    var prop = `<table class="striped ">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Codigo de barras</th>
                            <th>Preço</th>
                            <th>Data de validade</th>
                        </tr>
                    </thead>
                    <tbody>`;
    console.log(data);

    for (var i = 0; i < data.length; i++) {
        if (!isValid(data[i].valid)) {
            cont++;
            prop += `<tr class="red">
                <td>`+data[i].name+`</td>
                <td>`+data[i].barcode+`</td>
                <td>`+data[i].price+` R$</td>
                <td>`+data[i].valid+`</td>
            </tr>`
        }
        else {
            prop += `<tr>
                        <td>`+data[i].name+`</td>
                        <td>`+data[i].barcode+`</td>
                        <td>`+data[i].price+` R$</td>
                        <td>`+data[i].valid+`</td>
                    </tr>`
        }
    }

    prop += `</tbody>
            </table>`;

    if (cont == 0) {
        iziToast.success({
            title:"Nenhum produto vencido",
        })
    }
    else {
        iziToast.warning({
            title: cont+" Produtos vencidos"

        })
    }

    return prop;
    
}

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