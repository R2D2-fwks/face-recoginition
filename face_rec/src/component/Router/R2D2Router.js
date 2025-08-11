//Bundle changes
var React = require("react");
var CacheHandler = require('./../CacheDataHandler').CacheHandler;
var _loginhandler = require("./R2D2base");

var NotFound = React.createClass({
  displayName: 'NotFound',
  render: function() {
    return (
      <div className="NotFound">
            <h1> The Component is wrongly configured OR not available </h1>
            <h1> ERROR :~ 505 component not found !!  </h1>
      </div>
      );
    }
});

var Loading = React.createClass({
  displayName: 'Loading',
  render: function() {
    return (
      <div className="NotFound">
            <h1> Loading ...</h1>
      </div>
    );
  }
});


var Tab = React.createClass({
    displayName: 'Tab',  
    componentWillMount: function () {
    },
    render: function () {
          return ( <div className = "Tab">  </div>);
    }
});


var Router = React.createClass({
  displayName:'Router',
      // Lifecycle methods in React.js
  propTypes: {
        //landing: React.PropTypes.string.isRequired,
        routeRepo:React.PropTypes.object.isRequired
  }, 
  statics: {
      lastvistitedurl:'',
      getLoginHandler: function(){
          return _loginhandler;
      }
  },   
  getInitialState: function () {
            return{
                  //loadwidget: this.props.landing
            }
  },
  componentDidMount: function() {
          var IsRefresh = this.getF5Marker();  
          var location = window.location.hash.toString().trim();
          if (IsRefresh && IsRefresh != null && IsRefresh != "") {
                var propertyContainer = this.props.routeRepo[location];
                if( propertyContainer['signin'] === 'required'){
                      if(CacheHandler.isLoggedIn()){
                          this.setState({
                            loadwidget:location
                          });
                      }else{
                          console.log( "Not Logged redirecting to login screen !! "); 
                          this.setState({
                              loadwidget:'#login'    
                          });  
                      }
                }else{
                    this.setState({
                      loadwidget:location
                    });  
                }
                
          }
          else {
              var propertyContainer = this.props.routeRepo[location];
              
                if( propertyContainer['signin'] === 'required'){
                    if(Router.getLoginHandler().isLoggedIn()){
                        this.setState({
                          loadwidget: location
                        });
                    }else{
                        console.log( "Not Logged redirecting to login screen !! "); 
                        this.setState({
                            loadwidget:'#login'    
                        });
                    }
                }else{
                    //need to check why login is required
                     /*if(this.props.landing !='#login'){
                       this.setState({
                          loadwidget:window.location.hash 
                       });
                    }else{
                      this.setState({
                          loadwidget:this.props.landing 
                      });
                    }  */
                    this.setState({
                      loadwidget:location
                    });
                }
              this.setF5Marker();
           }   
          
         //******************************************************
         // Listener for any change in the window location hash 
         // This is typically the change in the #{tabname} which
         // occurs when a user clicks on the URL.
         // ******************************************************
         window.addEventListener("hashchange", function(){
                var location = window.location.hash.toString().trim();
                var propertyContainer = this.props.routeRepo[location];
                // var propertyContainer = this.props.routeRepo.get( window.location.hash );
                if( propertyContainer['signin'] === 'required'){
                    if(Router.getLoginHandler().isLoggedIn()){
                        this.setState({
                          loadwidget:location    
                        });
                    }else{
                        console.log( "Not Logged redirecting to login screen !! "); 
                        this.setState({
                            loadwidget:'#login'    
                        });  
                    }
                }else{
                     this.setState({
                          loadwidget:location  
                     });
                }
         }.bind(this), false);
 
  }, 
 // Helper method to manage the state of the tab/window
  setF5Marker: function () {
         sessionStorage.refreshMarker = true;
  },
  getF5Marker: function () {
         return sessionStorage.refreshMarker;
  },
     
  render: function() {
    var Component = NotFound;
    // console.log("this.state.loadwidget", this.state.loadwidget);
    // if( this.props.routeRepo.contains( this.state.loadwidget ) ) {
    if( this.props.routeRepo && this.props.routeRepo[this.state.loadwidget]) {
        var propertyContainer = this.props.routeRepo[this.state.loadwidget];
        // var propertyContainer = this.props.routeRepo.get( this.state.loadwidget );
        Component =  propertyContainer['handler'];
    }
    
    return (
      <div className="Router">
          <Component/>
      </div>
    );
  }
});

/**
 * Base react component which will
 */

var Container = React.createClass({
     displayName: 'Container', 
     propTypes: {
        //children: React.PropTypes.arrayOf( React.PropTypes.instanceOf(Tab)).isRequired,
        //landing: React.PropTypes.string.isRequired
     },
    
     componentWillMount: function() {
          for(var index=0;index < this.props.children.length;index++){
                var propertyContainer = {};
                propertyContainer['handler'] = this.props.children[index].props.handler;
                propertyContainer['signin'] = this.props.children[index].props.signin;
                this.addTab(this.props.children[index].props.path,propertyContainer); 
          } 
     },
     // addTab: function (name, component) {
     //        console.log(" Adding the component .. ");
     //        this.repo.put(name, component);
     // },
     // getTab: function (name) {
     //         return this.repo.get(name);
     // },  
     // repo: new Map(),  
     addTab: function (name, component) {
            console.log(" Adding the component .. ");
            this.repo[name] = component;
     },
     getTab: function (name) {
             return this.repo[name];
     },  
     repo: {},                         
     render: function () {
           return ( <div className = "Container" style = {{height: "100%"}}>
                   {/*<Router  routeRepo={this.repo} landing={this.props.landing}/>*/}
                   <Router  routeRepo={this.repo}/>
              </div>
           );
     }
});

//Bundle changes
var R2D2Router = {
'NotFound': NotFound,
'Container': Container,
'Tab':Tab,
'Router': Router
};

module.exports = R2D2Router;