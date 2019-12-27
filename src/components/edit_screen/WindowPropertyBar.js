import React, { Component } from 'react';
import { Button, Icon, Modal } from 'react-materialize';

class WindowPropertyBar extends Component {
    addContainer = () => {
        console.log("Adding a container");
        this.props.addControl({
            backgroundColor: 'rgb(255, 255, 255, 1)', borderColor: "rgb(0, 0, 0, 1)", borderRadius: 5, borderThickness: 2,
            height: 60, left: 0, top: 0, type: "container", width: 125
        })
    }

    addLabel = () => {
        console.log("Adding a label");
        this.props.addControl({
            backgroundColor: 'rgb(255, 255, 255, 0)', borderColor: "rgb(0, 0, 0, 0)", borderRadius: 5, borderThickness: 0, fontSize: 12,
            height: 30, left: 0, text: 'Prompt for Input', textColor: "rgb(0, 0, 0, 1)", top: 0, type: "label", width: 130
        });
    }

    addButton = () => {
        console.log("Adding a button");
        this.props.addControl({
            backgroundColor: 'rgb(211, 211, 211, 1)', borderColor: "rgb(0, 0, 0, 1)", borderRadius: 5, borderThickness: 2, fontSize: 12,
            height: 35, left: 0, text: 'Submit', textColor: "rgb(0, 0, 0, 1)", top: 0, type: "button", width: 130
        })
    }

    addTextfield = () => {
        console.log("Adding a textfield");
        this.props.addControl({
            backgroundColor: 'rgb(255, 255, 255, 1)', borderColor: "rgb(0, 0, 0, 1)", borderRadius: 5, borderThickness: 2, fontSize: 12,
            height: 30, left: 0, text: 'Input', textColor: "rgb(128, 128, 128 1)", top: 0, type: "textfield", width: 160
        });
    }

    render() {
        console.log("WINDOWPROPERTYBAR")
        let wireframe = this.props.wireframe;
        console.log(wireframe);
        return (
            <div className="col s2 z-depth-2 no_padding center-align"
                style={{ borderRadius: '0 0 0 10px', backgroundImage: 'linear-gradient(to bottom, #955a90, #7f5a95)' }}>
                <div className="center-align" style={{ borderWidth: '2px', borderStyle: 'solid', borderRadius: '0 0 5px 5px' }}>
                    <Button className="green accent-3" onClick={this.props.zoomIn}><Icon>zoom_in</Icon></Button>
                    <Button className="green accent-3" onClick={this.props.zoomOut}><Icon>zoom_out</Icon></Button>
                    <Button className={this.props.savable ? "amber accent-3" : "disabled"} onClick={this.props.saveWireframe}
                        tooltip="Save wireframe" tooltipOptions={{ position: 'top' }}><Icon>save</Icon></Button>
                    {this.props.savable ? <Button tooltip="Go back" tooltipOptions={{ position: 'top' }}
                        className="pink accent-2 modal-trigger" href="#save_modal"><Icon>keyboard_return</Icon></Button>
                        : <Button tooltip="Go back" tooltipOptions={{ position: 'top' }}
                            className="pink accent-2" onClick={this.props.goBack.bind(this, false)}><Icon>keyboard_return</Icon></Button>}
                </div>
                <div className="row valign_wrapper" style={{ marginBottom: '0px', marginTop: '10px' }}>
                    <div className="input-field col s8 offset-s1">
                        <input defaultValue={wireframe.name} id="name" type="text" onChange={this.props.changeName} />
                        <label className="active" htmlFor="name">Name</label>
                    </div>
                    <div className="col s2" style={{
                        padding: '0', marginLeft: '-5px', minWidth: 'max-content',
                        backgroundColor: '#00e676', border: '1px solid black', borderRadius: '4px'
                    }}>x{this.props.zoom}</div>
                </div>
                <div className="valign-wrapper">
                    <div className="input-field col s4">
                        <input defaultValue={wireframe.width} id="width" type="text" onChange={this.props.changeWidth} />
                        <label className="active" htmlFor="width">Width</label>
                    </div>
                    <div className="input-field col s4">
                        <input defaultValue={wireframe.height} id="height" type="text" onChange={this.props.changeHeight} />
                        <label className="active" htmlFor="height">Height</label>
                    </div>
                    <div className="col s4">
                        <Button className={this.props.dimensionsChangable ? "amber accent-3" : "disabled"}
                            onClick={this.props.updateDimensions} tooltip="Update dimensions" tooltipOptions={{ position: 'top' }}>
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
        );
    }
}

export default WindowPropertyBar;