var React = require("react");
var ReactDOM = require("react-dom");

require('bootstrap/dist/js/bootstrap.min.js');
require('bootstrap/dist/css/bootstrap.min.css');
require('./styles/font-awesome/css/font-awesome.min.css');

require('../lib/nvd3/nv.d3.min.js');
require('../lib/nvd3/nv.d3.min.css');

require('jquery-ui/ui/widgets/sortable.js');
require('jquery-ui/themes/base/sortable.css');

//require('../lib/xlsx/xlsx.core.min.js');

require.context("./images/backgrounds/", true, /^\.\/.*\.jpg/);

require('./styles/comman.css');

var R2D2Router = require("./component/Router/R2D2Router");
var Container = R2D2Router.Container;
var Tab = R2D2Router.Tab;
var LoginComponent = require("./component/Login/LoginComponent");
var DashboardComponent = require("./component/Dashboard/DashboardComponent");
var FaceEnrollComponent = require("./component/FaceRecognition/FaceEnroll/FaceEnrollComponent");
var FaceLookupComponent = require("./component/FaceRecognition/FaceLookup/FaceLookupComponent");

ReactDOM.render(
    <Container path="">
    <Tab path="" handler={LoginComponent} signin={'required'}/>
    <Tab path="#" handler={LoginComponent} signin={'required'}/>
    <Tab path="#login" handler={LoginComponent} signin={'required'}/>
    <Tab path="#Dashboard" handler={DashboardComponent} signin={'required'}/>
    <Tab path="#FaceEnroll" handler={FaceEnrollComponent} signin={'required'}/>
    <Tab path="#FaceLookup" handler={FaceLookupComponent} signin={'required'}/>

</Container>, document.getElementById('app-container'));
