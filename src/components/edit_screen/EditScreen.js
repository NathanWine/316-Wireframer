import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Rnd } from 'react-rnd'
import { getFirestore } from 'redux-firestore';
import { Button, Icon } from 'react-materialize';

class EditScreen extends Component {

    state = {
        height: this.props.wireframe.height,
        width: this.props.wireframe.width,
        focus: null,
        controls: this.props.wireframe.controls,
        savable: false,
        dimensionsChangable: false,
        name: this.props.wireframe.name,
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
                savable: true
            })
        }
        else
            // CHANGE TO DISPLAY SOMETHING
            console.log("Please enter valid numbers for dimensions")
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

    goBack = () => {
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
    }

    addControl = (control) => {
        let controls = this.state.controls;
        controls.push(control);
        this.setState({controls: controls});
    }

    addContainer = () => {
        console.log("Adding a container");
        this.addControl({
            backgroundColor: '#ffffff', borderColor: "#000000", borderRadius: 5, borderThickness: 2, 
            height: 60, left: 0, top: 0, type: "container", width: 125
        })
    }

    addLabel = () => {
        console.log("Adding a label");
        this.addControl({
            backgroundColor: '#ffffff', borderColor: "#000000", borderRadius: 5, borderThickness: 0, fontSize: 12, 
            height: 30, left: 0, text: 'Prompt for Input', textColor: "#000000", top: 0, type: "label", width: 130
        });
    }

    addButton = () => {
        console.log("Adding a button");
        this.addControl({
            backgroundColor: '#d3d3d3', borderColor: "#000000", borderRadius: 5, borderThickness: 2, fontSize: 12, 
            height: 35, left: 0, text: 'Submit', textColor: "#000000", top: 0, type: "button", width: 130
        })
    }

    addTextfield = () => {
        console.log("Adding a textfield");
        this.addControl({
            backgroundColor: '#ffffff', borderColor: "#000000", borderRadius: 5, borderThickness: 2, fontSize: 12, 
            height: 30, left: 0, text: 'Input', textColor: "#808080", top: 0, type: "textfield", width: 160
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
        console.log("Controls:", controls);

        if (!auth.uid)
            return <Redirect to="/" />;
        if (!wireframe)
            return <React.Fragment />

        let i = 0;
        return (
            <div style={{ height: '755px', borderRadius: '0 0 10px 10px' }}>
                <div className="row flex" style={{ height: 'inherit' }}>
                    <div className="col s2 z-depth-2 no_padding center-align" style={{ borderRadius: '0 0 0 10px', backgroundImage: 'linear-gradient(to bottom, #955a90, #7f5a95)' }}>
                        <div className="center-align" style={{ borderWidth: '2px', borderStyle: 'solid', borderRadius: '0 0 5px 5px' }}>
                            <Button><Icon>zoom_in</Icon></Button>
                            <Button><Icon>zoom_out</Icon></Button>
                            <Button className={this.state.savable ? "" : "disabled"} onClick={this.saveWireframe} tooltip="Save wireframe" tooltipOptions={{ position: 'top' }}><Icon>save</Icon></Button>
                            <Button tooltip="Go back" tooltipOptions={{ position: 'top' }} onClick={this.goBack} className="pink accent-2"><Icon>keyboard_return</Icon></Button>
                        </div>
                        <div className="row" style={{marginBottom: '0px', marginTop: '10px'}}>
                            <div className="input-field col s10 offset-s1">
                                <input defaultValue={wireframe.name} id="name" type="text" onChange={this.changeName} />
                                <label className="active" htmlFor="name">Name</label>
                            </div>
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
                                <Button className={this.state.dimensionsChangable ? "" : "disabled"}
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
                    <div onMouseDown={this.removeFocus} className="col s8 center-align no_padding" style={{ position: 'relative', overflow: 'auto', height: 'inherit', backgroundImage: 'linear-gradient(to bottom, #808080, #484848)' }}>
                        <div className="grey lighten-3" style={{ height: this.state.height, width: this.state.width, textAlign: 'left' }}>
                            {controls && controls.map(control => (
                                focus === control ?
                                    <Rnd key={i++} bounds='parent'
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
                    <div className="col s2 z-depth-2" style={{ borderRadius: '0 0 10px 0', backgroundImage: 'linear-gradient(to bottom, #955a90, #7f5a95)' }}>
                        {this.state.focus ?
                            <div>
                                <b>Properties</b>
                                {focus.text ?
                                    <div>
                                        <b>Text: </b> {focus.text}
                                    </div>
                                    : null}
                                {focus.fontSize ?
                                    <div>
                                        <b>Font Size: </b> {focus.fontSize}
                                    </div>
                                    : null}
                                {focus.fontColor ?
                                    <div>
                                        <b>Font Color: </b> {focus.fontColor}
                                    </div>
                                    : null}
                                <div>
                                    <b>Background: </b> {focus.backgroundColor}
                                </div>
                                <div>
                                    <b>Border Color: </b> {focus.borderColor}
                                </div>
                                <div>
                                    <b>Border Thickness</b> {focus.borderThickness}
                                </div>
                                <div>
                                    <b>Border Radius: </b> {focus.borderRadius}
                                </div>
                            </div>
                            : null}
                    </div>
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

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'wireframes' },
    ]),
)(EditScreen);