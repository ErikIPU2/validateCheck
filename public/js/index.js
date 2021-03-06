$(document).ready(() => {
    $(".modal").modal();
    $('.datepicker').datepicker({
        format : 'dd/mm/yyyy',
        i18n : {
            months: [
                'Janeiro',
                'Fevereiro',
                'Março',
                'Abril',
                'Maio',
                'Junho',
                'Julho',
                'Agosto',
                'Setembro',
                'Outubro',
                'Novembro',
                'Dezembro'
            ],
            monthsShort : [
                'Jan',
                'Fev',
                'Mar',
                'Apr',
                'Mai',
                'Jun',
                'Jul',
                'Aog',
                'Sep',
                'Out',
                'Nov',
                'Dez'
              ],
              weekdays: [
                'Domingo',
                'Segunda',
                'Terça',
                'Quarta',
                'Quinta',
                'Sexta',
                'Sabado'
              ],
              weekdaysShort: [
                'Dom',
                'Seg',
                'Ter',
                'Qua',
                'Qui',
                'Sex',
                'Sab'
              ],
              weekdaysAbbrev: ['D','S','T','Q','Q','S','S']
        }
    });

    $('.dropdown-trigger').dropdown();

    
    // window.open("adress.html");
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

$("#barcode").change(() => {
    var code = $("#barcode").val();
    $.get("/getProd", (data, status) => {
        var exist = existBarcode(code, data);
        if (exist) {
            $("#barcode").removeClass("valid");
            $("#barcode").addClass("invalid");

            var index;
            for (var i = 0; i < data.length; i++) {
                if (data[i].barcode == code) {
                    bol = true;
                    index = i;
                }
            }

            $("#name").val(data[index].name);
            $("#preco").val(data[index].price);
            $("#date").val(data[index].valid);

            M.updateTextFields();


        }
        else {
            $("#barcode").removeClass("invalid");
            $("#barcode").addClass("valid");
        }
    });      
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
        $.get("/getProd", (data, status) => {

            if (existBarcode(form[1].value, data)) {
               $.post("/removeBarcode", 
                    {barcode: form[1].value},
                    (data, status => {
                        console.log(data);
                    })
                )
            }

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
        
        });

        
    }
    

});

$("#findAll").click(() => {
    $.get("/getProd", (data, status) => {
        GENERATORTABLE(data);
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

        GENERATORTABLE(prop)
        
    });
})

$("#findAllM").click(() => {
    $.get("/getProd", (data, status) => {
        GENERATORTABLE(data);
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
        GENERATORTABLE(prop);        
        
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
                    GENERATORTABLE(prop);

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
                    GENERATORTABLE(prop);
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

$("#clearBtn").click(() => {
    $("#name").val("");
    $("#barcode").val("");
    $("#preco").val("");
    $("#date").val("");
    M.updateTextFields();
})


function GENERATORTABLE(data) {

    data.sort(dynamicSort("name"));
    

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

    for (var i = 0; i < data.length; i++) {

        if (!isValid(data[i].valid)) {
            cont++;
            prop += `<tr class="red hoverable" data="`+i+`">
                <td>`+data[i].name+`</td>
                <td>`+data[i].barcode+`</td>`

            if (!data[i].price) {
                prop += `<td>-</td>`;
            }
            else {
                prop += `<td>`+data[i].price+` R$</td>`;
            }
            
            
            prop += `<td>`+data[i].valid+`</td>
                    </tr>`
        }
        else {
            
            prop += `<tr class = "hoverable" data="`+i+`">
                <td>`+data[i].name+`</td>
                <td>`+data[i].barcode+`</td>`

            if (!data[i].price) {
                prop += `<td>-</td>`;
            }
            else {
                prop += `<td>`+data[i].price+` R$</td>`;
            }
            
            prop += `<td>`+data[i].valid+`</td>
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

    

    $("#tableView").html(prop);
    $("tr").contextmenu(function() {
        var sel = $(this).attr("data");

        iziToast.show({
            title: "Deseja exluir "+data[sel].name+"?",
            position: "center",
            theme: "dark",
            buttons: [
                ['<button>Sim</button>', (istance, toast) => {
                    istance.hide({transitionOut: 'fadeOutUp'}, toast);
                    $.post("/removeBarcode", 
                    {barcode: data[sel].barcode},
                    (data, status) => {

                        if (data) {
                            iziToast.info({
                                title: "Produto excluido foi excluido",
                                position: "bottomLeft"
                            })

                            $.get("/getProd", (data, status) => {
                                GENERATORTABLE(data);
                            })
                            
                        }
                    })
                }, true],
                ['<button>Não</button>', (istance, toast) => {
                    iziToast.info({
                        title: "Produto não foi excluido"
                    });
                    istance.hide({transitionOut: 'fadeOutUp'}, toast);
                }, true]
            ]
        })
        
    });

    
    
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

function existBarcode(barcode, data) {
    var bol = false;
    for (var i = 0; i < data.length; i++) {
        if (data[i].barcode == barcode) {
            bol = true;
        }
    }
    return bol; 
}

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}