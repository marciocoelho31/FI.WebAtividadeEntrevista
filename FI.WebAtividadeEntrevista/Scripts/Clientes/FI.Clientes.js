
$(document).ready(function () {
    $("#CPF").mask('000.000.000-00', { reverse: true });
    $("#CPF_Beneficiario").mask('000.000.000-00', { reverse: true });
    $("#edicaoBenef").val("0").trigger('change');
    $("#id_para_edicaoBenef").val("").trigger('change');

    $('#formCadastro').submit(function (e) {
        e.preventDefault();

        if (!TestaCPF($("#CPF").val())) {
            ModalDialog("Erro", "CPF Inválido.");
            return;
        }

        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "NOME": $(this).find("#Nome").val(),
                "CEP": $(this).find("#CEP").val(),
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": $(this).find("#Telefone").val(),
                "CPF": $(this).find("#CPF").val()
            },
            error:
                function (r) {
                    if (r.status == 400)
                        ModalDialog("Ocorreu um erro", r.responseJSON);
                    else if (r.status == 500)
                        ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
                },
            success:
                function (r) {

                    $("#Id").val(r).trigger('change');
                    SalvarBeneficiarios();

                    ModalDialog("Sucesso!", "Cadastro efetuado com sucesso!")
                    $("#formCadastro")[0].reset();
                    window.location.href = urlRetorno;
                }
        });
    })

    $('#btnIncluirBenef').click(function (e) {
        e.preventDefault();

        if (!TestaCPF($("#CPF_Beneficiario").val())) {
            ModalDialog("Erro", "CPF Inválido.");
            return;
        }

        var edicao = $("#edicaoBenef").val();
        if (edicao == null || edicao == "" || edicao == "0") {

            if ($("#divBeneficiarios > div.row").find(":first:contains('" + $("#CPF_Beneficiario").val() + "')").length > 0) {
                ModalDialog("Erro", "CPF já cadastrado como beneficiário deste cliente.");
                return;
            }

            var element = "<div id=\"id_" + RemovePontosTracos($("#CPF_Beneficiario").val()) + "\" class=\"row\" style=\"background-color: #f1f1f1; padding-top: 6px; margin-left:3px; margin-right: 3px;\" >" +
                "<div class=\"col-md-4\" style=\"height: 35px;\"><div class=\"form-group\">" +
                $("#CPF_Beneficiario").val() +
                "</div></div><div class=\"col-md-4\" style=\"height: 35px;\"><div class=\"form-group\">" +
                $("#Nome_Beneficiario").val() +
                "</div></div><div class=\"col-md-4\" style=\"height: 35px;\"><div class=\"form-group\">" +
                "<button type=\"button\" id=\"btnAlterarBenef\" class=\"btn btn-sm btn-primary\" onclick=\"CarregaAlterarBeneficiario(this);\" >" +
                "Alterar</button>&nbsp;&nbsp;<button type=\"button\" id=\"btnExcluirBenef\" " +
                "class=\"btn btn-sm btn-primary\" onclick=\"RemoveBeneficiario(this);\" > Excluir</button></div></div></div>";
            $("#divBeneficiarios").append(element);
        }
        else {
            if ($("#id_para_edicaoBenef").val() != "") {
                var id = $("#id_para_edicaoBenef").val();
                $("#" + id + " :first").html("<div class=\"form-group\">" + $("#CPF_Beneficiario").val() + "</div>");
                $("#" + id + " :eq(2)").html("<div class=\"form-group\">" + $("#Nome_Beneficiario").val() + "</div>");
            }
        }

        $("#CPF_Beneficiario").val("").trigger('change');
        $("#Nome_Beneficiario").val("").trigger('change');
        $("#btnIncluirBenef").html("Incluir");
        $("#edicaoBenef").val("0").trigger('change');

    })


})

function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                                                                                                                   ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '  </div><!-- /.modal-dialog -->                                                                                    ' +
        '</div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}

function RemoveBeneficiario(obj) {
    if (confirm("Deseja realmente excluir este beneficiário?")) {
        var id = obj.parentElement.parentElement.parentElement.attributes[0].nodeValue
        $("#" + id).remove();
    }
}

function RemovePontosTracos(texto) {
    return texto.replaceAll(".", "").replaceAll("-", "");
}

function CarregaAlterarBeneficiario(obj) {
    var id = obj.parentElement.parentElement.parentElement.attributes[0].nodeValue;
    $("#CPF_Beneficiario").val($("#" + id + " :first")[0].innerText).trigger('change');
    $("#Nome_Beneficiario").val($("#" + id + " :eq(2)")[0].innerText).trigger('change');
    $("#btnIncluirBenef").html("Alterar");
    $("#edicaoBenef").val("1").trigger('change');
    $("#id_para_edicaoBenef").val(id).trigger('change');
}

function SalvarBeneficiarios() {
    $("#divBeneficiarios div.row").each(function (index) {
        if (index > 0) {
            $.ajax({
                url: urlPostBenef,
                method: "POST",
                data: {
                    "Nome": this.children[1].innerText.trim(),
                    "CPF": this.children[0].innerText.trim(),
                    "IdCliente": $("#Id").val()
                },
                error:
                    function (r) {
                        if (r.status == 400)
                            ModalDialog("Ocorreu um erro no beneficiário", r.responseJSON);
                        else if (r.status == 500)
                            ModalDialog("Ocorreu um erro no beneficiário", "Ocorreu um erro interno no servidor.");
                    },
                success:
                    function (r) {
                        //ModalDialog("Sucesso!", r)
                        //$("#formCadastro")[0].reset();
                        //window.location.href = urlRetorno;
                    }
            });

        }
    });
}

