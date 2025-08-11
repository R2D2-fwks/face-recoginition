var React = require('react');
var jQuery = require('jquery/dist/jquery.min.js');
var _ = require('lodash');

var fdb = require('../../CacheDataHandler').fdb;
var MenuComponent = require('../../MenuComponent');

require('../../../styles/uploadComp.css');


var FileNameComp = React.createClass({
  render: function() {
    return (
      <label>File Selected: {this.props.filenameselcted}</label>
    )
  }
})

var FaceLookupComponent = React.createClass({
  getInitialState: function() {
    return ({
      intervalId: 0,
      fileName: '',
      infoList: [],
      filenameselcted: '',
      columnData: [],
      showColumnData: false,
      sheetInProgress: '',
      username: fdb.db("users-db").collection("profile").find({})[0].userid,
      imagetoshow: '',
      personalityInfo: '',
      loading: false
    });
  },
  componentWillUnmount: function() {
    clearInterval(this.state.intervalId);
  },
  componentWillMount: function() {
    var localInfoList = [];

  },
  uploadFile: function(event) {
    this.setState({loading: true});
    event.preventDefault();
    var _this = this;
    var files = _this.refs.fileUpload.files;
    if (_.isEmpty(files)) {
      alert('Please select at least one file to upload.');
    } else {
      var formData = new FormData();
      formData.append('userName', this.state.username);
      _.forEach(files, function(file, index) {
        formData.append('fileUpload_' + index, file);
      });

      jQuery.ajax({
        type: "POST",
        url: "http://localhost:8084/myapp/uploadImage",
        data: formData,
        contentType: false,
        crossDomain: true,
        cors: true,
        cache: false,
        processData: false,
        success: function(res) {
          var divRes = []
          divRes = res.split("#");
          var rplcArr = [];
          divRes.forEach(function(name){
            rplcArr.push(name.replace(new RegExp(" ", "g"), " "));
          });
          _this.setState({loading: false});
          _this.setState({columnData:rplcArr, showColumnData:true});
          _this.setState({imagetoshow: document.getElementsByName("fileUpload")[0].files[0].path});
        },
        error: function(jqXHR, status) {
          _this.setState({loading: false});
          console.log(jqXHR);
        }
      });
    }
  },

  labelIt: function() {
    var files = this.refs.fileUpload.files;
    var fileNames = files[0].name;
    // _.forEach(files, function(file, index) {
    //   fileNames.push(file.name);
    // });
    // this.setState({
    //   fileName: _.isEmpty(fileNames)
    //     ? ""
    //     : JSON.stringify(fileNames)
    // });
    this.setState({
      fileName: fileNames
    });
  },

  handlePersonalityClick: function(person) {
    this.setState({loading: true, personalityInfo:""});
    var _this = this;
    console.log(person);
    var payload = {};
    payload.personName = person;
   /* $.ajax({
      type: "POST",
      url: "http://localhost:8084/myapp/getPersonalityInfo",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      success: function(res) {
        console.log(res);*/
        //_this.setState({loading: false, personalityInfo: res.data, personalityImage: "http://192.168.12.39:5000/"+person+".jpg"});
	_this.setState({loading: false, personalityInfo: "", personalityImage: "http://192.168.12.39:5000/"+person+".jpg"});
     /* },
      error: function(jqXHR, status) {
        _this.setState({loading: false});
        console.log(jqXHR);
      },
      data: JSON.stringify(payload)
    });*/
  },
  getActorImage: function(person) {
    this.setState({loading: true});
    console.log(person);
    var payload = {};
    var personName = person;
    payload.personName = person;
    var _this=this;
    $.ajax({
      type: "POST",
      url: "http://localhost:8084/myapp/getPersonalityImage",
      dataType: "json",
      contentType: "application/json; charset=utf-8",
      success: function(res) {
        console.log(res);
        _this.setState({loading: false, personalityImage: "http://192.168.12.39:5000/"+personName+".jpg"});

      },
      error: function(jqXHR, status) {
        _this.setState({loading: false, personalityImage: jqXHR.responseText});
        console.log(jqXHR);
      },
      data: JSON.stringify(payload)
    });
  },
  render: function() {
    return (
      <div>
        <MenuComponent/>
        <div id="workarea">
          <div className="pagetitle">Face Lookup</div>
          <div className="row col-md-12 conatiner">
            {/*<div className="col-sm-12 header">Upload Image here</div>*/}

            <div className="col-md-12">
              <div className="row">
                <form id="fileform">
                  <div className="row col-md-12">
                    <div className="col-lg-12 col-sm-12">
                      <div className="btn-group">
                        <label className="btn btn-primary">
                          Browse&hellip;
                          <input type="file" style={{
                            "display": "none"
                          }} name="fileUpload" ref="fileUpload" onChange={this.labelIt} multiple="multiple"/>
                        </label>
                        <button type="submit" className="btn btn-default" onClick={this.uploadFile}>Upload</button>
                      </div>
                      <label id="filename-label">&nbsp;&nbsp;{this.state.fileName}</label>
                        {this.state.loading
                          ? <div style={{"display":"inline-block"}}><LoadingComp/></div>
                          :<div></div>
                        }
                    </div>
                  </div>
                </form>
              </div>
              <div className="row col-md-2">
                {this.state.showColumnData
                  ? <div id="meta-table">
                      <label id="upload_collection_name">List of Personalities</label>
                      <ProductTable products={this.state.columnData} handlePersonalityClick ={this.handlePersonalityClick} getActorImage={this.getActorImage}/>
                      {/*<button className="btn btn-primary" onClick={this.saveCollection}>Save</button>*/}
                    </div>
                  : <div className="col-md-12" id="meta-data-area">
                    <div>Personalities List</div>
                    <i className="fa fa-5x fa-list-ul" aria-hidden="true"></i>
                  </div>
                }
              </div>
              <div className="row col-md-5">
                   <Thumbnail personalityImage = {this.state.personalityImage}/>
                   <NameEntityRel personalityInfo={this.state.personalityInfo}/>
              </div>
              <div className="row col-md-5">
                   <ImagePreview imagetoshow={this.state.imagetoshow}/>
              </div>

            </div>
            {/*<div className="col-md-4" id="file-info">
              <div id="info-box">
                <span>
                  <div className="Uploaded"></div>
                  Uploaded</span>
                <span>
                  <div className="Processing"></div>
                  Processing</span>
                <span>
                  <div className="Errored"></div>
                  Errored</span>
                <span>
                  <div className="Processed"></div>
                  Processed</span>
              </div>
              <TableComponent infoList={this.state.infoList} metaDataHandler={this.metaDataHandler}/>
            </div> */}
          </div>
        </div>
      </div>
    );
  }
});

