var React = require('react');
var jQuery = require('jquery/dist/jquery.min.js');
var _ = require('lodash');

var fdb = require('../../CacheDataHandler').fdb;
var MenuComponent = require('../../MenuComponent');

require('../../../styles/uploadComp.css');

var FaceEnrollComponent = React.createClass({
	getInitialState: function() {
		return ({
			fileName: '', filenameselcted: '', username: fdb.db("users-db").collection("profile").find({})[0].userid,
			imagetoshow: '',
			loading: false
		});
	},
	readUrl: function(input) {
        var me = this;
		var reader = new FileReader();

		reader.onload = function(e) {
			// $('#blah').attr('src', e.target.result);
            me.setState({
                imagetoshow: e.target.result
            });
		}

		reader.readAsDataURL(document.getElementsByName("fileUploadEnroll")[0].files[0]);
	},
	// componentDidMount: function() {
	//     var me = this;
	// 	$("#fileUploadEnroll").change(function() {
	// 		me.readURL(this);
	// 	});
	// },
	uploadFile: function(event) {
		event.preventDefault();
		this.setState({
			imagetoshow: document.getElementsByName("fileUploadEnroll")[0].files[0].path
		});
	},
	enrollImage: function(event) {
		var _this = this;
		event.preventDefault();
		var files = _this.refs.fileUploadEnroll.files;
		var name = document.getElementById("upload_collection_name").value;
		if (_.isEmpty(files)) {
			alert('Please select at least one file to upload.');
		} else {
			var formData = new FormData();
			formData.append('name', name);
			_.forEach(files, function(file, index) {
				formData.append('fileUpload_' + index, file)
			});
			jQuery.ajax({
				type: "POST",
				url: "http://localhost:8084/myapp/enrollImage",
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
					divRes.forEach(function(name) {
						rplcArr.push(name.replace(new RegExp(" ", "g"), " "));
					});
					_this.setState({loading: false});
					_this.setState({columnData: rplcArr, showColumnData: true});
					_this.setState({
						imagetoshow: document.getElementsByName("fileUpload")[0].files[0].path
					});
				},
				error: function(jqXHR, status) {
					_this.setState({loading: false});
					console.log(jqXHR);
				}
			});
		}
	},
	labelIt: function() {
		var files = this.refs.fileUploadEnroll.files;
		var fileNames = files[0].name;
		this.setState({fileName: fileNames});
	},
	render: function() {
		return (
			<div>
				<MenuComponent/>
				<div id="workarea">
					<div className="pagetitle">Face Enroll</div>
					<div className="row col-md-12 conatiner"></div>
					<div className="row">
						<form id="fileform">
							<div className="row col-md-3">
								<div className="btn-group">
									<label className="btn btn-primary">
										Browse&hellip;
										<input type="file" style={{
											"display": "none"
										}} name="fileUploadEnroll" ref="fileUploadEnroll" id="fileUploadEnroll" onChange={this.readUrl} multiple="multiple"/>
									</label>
									<button type="submit" className="btn btn-default" onClick={this.uploadFile}>Preview</button>

								</div>
							</div>
							<div className="col-md-5">
								<input type="text" id="upload_collection_name" placeholder="Enter Name"></input>
								<button className="btn btn-primary" onClick={this.enrollImage}>Enroll</button>
							</div>
							{/*<label id="filename-label">&nbsp;&nbsp;{this.state.fileName}</label>*/}
						</form>
					</div>
					<div className="row col-md-10">
						<ImagePreview imagetoshow={this.state.imagetoshow}/>
					</div>
				</div>
			</div>

		);
	}
});

var ImagePreview = React.createClass({
	render: function() {
		var _this = this;
		return (
			<div>
				<div className="col-md-12">
					<img id="blah" src={_this.props.imagetoshow} style={{
						"marginLeft": "1px",
						"maxWidth": "600px",
						"maxHeight": "400px"
					}} alt=""/>
				</div>
			</div>
		);
	}
});

module.exports = FaceEnrollComponent;
