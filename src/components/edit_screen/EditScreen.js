import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Rnd } from 'react-rnd'
import { getFirestore } from 'redux-firestore';
import { Button, Icon, Modal } from 'react-materialize';
import { ChromePicker } from 'react-color'

class EditScreen extends Component {

    state = {
        height: this.props.wireframe.height,
        width: this.props.wireframe.width,
        focus: null,
        controls: this.props.wireframe.controls,
        savable: false,
        dimensionsChangable: false,
        name: this.props.wireframe.name,
        displayFontPicker: false,
        displayBackgroundPicker: false,
        displayBorderPicker: false,
        zoom: 1,
    }

    newHeight = this.props.wireframe.height;
    newWidth = this.props.wireframe.width;
    newName = this.props.wireframe.name;

    updateDimensions = () => {
        console.log(this.newHeight, this.newWidth);
        if (!isNaN(this.newHeight) && !isNaN(this.newWidth) && this.newHeight >= 1
            && this.newHeight <= 5000 && this.newWidth >= 1 && this.newWidth <= 5000) {
            this.setState({
                height: this.newHeight,
                width: this.newWidth,
                savable: true,
                dimensionsChangable: false,
            })
        }
        else
            alert("Dimensions must be numbers between 1 and 5000");
    }

    changeWidth = (e) => {
        const { target } = e;
        if (this.state.width !== parseInt(target.value)) {
            this.setState({
                dimensionsChangable: true
            });
        }
        else if (this.newHeight === this.state.height) {
            this.setState({
                dimensionsChangable: false
            });
        }
        this.newWidth = parseInt(target.value);
    }

    changeHeight = (e) => {
        const { target } = e;
        if (this.state.height !== parseInt(target.value)) {
            this.setState({
                dimensionsChangable: true
            });
        }
        else if (this.newWidth === this.state.width) {
            this.setState({
                dimensionsChangable: false
            });
        }
        this.newHeight = parseInt(target.value);
    }

    changeName = (e) => {
        const { target } = e;
        console.log(target.value, this.state.name)
        this.newName = target.value;
        if (target.value !== this.state.name && !this.state.savable) {
            this.setState({
                savable: true
            });
        }
        else if (target.value === this.state.name && this.state.savable) {
            this.setState({
                savable: false
            })
        }
    }

    goBack = (save) => {
        if (save)
            this.saveWireframe();
        this.props.history.goBack();
    }

    saveWireframe = () => {
        this.setState({
            savable: false
        });
        let firestore = getFirestore();
        firestore.collection("wireframes").doc(this.props.wireframe.id).update({
            height: this.state.height,
            width: this.state.width,
            controls: this.state.controls,
            name: this.newName,
        });
    }

    componentDidMount = () => {
        if (this.props.wireframe) {
            let firestore = getFirestore();
            firestore.collection('wireframes').doc(this.props.wireframe.id).update({
                time: Date.now()
            })
        }

        window.addEventListener("keydown", this.handleKeyDown);
    }

    componentWillUnmount = () => {
        window.removeEventListener("keydown", this.handleKeyDown);
    }

    handleKeyDown = (e) => {
        if (e.ctrlKey) {
            if (e.keyCode === 68) {
                e.preventDefault();
                this.duplicateControl();
            }
        }
        else if (e.keyCode === 46) {
            this.deleteControl();
        }
    }

    duplicateControl = () => {
        console.log("DUPLICATING CONTROL")
        if (this.state.focus) {
            console.log("Duplicating:", this.state.focus);
            let control = JSON.parse(JSON.stringify(this.state.focus));
            control.left += 100;
            control.top += 100;
            this.addControl(control);
        }
    }

    deleteControl = () => {
        console.log("DELETING CONTROL");
        if (this.state.focus) {
            console.log("Deleting:", this.state.focus);
            let controls = this.state.controls;
            controls.splice(controls.indexOf(this.state.focus), 1);
            console.log(controls);
            this.setState({
                controls: controls,
                focus: null,
                savable: true,
            });
        }
    }

    addControl = (control) => {
        let controls = this.state.controls;
        controls.push(control);
        this.setState({
            controls: controls,
            focus: control,
            savable: true,
        });
    }

