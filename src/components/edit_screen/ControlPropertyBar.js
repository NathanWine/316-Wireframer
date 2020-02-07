import React, { Component } from 'react';
import { Button, Checkbox } from 'react-materialize';
import { ChromePicker } from 'react-color';

class ControlPropertyBar extends Component {
    state = {
        displayFontPicker: false,
        displayBackgroundPicker: false,
        displayBorderPicker: false,
    }

    render() {
        let focus = this.props.focus;
        this.bold = focus.fontWeight === "bold" ? true : false;
        this.italic = focus.fontStyle === "italic" ? true : false;
        this.underline = focus.textDecoration === "underline" ? true : false;
        // TODO: Change the stlying of the checkboxes so they are at least vertically aligned

        return (
            <div className="col s2 z-depth-2 control_property_bar"
                style={{
                    borderRadius: '0 0 10px 0', backgroundImage: 'linear-gradient(to bottom, #955a90, #7f5a95)',
                    height: '755px', overflow: 'auto'
                }}>
                <div style={{ paddingBottom: '20px', fontSize: '17px' }}><b>Properties</b></div>
                {focus.text !== undefined ?
                    <div className="row" style={{ marginBottom: '0px' }}>
                        <div className="input-field col s10 offset-s1">
                            <input value={focus.text} id="text" type="text"
                                onChange={(e) => this.props.modifyControl("text", e.target.value)} />
                            <label className="active" htmlFor="text">Text</label>
                        </div>
                    </div>
                    : null}
                {focus.fontSize ?
                    <div className="row valign-wrapper" style={{ marginBottom: '0px' }}>
                        <b className="col s8">Font Size:</b>
                        <div className="input-field col s4">
                            <input value={focus.fontSize} id="fontSize" type="number"
                                onChange={(e) => {
                                    if (e.target.value && !isNaN(e.target.value)) {
                                        this.props.modifyControl("fontSize", parseInt(e.target.value));
                                    }
                                }} />
                        </div>
                    </div>
                    : null}
                {focus.fontWeight ? <div>Bold
                    <Checkbox checked={this.bold} filledIn label="" value="bold" onChange={(e) => {
                        this.bold = !this.bold;
                        if (this.bold)
                            this.props.modifyControl("fontWeight", "bold");
                        else
                            this.props.modifyControl("fontWeight", "normal");
                    }} />
                </div> : null}
                {focus.fontStyle ? <div>Italic
                    <Checkbox checked={this.italic} filledIn label="" value="italic" onChange={(e) => {
                        this.italic = !this.italic;
                        if (this.italic)
                            this.props.modifyControl("fontStyle", "italic");
                        else
                            this.props.modifyControl("fontStyle", "normal");
                    }} />
                     </div> : null}
                {focus.textDecoration ? <div>Underline
                    <Checkbox checked={this.underline} filledIn label="" value="underline" onChange={(e) => {
                        this.underline = !this.underline;
                        if (this.underline)
                            this.props.modifyControl("textDecoration", "underline");
                        else
                            this.props.modifyControl("textDecoration", "normal");
                    }} />
                </div> : null}
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
                                    this.props.modifyControl('textColor', newColor);
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
                                this.props.modifyControl('backgroundColor', newColor);
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
                                this.props.modifyControl('borderColor', newColor);
                            }}
                        />
                    </div> : null} <span className="col s1"></span>
                </div>
                <div className="row valign-wrapper" style={{ marginBottom: '0' }}>
                    <b className="col s8">Border Thickness:</b>
                    <div className="input-field col s4">
                        <input value={focus.borderThickness} id="borderThickness" type="number"
                            onChange={(e) => {
                                if (e.target.value && !isNaN(e.target.value)) {
                                    this.props.modifyControl("borderThickness", parseInt(e.target.value));
                                }
                            }} />
                    </div>
                </div>
                <div className="row valign-wrapper">
                    <b className="col s8">Border Radius:</b>
                    <div className="input-field col s4">
                        <input value={focus.borderRadius} id="borderRadius" type="number"
                            onChange={(e) => {
                                if (e.target.value && !isNaN(e.target.value)) {
                                    this.props.modifyControl("borderRadius", parseInt(e.target.value));
                                }
                            }} />
                    </div>
                </div>
                <div className="row">
                    <Button className="amber black-text accent-2 col s10 offset-s1" onClick={this.props.removeFocus}>Deselect control</Button>
                    <Button className="green black-text accent-2 col s10 offset-s1" onClick={this.props.duplicateControl}
                        style={{ marginTop: '10px' }} >Duplicate control</Button>
                    <Button className="pink black-text accent-2 col s10 offset-s1" onClick={this.props.deleteControl}
                        style={{ marginTop: '10px' }} >Delete control</Button>
                </div>
            </div>
        );
    }
}

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

export default ControlPropertyBar;