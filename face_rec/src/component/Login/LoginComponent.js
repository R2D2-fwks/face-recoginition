//Bundle changes
var React = require("react");
var LoginHelper = require('./LoginHelper');
var _ = require('lodash');
var CredentailsEventBus = LoginHelper.CredentailsEventBus;
var CredentailsActionHandler = LoginHelper.CredentailsActionHandler;

// require('jquery.backstretch/jquery.backstretch.min.js');

require('../../styles/Login/loginComponent.css');
//require('../../bundle.css');

var LoginComponent = React.createClass({
    displayName: 'Credentails',
    propTypes: {
        userId: React.PropTypes.string,
        pswd: React.PropTypes.string,
    },
    statics: {
        getEventBus: function() {
            return new CredentailsEventBus();
        },
        getActionHandler: function(){
            return new CredentailsActionHandler();
        }
    },
    getInitialState: function() {
        return {
            userId: "Please type your username",
            pswd: "Please type your password"
        };
    },
    componentDidMount: function() {
        var self = this;
        LoginComponent.getEventBus().bind('validateUser', LoginComponent.getActionHandler().validateUserResult);
        //Bundle changes
        // $.backstretch([
        //             "images/2.jpg"
        //           , "images/3.jpg"
        //           , "images/1.jpg"
        //          ], {duration: 3000, fade: 750});

    },

    componentWillUnmount: function() {
        // $('body').backstretch("destroy");
        //Box.getCommunicationHandler(this.props.uniqueID).unbind('openchannel' , this.openchannel );
        //Box.getCommunicationHandler(this.props.uniqueID).unbind( this.props.uniqueID , this.openchannel );
    },

    handleLogin: function(event) {
        var credentails = {};
        //Bundle changes
        credentails.userName = this.refs.username.value;
        credentails.password = this.refs.password.value;

        var isUserIdEntered = (credentails.userName && !_.isNull(credentails.userName) && _.toString(credentails.userName).trim() != '');
        var isPasswordEntered = (credentails.password && !_.isNull(credentails.password) && _.toString(credentails.password).trim() != '');
        if (isUserIdEntered && isPasswordEntered) {
            LoginComponent.getEventBus().publish('validateUser', credentails);
        } else {
            if (!isUserIdEntered && !isPasswordEntered) {
                alert('Please enter your userid and password to sign-in');
            } else if (!isUserIdEntered) {
                alert('Please enter your userid to sign-in');
            } else if (!isPasswordEntered) {
                alert('Please enter your password to sign-in');
            }
        }
    },
    render: function() {
        /*
            Fullscreen background
        */
        return (

        <div className="top-content .bgimg" id="login-formbox">

            <div className="inner-bg">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12 text" id="login-header">
                            {/*<h1 id = "login-name"><strong>Dun &amp; Bradstreet</strong> </h1>*/}
                            <div className="description"></div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6 col-sm-offset-3 form-box" style = {{ width: 600 }}>
                          <div className="form-top">
                            <div className="form-top-left">
                              <h3 id = "login-name">Login to <b>DemoBox</b></h3>

                                <p id = "login-name">powered by NOVA AI platform</p>
                            </div>
                            <div className="form-top-right">
                              <i className="fa fa-lock"></i>
                            </div>
                            </div>
                            <div className="form-bottom">
                          <div  className="login-form ">
                            <div className="form-group">
                              <label className="sr-only" htmlFor="form-username">Username</label>
                                <input type="text" ref="username" name="form-username" placeholder="Username..." className="form-username form-control" id="form-username" />
                              </div>
                              <div className="form-group">
                                <label className="sr-only" htmlFor="form-password">Password</label>
                                <input type="password" ref="password" name="form-password" placeholder="Password..." className="form-password form-control" id="form-password" />
                              </div>
                              <button type="submit" className="btn" onClick={this.handleLogin}>Sign in!</button>
                          </div>
                        </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
        )
    }
});

//Bundle changes
module.exports = LoginComponent;