    addContainer = () => {
        console.log("Adding a container");
        this.addControl({
            backgroundColor: 'rgb(255, 255, 255, 1)', borderColor: "rgb(0, 0, 0, 1)", borderRadius: 5, borderThickness: 2,
            height: 60, left: 0, top: 0, type: "container", width: 125
        })
    }

    addLabel = () => {
        console.log("Adding a label");
        this.addControl({
            backgroundColor: 'rgb(255, 255, 255, 0)', borderColor: "rgb(0, 0, 0, 0)", borderRadius: 5, borderThickness: 0, fontSize: 12,
            height: 30, left: 0, text: 'Prompt for Input', textColor: "rgb(0, 0, 0, 1)", top: 0, type: "label", width: 130
        });
    }

    addButton = () => {
        console.log("Adding a button");
        this.addControl({
            backgroundColor: 'rgb(211, 211, 211, 1)', borderColor: "rgb(0, 0, 0, 1)", borderRadius: 5, borderThickness: 2, fontSize: 12,
            height: 35, left: 0, text: 'Submit', textColor: "rgb(0, 0, 0, 1)", top: 0, type: "button", width: 130
        })
    }

    addTextfield = () => {
        console.log("Adding a textfield");
        this.addControl({
            backgroundColor: 'rgb(255, 255, 255, 1)', borderColor: "rgb(0, 0, 0, 1)", borderRadius: 5, borderThickness: 2, fontSize: 12,
            height: 30, left: 0, text: 'Input', textColor: "rgb(128, 128, 128 1)", top: 0, type: "textfield", width: 160
        });
    }

    modifyControl = (property, value) => {
        console.log("Changing", property, "to", value);
        let controls = this.state.controls;
        controls.forEach(ctrl => {
            if (ctrl === this.state.focus) {
                ctrl[property] = value;
            }
        });
        this.setState({
            controls: controls,
            savable: true,
        });
    }

    focusChange = (e, control) => {
        e.stopPropagation();
        console.log("CHANGING FOCUS", control)
        this.setState({
            focus: control
        });
    }

    removeFocus = () => {
        console.log("REMOVING FOCUS")
        this.setState({
            focus: null
        })
    }

    onDragStart = (e) => {
        e.stopPropagation();
    }

    onDragStop = (e, data) => {
        e.stopPropagation();
        e.preventDefault();
        let controls = this.state.controls;
        controls.forEach(ctrl => {
            if (ctrl === this.state.focus) {
                ctrl.top = parseInt(data.y);
                ctrl.left = parseInt(data.x);
            }
        });
        this.setState({
            controls: controls,
            savable: true,
        });
    }

    onResizeStop = (e, dir, refToElement, delta, position) => {
        let controls = this.state.controls;
        controls.forEach(ctrl => {
            if (ctrl === this.state.focus) {
                ctrl.left = parseInt(position.x);
                ctrl.top = parseInt(position.y);
                ctrl.width += delta.width;
                ctrl.height += delta.height;
            }
        })
        this.setState({
            controls: controls,
            savable: true,
        });
    }

