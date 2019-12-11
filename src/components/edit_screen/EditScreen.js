import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import Draggable from 'react-draggable'
import { getFirestore } from 'redux-firestore';

class EditScreen extends Component {
    render() {
        const auth = this.props.auth;
        let wireframe = this.props.wireframe;
        console.log(wireframe);

        if (!auth.uid)
            return <Redirect to="/" />;
        if (!wireframe)
            return <React.Fragment />

        return (
            <div className="grey lighten-3" style={{height: '600px', borderRadius: '0 0 10px 10px'}}>
                <div className="row flex" style={{height: 'inherit'}}>
                    <div className="col s2 grey z-depth-2" style={{borderRadius: '0 0 0 10px'}}>
                        This is the side bar
                    </div>
                    <div className="edit_window col s8" style={{position: 'relative'}}>
                        This is the main window
                        <Draggable bounds="parent">
                            <div style={{display: 'inline-block'}}>Edit Screen</div>
                        </Draggable>
                        <Draggable
                            axis="x"
                            bounds="parent"
                            handle=".handle"
                            defaultPosition={{ x: 0, y: 0 }}
                            position={null}
                            grid={[25, 25]}
                            scale={1}
                            onStart={this.handleStart}
                            onDrag={this.handleDrag}
                            onStop={this.handleStop}>
                            <div style={{display: 'inline-block'}}>
                                <div className="handle">Drag from here</div>
                                <div>This readme is really dragging on...</div>
                            </div>
                        </Draggable>
                        <div>{wireframe.name}</div>
                        <div>{wireframe.width}</div>
                    </div>
                    <div className="col s2 grey z-depth-2" style={{borderRadius: '0 0 10px 0'}}>
                        This is the edit bar
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