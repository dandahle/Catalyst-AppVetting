var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

export { VettingWorkItemApp };
import { WorkItem } from "../../workitem.js";
import { ModalMenu } from "../../modalmenu.js";

// props. appId: documentPackage/ application id

var VettingWorkItemApp = function (_React$Component) {
  _inherits(VettingWorkItemApp, _React$Component);

  function VettingWorkItemApp(props) {
    _classCallCheck(this, VettingWorkItemApp);

    var _this = _possibleConstructorReturn(this, (VettingWorkItemApp.__proto__ || Object.getPrototypeOf(VettingWorkItemApp)).call(this, props));

    _this.loadAssessment = function () {
      $.ajax({
        url: "/app_project//site_assessments/application/" + _this.props.appId,
        context: _this,
        type: "GET",
        success: function success(assessment) {
          console.log(assessment);
          this.assessmentId = assessment._id;
          this.setState({
            workItems: assessment.workItems
          });
        }
      });
    };

    _this.onSubmit_createWorkItem = function (e) {
      e.preventDefault();
      if (_this.assessmentId) {
        var data = _this.getData();
        data.type = "assessment";
        data.assessment_id = _this.assessmentId;
        $.ajax({
          url: "/app_project/workitems",
          type: "POST",
          data: data,
          context: _this,
          success: function success(workitem) {
            this.clearForm();
            this.setState({
              workItems: [].concat(_toConsumableArray(this.state.workItems), [workitem])
            });
          }
        });
      }
    };

    _this.clearForm = function () {
      var form = document.getElementById(_this.formId);
      form.reset();
    };

    _this.getData = function () {
      var data = {};
      var formData = new FormData($("#" + _this.formId)[0]);
      formData.set("handleit", formData.get("handleit") == "on" ? true : false);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = formData.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          data[key] = formData.get(key);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return data;
    };

    _this.remove_workitem = function (workitem_id) {
      _this.setState(function (state) {
        var new_workitems = [].concat(_toConsumableArray(state.workItems));
        for (var i = 0; i < new_workitems.length; i++) {
          if (new_workitems[i]._id == workitem_id) {
            new_workitems.splice(i, 1);
            break;
          }
        }
        return { workItems: new_workitems };
      });
    };

    _this.set_create_materialsitem_menu = function (e, materialsitem_handler) {
      var data = {
        workitem_id: e.target.getAttribute("workitem_id")
      };
      _this.modalmenu.current.show_menu("create_materialsitem", funkie.create_materialsitem, data, materialsitem_handler);
    };

    _this.set_edit_workitem_menu = function (data, edit_workitem_handler) {
      _this.modalmenu.current.show_menu("edit_workitem", funkie.edit_workitem, data, edit_workitem_handler, "vetting");
    };

    _this.set_edit_materialisitem_menu = function (old_data, edit_materialsitem_handler) {
      _this.modalmenu.current.show_menu("edit_materialsitem", funkie.edit_materialsitem, old_data, edit_materialsitem_handler // <WorkItem> method
      );
    };

    _this.state = {
      workItems: []
    };
    _this.assessmentId = null;
    _this.loadAssessment();
    _this.formId = "workitem-create-form";
    _this.modalmenu = React.createRef();
    return _this;
  }

  _createClass(VettingWorkItemApp, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          { className: "col-xs-12 col-sm-6 col-md-3" },
          React.createElement(
            "h3",
            null,
            "Add a Work Item"
          ),
          React.createElement(
            "div",
            { className: "panel panel-primary work-item", name: "new" },
            React.createElement(
              "div",
              { className: "panel-body" },
              React.createElement(
                "h4",
                { className: "card-title" },
                "New Work Item"
              ),
              React.createElement(
                "form",
                { onSubmit: this.onSubmit_createWorkItem, id: this.formId },
                React.createElement(
                  "div",
                  { className: "card-text" },
                  React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                      "label",
                      { className: "form-control-label" },
                      "Name*"
                    ),
                    React.createElement("input", { type: "text", className: "form-control", name: "name", required: true })
                  ),
                  React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                      "label",
                      { className: "form-control-label" },
                      "Description*"
                    ),
                    React.createElement("textarea", { className: "form-control", name: "description", rows: "3" })
                  ),
                  React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                      "label",
                      { className: "form-control-label" },
                      "Vetting Comments*"
                    ),
                    React.createElement("textarea", { className: "form-control", name: "vetting_comments", rows: "3", required: true })
                  ),
                  React.createElement(
                    "div",
                    { className: "form-group" },
                    React.createElement(
                      "label",
                      { className: "form-control-label" },
                      "Handle-it"
                    ),
                    React.createElement("input", { type: "checkbox", name: "handleit", id: "checkbox1", style: { "marginLeft": "10px; !important" } })
                  )
                ),
                React.createElement(
                  "button",
                  { type: "submit", className: "btn btn-primary card-link" },
                  "Save"
                ),
                React.createElement(
                  "button",
                  { type: "button", className: "btn btn-danger card-link",
                    onClick: this.clearForm },
                  "Clear"
                )
              )
            )
          )
        ),
        React.createElement(
          "div",
          { className: "col-xs-12 col-sm-6 col-md-9", id: "workitems-container" },
          React.createElement(
            "h3",
            null,
            "Current Work Items"
          ),
          this.state.workItems.map(function (workItem) {
            return React.createElement(WorkItem, { key: workItem._id,
              workitem: workItem,
              remove_workitem: _this2.remove_workitem,
              set_edit_materialisitem_menu: _this2.set_edit_materialisitem_menu,
              set_create_materialsitem_menu: _this2.set_create_materialsitem_menu,
              set_edit_workitem_menu: _this2.set_edit_workitem_menu
            });
          })
        ),
        React.createElement(ModalMenu, { ref: this.modalmenu })
      );
    }
  }]);

  return VettingWorkItemApp;
}(React.Component);