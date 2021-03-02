export {VettingWorkItemApp}
import { WorkItem } from "../../workitem.js"
import { ModalMenu } from "../../modalmenu.js"

// props. appId: documentPackage/ application id
class VettingWorkItemApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workItems: [],
      completeWorkItems: []
    };
    this.assessmentId = null;
    this.loadIncompleteWorkitems();
    this.formId = "workitem-create-form";
    this.modalmenu = React.createRef();
  }

  loadIncompleteWorkitems = () => {
    $.ajax({
      url: '/app_project/application/' + this.props.appId + '/workitems',
      type: 'GET',
      context: this,
      success: function(workitems) {
        console.log(workitems);
        let completeWorkItems = [],
            workItems = [];
        for (let i = 0, workitem; i< workitems.length; i++ ) {
          workitem = workitems[i];
          if (workitem.transferred == true || workitem.complete == true) {
            completeWorkItems.push(workitem);
          } else  {
            workItems.push(workitem);
          }
        }
        this.setState({
          workItems: workItems,
          completeWorkItems: completeWorkItems,
        });
      }
    });
  };

  onSubmit_createWorkItem = (e) => {
    e.preventDefault();
    const data = this.getData();
    data.application_id = this.props.appId;
    if (!data.handleit) {
      data.type = "assessment";
    }
    $.ajax({
      url: "/app_project/workitems",
      type: "POST",
      data: data,
      context: this,
      success: function(workitem) {
        console.log(workitem);
        this.clearForm();
        this.setState({
          workItems: [...this.state.workItems, workitem],
        })
      }
    })
  };

  clearForm = () => {
    const form = document.getElementById(this.formId);
    form.reset();
  }

  getData = () => {
    let data = {};
    let formData = new FormData($("#" + this.formId)[0]);
    
    for (let key of formData.keys()) {
      data[key] = formData.get(key);
    }
    data.handleit = data.handleit  == "on" ? true: false;
    return data;
  }

  remove_workitem = (workitem_id) => {
    this.setState(state => {
      var new_workitems = [...state.workItems];
      for (let i=0; i< new_workitems.length; i++) {
        if (new_workitems[i]._id == workitem_id) {
          new_workitems.splice(i, 1);
          break;
        }
      }
      return {workItems: new_workitems}
    });
  };

  set_create_materialsitem_menu = (e, materialsitem_handler) => {
    var data = {
      workitem_id: e.target.getAttribute("workitem_id")
    }
    this.modalmenu.current.show_menu(
      "create_materialsitem",
      funkie.create_materialsitem,
      data,
      materialsitem_handler,
    );
  };

  set_edit_workitem_menu = (data, edit_workitem_handler) => {
    this.modalmenu.current.show_menu(
      "edit_workitem",
      funkie.edit_workitem,
      data,
      edit_workitem_handler,
      "vetting"
    );
  };

  set_edit_materialisitem_menu = (old_data, edit_materialsitem_handler) => {
    this.modalmenu.current.show_menu(
      "edit_materialsitem",
      funkie.edit_materialsitem,
      old_data,
      edit_materialsitem_handler, // <WorkItem> method
    );
  };

  render() {
    return (
    <div>
      <div className="col-xs-12 col-sm-6 col-md-3" >
        <h3>Add a Work Item</h3>
        <div className="panel panel-primary work-item" name="new">
          <div className="panel-body">
            <h4 className="card-title">New Work Item</h4>
            <form onSubmit={this.onSubmit_createWorkItem} id={this.formId}>
              <div className="card-text">
                <div className="form-group">
                  <label className="form-control-label">Name*</label>
                  <input type="text" className="form-control" name="name" required/>
                </div>
                <div className="form-group">
                  <label className="form-control-label">Description*</label>
                  <textarea className="form-control" name="description" rows="3"></textarea>
                </div>
                <div className="form-group">
                  <label className="form-control-label">Vetting Comments*</label>
                  <textarea className="form-control" name="vetting_comments" rows="3" required></textarea>
                </div>
                <div className="form-group">
                  <label className="form-control-label">Handle-it</label>
                  <input type="checkbox" name="handleit" id="checkbox1" style={{"marginLeft": "10px; !important"}} />
                        </div>
              </div>
              <button type="submit" className="btn btn-primary card-link">Save</button>
              <button type="button" className="btn btn-danger card-link"
                onClick={this.clearForm}>Clear</button>
            </form>
          </div>
        </div>
      </div>
      <div className="col-xs-12 col-sm-6 col-md-9" id="workitems-container">
			  <h3>Current Work Items</h3>
        {this.state.workItems.map(workItem => {
          return (
          <WorkItem key={workItem._id} page_type={"vetting"}
            workitem={workItem}
            remove_workitem={this.remove_workitem}
            set_edit_materialisitem_menu={this.set_edit_materialisitem_menu}
            set_create_materialsitem_menu={this.set_create_materialsitem_menu}
            set_edit_workitem_menu = {this.set_edit_workitem_menu}
          />)
        })}
      </div>
      <div className="col-sm-12" id="complete-workitems-container">
        <h3>Complete Work Items</h3>
        {this.state.completeWorkItems.map(workItem => {
          return (
          <WorkItem key={workItem._id} page_type={"vetting"}
            workitem={workItem}
            // remove_workitem={this.remove_workitem}
            // set_edit_materialisitem_menu={this.set_edit_materialisitem_menu}
            // set_create_materialsitem_menu={this.set_create_materialsitem_menu}
            // set_edit_workitem_menu = {this.set_edit_workitem_menu}
          />)
        })}
      </div>

      <ModalMenu ref={this.modalmenu}/>
		</div>) ;   
  }
}