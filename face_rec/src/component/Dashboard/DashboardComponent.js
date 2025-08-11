var React = require("react");

require('../../styles/Dashboard/DashboardComponent.css');

var MenuComponent = require('./../MenuComponent');
// var TickerFeed = require('./FeederComponent');
// var DashboardChartComponent = require('./DashboardChartComponent');
// var DashboardInfoBox = require('./DashboardInfoBox');
var fdb = require('../CacheDataHandler').fdb;

var DashboardComponent = React.createClass({
    getInitialState: function(){
      return{
        noOfCollections: "",
        recentCollectionName: "",
        noOfDashBoardViews: "",
        recentDashBoardViewName: "",
        infoboxProps: {}
      }
    },
    // componentWillMount: function () {
    //   var payload = {};
    //   var me = this;
    //   payload.userName = fdb.db("users-db").collection("profile").find({})[0].userid;
    //   $.ajax({
    //       type: 'POST',
    //       url: "/myapp/getDashBoardCollectionsData",
    //       data: payload,
    //       success: function(data, textStatus) {
    //           me.setState({noOfCollections: data.noOfCollections});
    //           me.setState({recentCollectionName: data.collectionName});
    //           me.setState({noOfDashBoardViews: data.noOfDashBoardViews});
    //           me.setState({recentDashBoardViewName: data.recentDashBoardViewName});
    //       },
    //       error: function(data) {
    //           console.log(data.responseText); // use any display logic here
    //       },
    //       dataType: "json"
    //   });
    // },

    render: function() {
        return (
            <div id="dashboard-container">
                <MenuComponent/>
                <div id="workarea">
                    {/*<div id="dashboardComponent" className="row">
                        <DashboardInfoBox infoBoxContent={this.state.noOfCollections} infoBoxHeader="No Of Collections" showBoxSeperator={true}/>
                        <DashboardInfoBox infoBoxContent={this.state.recentCollectionName} infoBoxHeader="Recent Collection" showBoxSeperator={true}/>
                        <DashboardInfoBox infoBoxContent={this.state.noOfDashBoardViews} infoBoxHeader="No Of Views" showBoxSeperator={true}/>
                        <DashboardInfoBox infoBoxContent={this.state.recentDashBoardViewName} infoBoxHeader="Recent View" showBoxSeperator={true}/>
                        <DashboardInfoBox infoBoxContent="2013.9" infoBoxHeader="Recent View" showBoxSeperator={true}/>
                        <DashboardInfoBox infoBoxContent="500" infoBoxHeader="Recent View" showBoxSeperator={false}/>

                        <div className="row">
                            <DashboardChartComponent />
                            <TickerFeed />
                        </div>
                    </div>*/}
                    <div className = "row col-md-12">
                          <p style={{"align":"center", "paddingLeft": "40%" ,"color": "#7ed0da", "font-size": "30px"}}>Welcome</p>
                          <p style={{"align":"center", "paddingLeft": "40%","font-size": "30px", "color": "rgb(236, 110, 110)"}}>Velkommen</p>
                          <p style={{"align":"center", "paddingLeft": "40%","font-size": "30px", "color": "#e89d58"}}>வரவேற்பு</p>
                          <p style={{"align":"center", "paddingLeft": "40%","font-size": "30px", "color": "rgba(119, 115, 111, 0.88)"}}>स्वागत</p>
                          <p style={{"align":"center", "paddingLeft": "40%","font-size": "30px", "color": "rgb(94, 210, 75)"}}>خوش آمدی</p>
                          <p style={{"align":"center", "paddingLeft": "40%","font-size": "30px", "color": "rgb(186, 141, 241)"}}>欢迎</p>
                          <p style={{"align":"center", "paddingLeft": "40%","font-size": "30px", "color": "rgb(88, 196, 232)"}}>Сәлемдесу</p>
                            <p style={{"align":"center", "paddingLeft": "40%","font-size": "30px", "color": "rgb(253, 152, 188)"}}>ようこそ</p>
                              <p style={{"align":"center", "paddingLeft": "40%","font-size": "30px", "color": "rgb(154, 146, 139)"}}>välkommen</p>


                    </div>
                </div>
            </div>
        );
    }
});

//Bundle changes
module.exports = DashboardComponent;
