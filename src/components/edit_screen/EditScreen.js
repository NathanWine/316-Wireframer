import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { Rnd } from 'react-rnd'
import { getFirestore } from 'redux-firestore';
import { Button, Modal } from 'react-materialize';
import PropertyBar from './ControlPropertyBar';
import WindowPropertyBar from './WindowPropertyBar';

class EditScreen extends Component {

    state = {
        focus: null,
        savable: false,
        dimensionsChangable: false,
        zoom: 1,
    }

    UNSAFE_componentWillReceiveProps = (newProps) => {
        this.setState({
            height: newProps.wireframe.height,
            width: newProps.wireframe.width,
            controls: newProps.wireframe.controls,
            name: newProps.wireframe.name
        });
        this.newHeight = newProps.wireframe.height;
        this.newWidth = newProps.wireframe.width;
        this.newName = newProps.wireframe.name;
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
            alert("Dimension values must be numbers between 1 and 5,000");
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
        console.log("Focus", focus, this.state.focus);

        if (!auth.uid)
            return <Redirect to="/" />;
        if (!wireframe)
            return <React.Fragment />

        let i = 0;
        return (
            <div style={{ height: '755px', borderRadius: '0 0 10px 10px' }}>
                <div className="row flex" style={{ height: 'inherit' }}>
                    <WindowPropertyBar addControl={this.addControl} zoomIn={() => this.setState({ zoom: this.state.zoom * 2 })}
                        zoomOut={() => this.setState({ zoom: this.state.zoom / 2 })} savable={this.state.savable}
                        dimensionsChangable={this.state.dimensionsChangable} saveWireframe={this.saveWireframe}
                        goBack={this.goBack} changeName={this.changeName} zoom={this.state.zoom} changeWidth={this.changeWidth}
                        changeHeight={this.changeHeight} updateDimensions={this.updateDimensions} wireframe={wireframe} />
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
                    <PropertyBar modifyControl={this.modifyControl} focus={focus} />
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

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'wireframes' },
    ]),
)(EditScreen);