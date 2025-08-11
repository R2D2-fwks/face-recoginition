//Bundle changes
var React = require("react");

var CacheHandler = require('./CacheDataHandler').CacheHandler;

var MenuComponent = React.createClass({
    render: function() {
        return (
            <div>
                <NavigationBar/>
                <div className="navbar navbar-inverse navbar-twitch col-md-2" role="navigation">
                    <div className="container">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="#">
                                <span className="small-nav"> <span className="logo"> D </span> </span>
                                <span className="full-nav"> DemoBox </span>
                            </a>
                        </div>

                        <div>
                            <ul className="nav navbar-nav">
                            {/* <ListItems nameOfClass="fa fa-tachometer fa-style" name="Dashboard" smallClassName = "small-nav-fa fa fa-tachometer" ListItemshref="#Dashboard"/>*/}
                            <ListAccordion fullAccordionClassName ="fa fa-bolt fa-style" listElementName="Face Recognition"
                                smallAccordionClassName="small-nav-fa fa fa-bolt" AccordionHref="#accordion-menu-2"
                                children={["FaceEnroll","FaceLookup"]} />
                            {/* <ListAccordion fullAccordionClassName ="fa fa-database fa-style" listElementName="Data Management"
                                smallAccordionClassName="small-nav-fa fa fa-database" AccordionHref="#accordion-menu-1"
                                children={["Upload","Merge Data"]} />
                            <ListItems nameOfClass="fa fa-comments fa-style" name="External Data Source" smallClassName = "small-nav-fa fa fa-comments" ListItemshref="#ExtnlDataSource"/>
                            <ListItems nameOfClass="fa fa-pencil-square-o fa-style" name="View Designer" smallClassName = "small-nav-fa fa fa-pencil-square-o" ListItemshref="#Workbench"/>
                            <ListAccordion fullAccordionClassName="fa fa-file-image-o fa-style" listElementName="Report Designer"
                                smallAccordionClassName="small-nav-fa fa fa-file-image-o" AccordionHref="#accordion-menu-3"
                                children={["MultiDimensional","Adhoc","Dashboards"]} />
                            <ListItems nameOfClass="fa fa-eye fa-style" name="View Reports" smallClassName = "small-nav-fa fa fa-eye" ListItemshref="#ViewReports"/>
                            <ListItems nameOfClass="fa fa-user fa-style" name="My Profile" smallClassName = "small-nav-fa fa fa-user" ListItemshref="#UserProfiles"/>
                            <ListItems nameOfClass="fa fa-black-tie fa-style" name="Administration Settings" smallClassName = "small-nav-fa fa fa-black-tie" ListItemshref="#Admin"/> */}
                            </ul>
                        </div>

                    </div>
                </div>
            </div>

        );

    }

});


var NavigationBar = React.createClass({
    getInitialState: function(){
        return {
           userID : CacheHandler.getProfileID()
        }
    },
    componentDidMount: function() {

        $("#sidebar-toggle").click(function() {
            if ($('#twitch-toggle').css("marginLeft") == "40px" && $('#workarea').css("marginLeft") == "80px") {
                $('#twitch-toggle')
                    .animate({
                        marginLeft: "240px"
                    }, 100);
                $('#workarea')
                    .animate({
                        marginLeft: "280px"
                    }, 100);
                $('#twitch-toggle')
                    .removeClass('fa-arrow-circle-right');
                $('#twitch-toggle')
                    .addClass('fa-arrow-circle-left');
            } else if ($('#twitch-toggle').css("marginLeft") == "240px" && $('#workarea').css("marginLeft") == "280px") {
                $('#twitch-toggle')
                    .animate({
                        marginLeft: "40px"
                    }, 100);
                $('#workarea')
                    .animate({
                        marginLeft: "80px"
                    }, 100);
                $('#twitch-toggle')
                    .removeClass('fa-arrow-circle-left');
                $('#twitch-toggle')
                    .addClass('fa-arrow-circle-right');
            }
        });

        $('.navbar-twitch-toggle').on('click', function(event) {
            event.preventDefault();
            $('.navbar-twitch')
                .toggleClass('open', 100);
        });

        this.setState({
            userID: CacheHandler.getProfileID()
        });

    },
    render: function() {
        return (
            <nav id="menu-bar" className="navbar navbar-inverse navbar-fixed-top">
                <div className="navbar-header col-md-3" id="navbar-header">
                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#profile" id="profile-toggle">
                        <span className="icon-bar">
                                        </span>
                        <span className="icon-bar">
                                        </span>
                        <span className="icon-bar">
                                        </span>
                    </button>
                    <a href="#clicked" id="sidebar-toggle">
                        <span style={{ "fontSize": "25px", "marginTop": "15px", "marginLeft": "40px", "color": "white"}}
                            className="fa fa-arrow-circle-right navbar-twitch-toggle" id="twitch-toggle" />
                    </a>
                </div>
                <div className="col-md-5">
                    <ul className="nav navbar-nav">
                        <li>
                            <a id="tool-name">
                                <b>DemoBox</b> powered by NOVA AI platform
                            </a>
                        </li>
                    </ul>
                </div>
                {/*}<div className="collapse navbar-collapse col-md-4" id="profile">
                    <ul>
                        <li>
                            <div id="user-name">
                                <img src="images/user-icon.jpg" className="img-rounded" id="user-img" /> { this.state.userID }
                                &nbsp;&nbsp;&nbsp;
                                <a href="#"><i className="fa fa-lg fa-sign-out" aria-hidden="true" /></a>
                            </div>
                        </li>
                    </ul>
                </div>*/}
            </nav>

        );

    }

});