    render() {
        const auth = this.props.auth;
        let wireframe = this.props.wireframe;
        let focus = this.state.focus;
        let controls = this.state.controls;
        let scale = "scale(" + this.state.zoom + ")";
        console.log("Controls:", controls);

        if (!auth.uid)
            return <Redirect to="/" />;
        if (!wireframe)
            return <React.Fragment />

        let i = 0;
        return (
            <div style={{ height: '755px', borderRadius: '0 0 10px 10px' }}>
                <div className="row flex" style={{ height: 'inherit' }}>
                    <div className="col s2 z-depth-2 no_padding center-align"
                        style={{ borderRadius: '0 0 0 10px', backgroundImage: 'linear-gradient(to bottom, #955a90, #7f5a95)' }}>
                        <div className="center-align" style={{ borderWidth: '2px', borderStyle: 'solid', borderRadius: '0 0 5px 5px' }}>
                            <Button className="green accent-3" onClick={() => this.setState({ zoom: this.state.zoom * 2 })}><Icon>zoom_in</Icon></Button>
                            <Button className="green accent-3" onClick={() => this.setState({ zoom: this.state.zoom / 2 })}><Icon>zoom_out</Icon></Button>
                            <Button className={this.state.savable ? "amber accent-3" : "disabled"} onClick={this.saveWireframe}
                                tooltip="Save wireframe" tooltipOptions={{ position: 'top' }}><Icon>save</Icon></Button>
                            {this.state.savable ? <Button tooltip="Go back" tooltipOptions={{ position: 'top' }}
                                className="pink accent-2 modal-trigger" href="#save_modal"><Icon>keyboard_return</Icon></Button>
                                : <Button tooltip="Go back" tooltipOptions={{ position: 'top' }}
                                    className="pink accent-2" onClick={() => this.goBack(false)}><Icon>keyboard_return</Icon></Button>}
                        </div>
                        <div className="row valign_wrapper" style={{ marginBottom: '0px', marginTop: '10px' }}>
                            <div className="input-field col s8 offset-s1">
                                <input defaultValue={wireframe.name} id="name" type="text" onChange={this.changeName} />
                                <label className="active" htmlFor="name">Name</label>
                            </div>
                            <div className="col s2" style={{
                                padding: '0', marginLeft: '-5px', minWidth: 'max-content',
                                backgroundColor: '#00e676', border: '1px solid black', borderRadius: '4px'
                            }}>x{this.state.zoom}</div>
                        </div>
                        <div className="valign-wrapper">
                            <div className="input-field col s4">
                                <input defaultValue={wireframe.width} id="width" type="text" onChange={this.changeWidth} />
                                <label className="active" htmlFor="width">Width</label>
                            </div>
                            <div className="input-field col s4">
                                <input defaultValue={wireframe.height} id="height" type="text" onChange={this.changeHeight} />
                                <label className="active" htmlFor="height">Height</label>
                            </div>
                            <div className="col s4">
                                <Button className={this.state.dimensionsChangable ? "amber accent-3" : "disabled"}
                                    onClick={this.updateDimensions} tooltip="Update dimensions" tooltipOptions={{ position: 'top' }}>
                                    <Icon>update</Icon>
                                </Button>
                            </div>
                        </div>

                        <div style={{ paddingTop: '15px' }}>
                            <div onClick={this.addContainer} className="clickable" style={{
                                height: '60px', width: '125px', border: '2px solid black',
                                borderRadius: '5px', backgroundColor: '#eee', display: 'inline-block'
                            }}></div>
                            <p><b>Container</b></p>
                        </div>
                        <div style={{ paddingTop: '35px' }}>
                            <span onClick={this.addLabel} className="clickable">Prompt for Input:</span>
                            <p><b>Label</b></p>
                        </div>
                        <div style={{ paddingTop: '35px' }}>
                            <button onClick={this.addButton} className="clickable" style={{
                                border: '2px solid black', borderRadius: '5px', width: '50%',
                                height: '30px', backgroundColor: 'lightgray'
                            }}>Submit</button>
                            <p><b>Button</b></p>
                        </div>
                        <div style={{ paddingTop: '35px' }}>
                            <div onClick={this.addTextfield} className="clickable" style={{
                                height: '30px', width: '160px', border: '2px solid black', color: 'grey',
                                borderRadius: '5px', backgroundColor: '#eee', display: 'inline-block', textAlign: 'left'
                            }}>Input</div>
                            <p><b>Textfield</b></p>
                        </div>
                    </div>
                    <div onMouseDown={this.removeFocus} className="col s8 center-align no_padding"
                        style={{ position: 'relative', overflow: 'auto', height: 'inherit', backgroundImage: 'linear-gradient(to bottom, #808080, #484848)' }}>
                        <div className="grey lighten-3" style={{ height: this.state.height, width: this.state.width, textAlign: 'left', transform: scale, transformOrigin: '0 0' }}>
                            {controls && controls.map(control => (
                                focus === control ?
                                    <Rnd key={i++} bounds='parent' scale={this.state.zoom}
                                        resizeHandleClasses={{
                                            bottomLeft: "handle",
                                            bottomRight: "handle",
                                            topLeft: "handle",
                                            topRight: "handle"
                                        }}
                                        default={{
                                            x: control.left,
                                            y: control.top,
                                            width: control.width,
                                            height: control.height,
                                        }}
                                        enableResizing={{
                                            top: false, right: false, bottom: false, left: false,
                                            topRight: true, bottomRight: true, bottomLeft: true, topLeft: true
                                        }}
                                        onDragStop={this.onDragStop} onDragStart={this.onDragStart}
                                        onResizeStart={this.onResizeStart} onResizeStop={this.onResizeStop} >
                                        <div key={i++} className="moveable"
                                            style={{
                                                display: 'inline-block', position: 'absolute', overflow: 'hidden', width: '100%',
                                                height: '100%', fontSize: control.fontSize, color: control.textColor,
                                                backgroundColor: control.backgroundColor, borderColor: control.borderColor,
                                                borderWidth: control.borderThickness, borderRadius: control.borderRadius, borderStyle: 'solid'
                                            }}>{control.text}</div>
                                    </Rnd>
                                    : <div key={i++} onMouseDown={(e) => { this.focusChange(e, control) }} className="moveable"
                                        style={{
                                            display: 'inline-block', position: 'absolute', overflow: 'hidden', top: control.top,
                                            left: control.left, width: control.width, height: control.height, fontSize: control.fontSize,
                                            color: control.textColor, backgroundColor: control.backgroundColor, borderColor: control.borderColor,
                                            borderWidth: control.borderThickness, borderRadius: control.borderRadius, borderStyle: 'solid'
                                        }}>{control.text}</div>
                            ))}
                        </div>
                    </div>
                    <div className="col s2 z-depth-2"
                        style={{ borderRadius: '0 0 10px 0', backgroundImage: 'linear-gradient(to bottom, #955a90, #7f5a95)' }}>
                        {this.state.focus ?
                            <div>
                                <div style={{ paddingBottom: '20px', fontSize: '17px' }}><b>Properties</b></div>
                                {focus.text ?
                                    <div className="row" style={{ marginBottom: '0px' }}>
                                        <div className="input-field col s10 offset-s1">
                                            <input defaultValue={focus.text} id="text" type="text"
                                                onChange={(e) => this.modifyControl("text", e.target.value)} />
                                            <label className="active" htmlFor="text">Text</label>
                                        </div>
                                    </div>
                                    : null}
                                {focus.fontSize ?
                                    <div className="row valign-wrapper" style={{ marginBottom: '0px' }}>
                                        <b className="col s8">Font Size:</b>
                                        <div className="input-field col s4">
                                            <input defaultValue={focus.fontSize} id="fontSize" type="number"
                                                onChange={(e) => {
                                                    if (e.target.value && !isNaN(e.target.value)) {
                                                        this.modifyControl("fontSize", parseInt(e.target.value));
                                                    }
                                                }} />
                                        </div>
                                    </div>
                                    : null}
                                {focus.textColor ?
                                    <div className="row valign-wrapper" style={{ paddingBottom: '10px' }}>
                                        <b className="col s9">Font Color:</b> {focus.fontColor}
                                        <Button className="col s2" style={{ backgroundColor: focus.textColor, borderRadius: '15px' }}
                                            onClick={() => this.setState({ displayFontPicker: !this.state.displayFontPicker })}></Button>
                                        {this.state.displayFontPicker ? <div style={popover}>
                                            <div style={cover} onClick={() => this.setState({ displayFontPicker: false })} />
                                            <ChromePicker color={focus.textColor}
                                                onChangeComplete={(color, e) => {
                                                    let newColor = "rgb(" + color.rgb.r + ", " + color.rgb.g + ", " + color.rgb.b + ", " + color.rgb.a + ")";
                                                    this.modifyControl('textColor', newColor);
                                                }}
                                            />
                                        </div> : null} <span className="col s1"></span>
                                    </div>
                                    : null}
                                <div className="row valign-wrapper" style={{ paddingBottom: '10px' }}>
                                    <b className="col s9">Background:</b>
                                    <Button className="col s2" style={{ backgroundColor: focus.backgroundColor, borderRadius: '15px' }}
                                        onClick={() => this.setState({ displayBackgroundPicker: !this.state.displayBackgroundPicker })}></Button>
                                    {this.state.displayBackgroundPicker ? <div style={popover}>
                                        <div style={cover} onClick={() => this.setState({ displayBackgroundPicker: false })} />
                                        <ChromePicker color={focus.backgroundColor}
                                            onChangeComplete={(color, e) => {
                                                let newColor = "rgb(" + color.rgb.r + ", " + color.rgb.g + ", " + color.rgb.b + ", " + color.rgb.a + ")";
                                                this.modifyControl('backgroundColor', newColor);
                                            }}
                                        />
                                    </div> : null} <span className="col s1"></span>
                                </div>
                                <div className="row valign-wrapper">
                                    <b className="col s9">Border Color:</b>
                                    <Button className="col s2" style={{ backgroundColor: focus.borderColor, borderRadius: '15px' }}
                                        onClick={() => this.setState({ displayBorderPicker: !this.state.displayBorderPicker })}></Button>
                                    {this.state.displayBorderPicker ? <div style={popover}>
                                        <div style={cover} onClick={() => this.setState({ displayBorderPicker: false })} />
                                        <ChromePicker color={focus.borderColor}
                                            onChangeComplete={(color, e) => {
                                                let newColor = "rgb(" + color.rgb.r + ", " + color.rgb.g + ", " + color.rgb.b + ", " + color.rgb.a + ")";
                                                this.modifyControl('borderColor', newColor);
                                            }}
                                        />
                                    </div> : null} <span className="col s1"></span>
                                </div>
                                <div className="row valign-wrapper" style={{ marginBottom: '0' }}>
                                    <b className="col s8">Border Thickness:</b>
                                    <div className="input-field col s4">
                                        <input defaultValue={focus.borderThickness} id="borderThickness" type="number"
                                            onChange={(e) => {
                                                if (e.target.value && !isNaN(e.target.value)) {
                                                    this.modifyControl("borderThickness", parseInt(e.target.value));
                                                }
                                            }} />
                                    </div>
                                </div>
                                <div className="row valign-wrapper">
                                    <b className="col s8">Border Radius:</b>
                                    <div className="input-field col s4">
                                        <input defaultValue={focus.borderRadius} id="borderRadius" type="number"
                                            onChange={(e) => {
                                                if (e.target.value && !isNaN(e.target.value)) {
                                                    this.modifyControl("borderRadius", parseInt(e.target.value));
                                                }
                                            }} />
                                    </div>
                                </div>
                                <div className="row">
                                    <Button className="amber black-text accent-2 col s10 offset-s1" onClick={this.removeFocus}>Deselect control</Button>
                                    <Button className="green black-text accent-2 col s10 offset-s1" onClick={this.duplicateControl}
                                        style={{ marginTop: '10px' }} >Duplicate control</Button>
                                    <Button className="pink black-text accent-2 col s10 offset-s1" onClick={this.deleteControl}
                                        style={{ marginTop: '10px' }} >Delete control</Button>
                                </div>
                            </div>
                            : null}
                    </div>
                    <Modal id="save_modal" header="Save Wireframe?" actions={
                        <div className="grey lighten-2">
                            <Button className="red accent-2" onClick={() => this.goBack(true)} modal="close">Yes</Button><span>  </span>
                            <Button className="purple lighten-2" onClick={() => this.goBack(false)}>No</Button><span>  </span>
                            <Button className="green accent-2" modal="close">Cancel</Button>
                        </div>}>
                        <p><b>Would you like to save changes before returning to the home screen?</b></p>
                    </Modal>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state, ownProps) => {
    const { wireframeid } = ownProps.match.params;
    const { wireframes } = state.firestore.data;
    const wireframe = wireframes ? wireframes[wireframeid] : null;

    if (wireframe)
        wireframe.id = wireframeid;

    return {
        wireframe,
        auth: state.firebase.auth,
    };
};

const popover = {
    position: 'absolute',
    zIndex: '1000',
}
const cover = {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
}

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'wireframes' },
    ]),
)(EditScreen);