var LoadingComp = React.createClass({
    render: function() {
      return (
        <div>
            <img src = {"load.gif"} width="50" height="50"/>
        </div>
      );
    }
});

var Thumbnail = React.createClass({
  render: function() {
    var _this= this;
    return (
      <div>
        <img src={_this.props.personalityImage} style={{"maxWidth":"100%", "maxHeight":"100%"}} alt=""/>
      </div>
    );
  }
})
;

var NameEntityRelRow = React.createClass({
  render: function() {
    return (
      <tr style={{"paddingBottom":"10px"}}>
          <td>{this.props.productName}</td>
          <td style={{"paddingLeft":"8px"}}>{this.props.productValue}</td>
      </tr>
    );
  }
});

var NameEntityRel = React.createClass({
  render: function() {
    var rows = [];
    var _this = this;
    Object.keys(this.props.personalityInfo).forEach(function(val){
      rows.push(<NameEntityRelRow productName={val} key={_this.props.personalityInfo[val].value} productValue={_this.props.personalityInfo[val].value} />);
    });
    console.log(rows);
    return (
      <table className = "table">
        <tbody>{rows}</tbody>
      </table>
    );
  }
})

var ImagePreview = React.createClass({
  render: function() {
    var _this= this;
    return (
        <div>
          <div className="col-md-12">
            <img src={_this.props.imagetoshow} style={{"marginLeft": "1px", "maxWidth":"600px", "maxHeight":"400px"}} alt=""/>
          </div>
        </div>
    );
  }
});

