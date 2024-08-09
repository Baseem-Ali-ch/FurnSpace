"use strict";
$(function() {
    let t, n, a;
    a = (isDarkStyle ? (t = config.colors_dark.borderColor, n = config.colors_dark.bodyBg, config.colors_dark) : (t = config.colors.borderColor, n = config.colors.bodyBg, config.colors)).headingColor;
    var e = $(".datatables-referral"),
        s = {
            1: {
                title: "Paid",
                class: "bg-label-success"
            },
            2: {
                title: "Unpaid",
                class: "bg-label-warning"
            },
            3: {
                title: "Rejected",
                class: "bg-label-danger"
            }
        };
    e.length && (e.DataTable({
        ajax: assetsPath + "json/ecommerce-referral.json",
        columns: [{
            data: ""
        }, {
            data: "id"
        }, {
            data: "user"
        }, {
            data: "referred_id"
        }, {
            data: "status"
        }, {
            data: "value"
        }, {
            data: "earning"
        }],
        columnDefs: [{
            className: "control",
            searchable: !1,
            orderable: !1,
            responsivePriority: 2,
            targets: 0,
            render: function(e, t, n, a) {
                return ""
            }
        }, {
            targets: 1,
            orderable: !1,
            searchable: !1,
            responsivePriority: 3,
            checkboxes: !0,
            checkboxes: {
                selectAllRender: '<input type="checkbox" class="form-check-input">'
            },
            render: function() {
                return '<input type="checkbox" class="dt-checkboxes form-check-input">'
            }
        }, {
            targets: 2,
            responsivePriority: 1,
            render: function(e, t, n, a) {
                var s = n.user,
                    r = n.email,
                    o = n.avatar;
                return '<div class="d-flex justify-content-start align-items-center customer-name"><div class="avatar-wrapper me-3"><div class="avatar avatar-sm">' + (o ? '<img src="' + assetsPath + "img/avatars/" + o + '" alt="Avatar" class="rounded-circle">' : '<span class="avatar-initial rounded-circle bg-label-' + ["success", "danger", "warning", "info", "dark", "primary", "secondary"][Math.floor(6 * Math.random())] + '">' + (o = (((o = (s = n.user).match(/\b\w/g) || []).shift() || "") + (o.pop() || "")).toUpperCase()) + "</span>") + '</div></div><div class="d-flex flex-column"><a href="app-ecommerce-customer-details-overview.html"class="text-heading"><span class="fw-medium text-truncate">' + s + '</span></a><small class="text-nowrap">' + r + "</small></div></div>"
            }
        }, {
            targets: 3,
            render: function(e, t, n, a) {
                return '<span class="text-heading">' + n.referred_id + "</span>"
            }
        }, {
            targets: 4,
            render: function(e, t, n, a) {
                n = n.status;
                return '<span class="badge rounded-pill ' + s[n].class + '" text-capitalized>' + s[n].title + "</span>"
            }
        }, {
            targets: 5,
            render: function(e, t, n, a) {
                return '<span  class="text-heading">' + n.value + "</span>"
            }
        }, {
            targets: 6,
            render: function(e, t, n, a) {
                return '<span  class="text-heading">' + n.earning + "</span > "
            }
        }],
        order: [
            [2, "asc"]
        ],
        dom: '<"card-header d-flex flex-column flex-sm-row py-md-0 align-items-start align-items-sm-center"<"head-label"><"d-flex align-items-sm-center justify-content-end mt-0 gap-4"l<"dt-action-buttons"B>>>t<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        language: {
            sLengthMenu: "_MENU_"
        },
        buttons: [{
            extend: "collection",
            className: "btn btn-primary dropdown-toggle waves-effect waves-light",
            text: '<i class="ri-upload-2-line ri-16px me-1"></i> <span class="d-none d-sm-inline-block">Export</span>',
            buttons: [{
                extend: "print",
                text: '<i class="ri-printer-line me-1" ></i>Print',
                className: "dropdown-item",
                exportOptions: {
                    columns: [1, 2, 3, 4, 5],
                    format: {
                        body: function(e, t, n) {
                            var a;
                            return e.length <= 0 ? e : (e = $.parseHTML(e), a = "", $.each(e, function(e, t) {
                                void 0 !== t.classList && t.classList.contains("customer-name") ? a += t.lastChild.firstChild.textContent : void 0 === t.innerText ? a += t.textContent : a += t.innerText
                            }), a)
                        }
                    }
                },
                customize: function(e) {
                    $(e.document.body).css("color", a).css("border-color", t).css("background-color", n), $(e.document.body).find("table").addClass("compact").css("color", "inherit").css("border-color", "inherit").css("background-color", "inherit")
                }
            }, {
                extend: "csv",
                text: '<i class="ri-file-text-line me-1" ></i>Csv',
                className: "dropdown-item",
                exportOptions: {
                    columns: [1, 2, 3, 4, 5],
                    format: {
                        body: function(e, t, n) {
                            var a;
                            return e.length <= 0 ? e : (e = $.parseHTML(e), a = "", $.each(e, function(e, t) {
                                void 0 !== t.classList && t.classList.contains("customer-name") ? a += t.lastChild.firstChild.textContent : void 0 === t.innerText ? a += t.textContent : a += t.innerText
                            }), a)
                        }
                    }
                }
            }, {
                extend: "excel",
                text: '<i class="ri-file-excel-line me-1"></i>Excel',
                className: "dropdown-item",
                exportOptions: {
                    columns: [1, 2, 3, 4, 5],
                    format: {
                        body: function(e, t, n) {
                            var a;
                            return e.length <= 0 ? e : (e = $.parseHTML(e), a = "", $.each(e, function(e, t) {
                                void 0 !== t.classList && t.classList.contains("customer-name") ? a += t.lastChild.firstChild.textContent : void 0 === t.innerText ? a += t.textContent : a += t.innerText
                            }), a)
                        }
                    }
                }
            }, {
                extend: "pdf",
                text: '<i class="ri-file-pdf-line me-1"></i>Pdf',
                className: "dropdown-item",
                exportOptions: {
                    columns: [1, 2, 3, 4, 5],
                    format: {
                        body: function(e, t, n) {
                            var a;
                            return e.length <= 0 ? e : (e = $.parseHTML(e), a = "", $.each(e, function(e, t) {
                                void 0 !== t.classList && t.classList.contains("customer-name") ? a += t.lastChild.firstChild.textContent : void 0 === t.innerText ? a += t.textContent : a += t.innerText
                            }), a)
                        }
                    }
                }
            }, {
                extend: "copy",
                text: '<i class="ri-file-copy-line me-1"></i>Copy',
                className: "dropdown-item",
                exportOptions: {
                    columns: [1, 2, 3, 4, 5],
                    format: {
                        body: function(e, t, n) {
                            var a;
                            return e.length <= 0 ? e : (e = $.parseHTML(e), a = "", $.each(e, function(e, t) {
                                void 0 !== t.classList && t.classList.contains("customer-name") ? a += t.lastChild.firstChild.textContent : void 0 === t.innerText ? a += t.textContent : a += t.innerText
                            }), a)
                        }
                    }
                }
            }]
        }],
        responsive: {
            details: {
                display: $.fn.dataTable.Responsive.display.modal({
                    header: function(e) {
                        return "Details of " + e.data().user
                    }
                }),
                type: "column",
                renderer: function(e, t, n) {
                    n = $.map(n, function(e, t) {
                        return "" !== e.title ? '<tr data-dt-row="' + e.rowIndex + '" data-dt-column="' + e.columnIndex + '"><td>' + e.title + ":</td> <td>" + e.data + "</td></tr>" : ""
                    }).join("");
                    return !!n && $('<table class="table"/><tbody />').append(n)
                }
            }
        }
    }), $("div.head-label").html('<h5 class="card-title text-nowrap mb-5 mb-sm-0">Referred users</h5>'), $(".dt-action-buttons").addClass("pt-0"))
});