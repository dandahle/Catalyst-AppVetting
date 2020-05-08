window.onload = function() {
  app_obj.onload();

  $(".card-header").on("click", click_card_header);

  $("#service-form").on("submit", function(e) {
    e.preventDefault();
    $.ajax({
      type: "POST",
      url: "./services",
      data: $(this).serialize(),
      success: function(service, textStatus, xhr) {
        if (xhr.status == 201 || xhr.status == 200) {
          $("#serviceModal").modal("hide");
          $("#service-form")[0].reset();
          service_obj.add_service_row(service.applicant, service);
        }
      }
    });
  });
};

var app_obj = {
  applicants: null,
  onload() {
    this.load_applications();
    this.add_change_year_select_handler();
  },

  load_applications() {
    var completed_show_cmd = get_appstatus_show_status("completed");
    var completed_show_status = (completed_show_cmd == "show") ? true : false;
  
    $.ajax({
      type: "GET",
      url: "/carenetwork/applications?show_completed=" + completed_show_status,
      success: function(applicants, textStatus, xhr) {
        if (xhr.status == 200) {
          app_obj.applicants = applicants;
          app_obj.load_apps_to_table();
          app_obj.load_year_to_select();
        }
      }
    });
  },
  load_year_to_select() {
    var applicants = this.applicants;
    var $sel = $("#yearSelect");
    $sel.empty();
    $sel.append($("<option value='all'>All</select>"));

    var year;
    var re = /\d+\/\d+\/(\d+)/;

    var yearsObj = {},
        yearsArr = [];
    for(var i=0; i<applicants.length; i++) {
      year = re.exec(applicants[i].createdAt)[1];
      yearsObj[year] = true;
    }

    for (year in yearsObj) {
      yearsArr.push(year);
    }
    yearsArr.sort();
    for (var i =yearsArr.length - 1; i>= 0; i--) {
      $sel.append($(`<option >${yearsArr[i]}</select>`));
    }
  },
  add_change_year_select_handler() {
    $("#yearSelect").on("change", function() {
      var year = $(this).val();
      if (year == "all")
        app_obj.load_apps_to_table();
      else
      app_obj.load_apps_to_table(year);
    });
  },
  empty_tables() {
    $("tbody[class='apps_container']").empty();
  },
  load_apps_to_table(year) {
    this.empty_tables()
    toggle_card_headers();

    var applicants = this.applicants;
    for (var i=0; i<applicants.length; i++) {
      if (year != undefined) {
        if (applicants[i].createdAt.includes(year))
        this.add_application(applicants[i]);
      } else {
        this.add_application(applicants[i]);
      }
    }
  },
  add_application(applicant) {
    var $container, $tr, name;
    $container = $("#" + applicant.application_status+ "_container");
    $tr = $("<tr></tr>", {id: applicant._id + "_tr"});
  
    name = applicant.application.first_name;
    if (applicant.application.middle_name)
      name += " " + applicant.application.middle_name
    name += " " + applicant.application.last_name
    $tr.append(
      $(`<td><a href=${applicant.self}>${name}</a></td>`));
  
    $tr.append($(`<td>${applicant.createdAt}</td>`));
    $tr.append($(`<td>${applicant.updatedAt}</td>`));
    $tr.append($(`<td>${applicant.reference}</td>`));
    $tr.append($(`<td>${applicant.services.length}</td>`));
    var service_add_btn = create_service_add_btn(applicant._id),
        service_show_btn = create_service_hide_btn(applicant._id);
    $tr.append($(`<td></td>`)
      .append(service_add_btn)
      .append(service_show_btn)
      );
    $(service_add_btn).hide();
    
    $container.append($tr);
  
    service_obj.add_service_rows(applicant._id, applicant.services, $container);
  },
  empty_container() {

  },
}