var ProductRow = React.createClass({
  render: function() {
    var _this = this;
    return (
      <tr>
        <td><i className="fa fa-star person-star" aria-hidden="true"></i></td>
        <td style={{"cursor":"pointer"}} onClick={_this.props.handlePersonalityClick.bind(null, _this.props.product)}> {_this.props.product} </td>
      </tr>
    );
  }
});

var ProductTable = React.createClass({
  render: function() {
    var _this = this;
    var rows = [];
    var lastCategory = null;
    this.props.products.forEach(function(product) {
      console.log(product);
      rows.push(<ProductRow product={product} key={product} handlePersonalityClick={_this.props.handlePersonalityClick} getActorImage={_this.props.getActorImage}/>);
    });
    return (
      <table>
        {/*<tbody dangerouslySetInnerHTML={{__html: rows}} /> */}
        <tbody>{rows}</tbody>
      </table>
    );
  }
});


var TableComponent = React.createClass({
  getInitialState: function() {
    return ({
      showDisplayMetaData: false, showBucket: false, filenameselcted: '', sheetData: [], username: fdb.db("users-db").collection("profile").find({})[0].userid
    });
  },
  handleDataNameClick: function(id, fileName, event) {
    console.log(id);
    var payload = {};
    var _this = this;
    payload.fileId = id;
    payload.userName = this.state.username;
    _this.setState({filenameselcted: fileName});
    jQuery.ajax({
      type: "POST",
      url: "/myapp/getSheetsOfWorkbook",
      dataType: "json",
      success: function(res) {
        console.log(res);
        _this.setState({sheetData: res});
      },
      error: function(jqXHR, status) {
        console.log(jqXHR);
      },
      data: payload
    });
  },
  handleSheetNameClick: function(id, event) {
    // get the columns from mongo
    // console.log(id)
    var payload = {};
    var _this = this;
    payload.sheetId = id;
    payload.userName = this.state.username;
    jQuery.ajax({
      type: "POST",
      url: "/myapp/getSheetMetadata",
      dataType: "json",
      success: function(res) {
        // _this.setState({
        // 	columnData : res.Columns[0]
        // });
        _this.props.metaDataHandler(res.Columns[0], id);
      },
      error: function(jqXHR, status) {
        console.log(jqXHR);
      },
      data: payload
    })
  },
  render: function() {
    //making the rows to display

    var rows = [];
    var sheetRows = [];
    var _this = this;

    if (_.isEmpty(this.props.infoList)) {
      rows.push(
        <tr key="empty-tr-file">
          <td colSpan="2" className="empty-tr">No files are available.</td>
        </tr>
      );
      sheetRows.push(
        <tr key="empty-tr-sheet">
          <td colSpan="2" className="empty-tr">No sheets are available.</td>
        </tr>
      );
    } else {
      this.props.infoList.forEach(function(person) {
        rows.push(
          <tr key={person._id}>
            <td key={person._id} onClick={_this.handleDataNameClick.bind(null, person._id, person.fileName)}>{person.fileName}</td>
            <td key={person.Status}>
              <div className={person.Status}></div>
            </td>
          </tr>
        );
      });

      if (_.isEmpty(this.state.sheetData)) {
        sheetRows.push(
          <tr key="empty-tr-sheet">
            <td colSpan="2" className="empty-tr">No sheets are available.</td>
          </tr>
        );
      } else {
        this.state.sheetData.forEach(function(person) {
          sheetRows.push(
            <tr key={person._id}>
              <td key={person._id} onClick={_this.handleSheetNameClick.bind(null, person._id)}>{person.SheetName}</td>
              <td key={person.Status}>
                <div className={person.Status}></div>
              </td>
            </tr>
          );
        });
      }
    }
    //returning the table
    return (
      <div className="table-container">
        <FileNameComp filenameselcted={this.state.filenameselcted}/>
        <table>
          <thead>
            <tr key="Head">
              <th key="FileName">FileName</th>
              <th key="Status">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
        <table>
          <thead>
            <tr key="sheetHead">
              <th key="SheetName">SheetName</th>
              <th key="Status">Status</th>
            </tr>
          </thead>
          <tbody>
            {sheetRows}
          </tbody>
        </table>
      </div>
    );
  }
});


module.exports = FaceLookupComponent;
