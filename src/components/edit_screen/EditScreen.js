import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import Draggable from 'react-draggable'
import { getFirestore } from 'redux-firestore';
import { Button, Icon } from 'react-materialize';

class EditScreen extends Component {

    state = {
        height: this.props.wireframe.height,
        width: this.props.wireframe.width,
        focus: null
    }

    newHeight = this.props.wireframe.height;
    newWidth = this.props.wireframe.width;

    updateDimensions = () => {
        console.log(this.newHeight, this.newWidth);
        this.setState({
            height: this.newHeight,
            width: this.newWidth
        })
    }

    changeWidth = (e) => {
        const { target } = e;
        this.newWidth = parseInt(target.value);
    }

    changeHeight = (e) => {
        const { target } = e;
        this.newHeight = parseInt(target.value);
    }

    goBack = () => {
        console.log("Going back")
        this.props.history.goBack();
    }

    componentDidMount = () => {
        if (this.props.wireframe) {
            console.log("updating timestamp");
            let firestore = getFirestore();
            firestore.collection('wireframes').doc(this.props.wireframe.id).update({
                time: Date.now()
            })
        }
    }

    focusChange = (e, control) => {
        e.stopPropagation();
        console.log("CHANGING FOCUS")
        console.log(control);
        this.setState({
            focus: control
        })
    }

    removeFocus = () => {
        console.log("REMOVING FOCUS")
        this.setState({
            focus: null
        })
    }

    render() {
        const auth = this.props.auth;
        let wireframe = this.props.wireframe;
        let focus = this.state.focus;
        console.log(wireframe);

        if (!auth.uid)
            return <Redirect to="/" />;
        if (!wireframe)
            return <React.Fragment />

        let i = 0;
        return (
            <div style={{ height: '700px', borderRadius: '0 0 10px 10px' }}>
                <div className="row flex" style={{ height: 'inherit' }}>
                    <div className="col s2 z-depth-2 no_padding center-align" style={{ borderRadius: '0 0 0 10px', backgroundColor: '#7F5A95' }}>
                        <div className="center-align" style={{ borderWidth: '2px', borderStyle: 'solid', borderRadius: '0 0 5px 5px' }}>
                            <a className="waves-effect waves-light btn"><i className="material-icons small">zoom_in</i></a>
                            <a className="waves-effect waves-light btn"><i className="material-icons small">zoom_out</i></a>
                            <a className="waves-effect waves-light btn"><i className="material-icons small">save</i></a>
                            <a onClick={this.goBack} className="waves-effect waves-light btn pink accent-2"><i className="material-icons small">keyboard_return</i></a>
                        </div>

                        <div className="valign-wrapper" style={{ paddingTop: '15px' }}>
                            <div className="input-field col s4">
                                <input defaultValue={wireframe.width} id="width" type="text" onChange={this.changeWidth} />
                                <label className="active" htmlFor="width">Width</label>
                            </div>
                            <div className="input-field col s4">
                                <input defaultValue={wireframe.height} id="height" type="text" onChange={this.changeHeight} />
                                <label className="active" htmlFor="height">Height</label>
                            </div>
                            <div className="col s4">
                                <Button onClick={this.updateDimensions} tooltip="Update dimensions" tooltipOptions={{ position: 'top' }}> <Icon>update</Icon></Button>
                            </div>
                        </div>

                        <div style={{ paddingTop: '35px' }}>
                            <div className="clickable" style={{
                                height: '60px', width: '125px', border: '2px solid black',
                                borderRadius: '5px', backgroundColor: '#eee', display: 'inline-block'
                            }}></div>
                            <p><b>Container</b></p>
                        </div>
                        <div style={{ paddingTop: '50px' }}>
                            <span className="clickable">Prompt for Input:</span>
                            <p><b>Label</b></p>
                        </div>
                        <div style={{ paddingTop: '50px' }}>
                            <button className="clickable disabled" style={{
                                border: '2px solid black', borderRadius: '5px', width: '60%',
                                height: '30px', backgroundColor: 'lightgray'
                            }}>Submit</button>
                            <p><b>Button</b></p>
                        </div>
                        <div style={{ paddingTop: '50px' }}>
                            <div className="clickable" style={{
                                height: '30px', width: '160px', border: '2px solid black', color: 'grey',
                                borderRadius: '5px', backgroundColor: '#eee', display: 'inline-block', textAlign: 'left'
                            }}>Input</div>
                            <p><b>Textfield</b></p>
                        </div>
                    </div>
                    <div onClick={this.removeFocus} className="col s8 center-align no_padding" style={{ position: 'relative', overflow: 'auto', height: 'inherit', backgroundImage: 'linear-gradient(to bottom, #808080, #484848)' }}>
                        <div className="grey lighten-3" style={{ height: this.state.height, width: this.state.width, textAlign: 'left' }}>
                            {wireframe && wireframe.controls.map(control => (
                                <Draggable bounds="parent" defaultPosition={{ x: control.left, y: control.top }} key={i++}>
                                    <div onClick={(e) => { this.focusChange(e, control) }} className="moveable" style={{ display: 'inline-block', position: 'absolute' }}>{control.type}</div>
                                </Draggable>
                            ))}
                        </div>
                    </div>
                    <div className="col s2 z-depth-2" style={{ borderRadius: '0 0 10px 0', backgroundColor: '#7F5A95' }}>
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