var service_obj ={
  get_tr_class(applicant_id) {
    return applicant_id + "-service-tr";
  },
  add_service_rows(app_id, services, container_element) {
    var $service_tr,
        tr_classname = this.get_tr_class(app_id);

    // Header for Service
    $service_tr = $("<tr></tr>", 
      {"class": tr_classname + " table-info"});

    $service_tr.append($(`<th>Volunteer</th>`));
    $service_tr.append($(`<th colspan="2">Description</th>`));
    $service_tr.append($(`<th>Service Date</th>`));
    $service_tr.append($(`<th>Status</th>`));
    $service_tr.append($(`<th>Options</th>`));

    container_element.append($service_tr);
    $service_tr.hide();

    for (var i=0; i<services.length; i++) {
      $service_tr = this.make_service_row(app_id, services[i]);

      container_element.append($service_tr);
      $service_tr.hide();
    }
  },
  make_service_row(app_id, service) {
    var tr_classname = this.get_tr_class(app_id);

    var $service_tr = $("<tr></tr>", 
        {"class": tr_classname + " table-info"});

    $service_tr.append($(`<td>${service.volunteer}</td>`));
    $service_tr.append($(`<td colspan="2">${service.description}</td>`));
    $service_tr.append($(`<td>${service.service_date}</td>`));
    $service_tr.append($(`<td>${service.status}</td>`));
    $service_tr.append($(`<td></td>`));

    return $service_tr;
  },
  add_service_row(app_id, service) {
    var tr_classname = this.get_tr_class(app_id),
        new_tr = this.make_service_row(app_id, service);
    
    $trs = $("." + tr_classname);
    var $last_tr = $trs[$trs.length - 1];
    new_tr.insertAfter($last_tr);
  }
}

function create_service_add_btn(app_id) {
  var btn = document.createElement("button");
  btn.textContent = "Create Service";
  btn.setAttribute("value", app_id);
  btn.setAttribute("id", app_id + "-service-create-btn")
  btn.setAttribute("data-toggle", "modal");
  btn.setAttribute("data-target", "#serviceModal");
  btn.addEventListener("click", function(e) {
    var app_id = e.target.value;
    $("#service-app-id-input").val(app_id);
  });
  btn.classList.add("btn", "btn-primary", "btn-sm");
  return btn;
}

function create_service_hide_btn(app_id) {
  var btn = document.createElement("button");
  btn.textContent = "Show Service";
  btn.setAttribute("value", app_id);
  btn.addEventListener("click", function(ele) {
    var btn = ele.target,
        app_id = btn.getAttribute("value");

    if (btn.textContent.toUpperCase().includes("HIDE")) {
      $("." +service_obj.get_tr_class(app_id)).hide();
      btn.textContent = "Show Service";
      $("#" + app_id + "-service-create-btn").hide();
    } else {
      $("." +service_obj.get_tr_class(app_id)).show();
      btn.textContent = "Hide Service";
      $("#" + app_id + "-service-create-btn").show();
    }
  });

  btn.classList.add("btn", "btn-primary", "btn-sm");
  return btn;
}

// Iterate through all headers & check if show/hide
function toggle_card_headers() {
  var app_status;
  $(".card-header").each(function(index, ele) {
    app_status = $( this ).attr("value");
    toggle_card_header(app_status);
  });
}

function get_status_item_name(app_status) {
  return "CARE_show_" + app_status;
}

function click_card_header(e) {
  var app_status = $(this).attr("value");
  var result = toggle_appstatus_show_status(app_status);
  toggle_card_header(app_status);
  if (app_status == "completed" && result == "show" && 
    $("#completed_container").children().length == 0)
    app_obj.load_applications(); // Load app data to include completed apps
}

function toggle_appstatus_show_status(app_status) {
  var result = get_appstatus_show_status(app_status),
      item_name = get_status_item_name(app_status);
  
  var new_status = result == "show" ? "hide" : "show";

  window.localStorage.setItem(item_name, new_status);
  return new_status;
}

function get_appstatus_show_status(app_status) {
  var item_name = get_status_item_name(app_status);
  var result = window.localStorage.getItem(item_name);
  if (result === null || null === undefined)
    return "show";
  else
    return result;
}

function toggle_card_header(app_status) {
  var command = get_appstatus_show_status(app_status)
  var $table = $("#" + app_status + "_container"); // get table
  if (command == "hide")
    $table.parent().hide();
  else if (command == "show")
    $table.parent().show();
}