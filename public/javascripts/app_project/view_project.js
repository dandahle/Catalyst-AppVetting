class AppProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project: {},
      application: null,
    };
    this.load_project();
  }

  load_project() {
    if (project_id) {
      var that = this;
      $.ajax({
        url: "/app_project/projects/" + project_id,
        type: "GET",
        success: function(data) {
          console.log(data);
          that.load_application_data(data.documentPackage);
        }
      });
    }
  }

  load_application_data(documentPackage_id) {
    var that = this;
    $.ajax({
      url: "/app_project/application/" + documentPackage_id,
      type: "GET",
      success: function(app_data) {
        that.setState({application: app_data});
      }
    })
  }

  render() {
    return (
    <div>
      <ProjectMenu />
      <ApplicationInformation
        application={this.state.application} 
      />
    </div>);
  }
}

class ProjectMenu extends React.Component {
  render () {
    const divStyle = {
      height: funkie.calculate_page_height().toString() + "px",
    };
    return (<div className="col-sm-12 col-lg-8" style={divStyle}
        id="assessment-container">
        <div id="assessment-nav-container">
          <ul className="nav nav-tabs" id="nav-assessment-tabs" role="tablist">
            <li className="nav-item">
              <a className="nav-link active" id="nav-property-tab" data-toggle="tab" 
                href="#nav-workitem" role="tab">Work Items</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="nav-cost-summary-tab" data-toggle="tab" 
                href="#nav-cost-summary" role="tab">Cost Summary</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" id="nav-checklist-tab" data-toggle="tab" 
                href="#nav-checklist" role="tab">Checklist</a>
            </li>
          </ul>
        </div>

        <div className="tab-content overflow-auto" id="nav-assessment-tabContent">
          {/* <div className="tab-pane" id="nav-checklist" role="tabpanel">
            <AssessmentChecklist ref={this.checklist}
              assessment={{}}
              vetting_summary = {this.props.vetting_summary}
            />
          </div>
          <div className="tab-pane" id="nav-cost-summary" role="tabpanel">
            <CostSummary ref={this.costsummary}/>
          </div>
          <div className="tab-pane show active" id="nav-workitem" role="tabpanel">
            <button type="button" className="btn btn-primary" 
              onClick={this.props.set_create_workitem_menu}>
              Create Work Item
            </button>
            {this.state.workItems.map((workitem, index) => {
              return (
              <WorkItem
                workitem={workitem}
                remove_workitem={this.remove_workitem}
                set_edit_materialisitem_menu={this.props.set_edit_materialisitem_menu}
                set_create_materialsitem_menu={this.props.set_create_materialsitem_menu}
                set_edit_workitem_menu = {this.props.set_edit_workitem_menu}
                key={workitem._id+"-workitem-card"}></WorkItem>);
            })}
          </div> */}
        </div>
      </div>);
  }
}

function loadReact() {
  ReactDOM.render(<AppProject />, document.getElementById("project_container"));
}

loadReact();