var ListItems = React.createClass({
    getInitialState: function() {
        return {
            nameOfClass: "",
            name: "",
            smallClassName: "",
            ListItemshref:""
        };
    },
    componentWillMount: function() {
        this.setState({
            nameOfClass: this.props.nameOfClass,
            name: this.props.name,
            smallClassName: this.props.smallClassName,
            ListItemshref: this.props.ListItemshref
        })
    },

    render: function() {
        return (

          <li>

            <a href={this.state.ListItemshref}>

              <span
                className="small-nav"
                data-toggle="tooltip"
                data-placement="right"
                title={this.state.name}>

                <span className={this.state.smallClassName}>
                </span>

              </span>

              <span className="full-nav">
                <span className={this.state.nameOfClass}>
                </span>
                <span className="menuListElement">

                  {this.state.name}
                </span>
              </span>

            </a>

          </li>
        );
    }
});

var ListAccordion = React.createClass({
    getInitialState: function() {
        return {
            fullAccordionClassName: "",
            listElementName: "",
            smallAccordionClassName: "",
            AccordionHref: "",
            children: []
        };
    },
    componentWillMount: function() {
        this.setState({
            fullAccordionClassName: this.props.fullAccordionClassName,
            listElementName: this.props.listElementName,
            smallAccordionClassName: this.props.smallAccordionClassName,
            AccordionHref: this.props.AccordionHref,
            children: this.props.children
        })
    },
    render: function() {
        var childEl = [];
        try {
            this.state.children.forEach( function(element, index) {
                childEl.push(<AccordionDropDownListElement AccordionDropDownListElementTitle={element} key={index}/>);
            });
        } catch(e) {
            console.log(e);
        }

        var id = (this.state.AccordionHref + '').replace('#', '');
        return (
            <li>
                <a href="#">
                    <span className="small-nav" data-toggle="collapse" data-placement="right" title={this.state.listElementName}>
                        <span className= {this.state.smallAccordionClassName} ></span>
                    </span>
                    <span className="full-nav" data-toggle="collapse" href={this.state.AccordionHref}>
                        <span className= {this.state.fullAccordionClassName} ></span>
                        <span className="accordion-name">{this.state.listElementName}</span>
                        <span className="fa fa-arrow-circle-o-down fa-accordion"></span>
                    </span>
                </a>
                <div className="dropdown-content full-nav">
                    <ul id={id} className="accordion-menu collapse">
                        {childEl ? childEl : null}
                    </ul>
                </div>
            </li>
        );
    }
});

var AccordionDropDownListElement = React.createClass({

    getInitialState: function() {
        return {
            AccordionDropDownListElementTitle: ""
        };
    },
    componentWillMount: function() {
        this.setState({
            AccordionDropDownListElementTitle: this.props.AccordionDropDownListElementTitle
        })
    },
    handleOnClick: function(){
        console.log("U have clicked " + this.state.AccordionDropDownListElementTitle);
        var currentURL = window.location.hash;
        window.location.hash = "!";
        var elmTitle = this.state.AccordionDropDownListElementTitle;
        elmTitle = elmTitle.replace(/\s/g, "");
        window.location.hash = "#"+ elmTitle;

    },
    render: function() {
        return (
            <li ><a onClick={this.handleOnClick}><i className="accordian-fa" aria-hidden="true"></i>
          {this.state.AccordionDropDownListElementTitle}</a></li>

        );
    }

});

//Bundle changes
module.exports = MenuComponent;
