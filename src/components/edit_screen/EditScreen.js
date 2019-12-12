import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import Draggable from 'react-draggable'
import { getFirestore } from 'redux-firestore';

class EditScreen extends Component {

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

    render() {
        const auth = this.props.auth;
        let wireframe = this.props.wireframe;
        console.log(wireframe);

        if (!auth.uid)
            return <Redirect to="/" />;
        if (!wireframe)
            return <React.Fragment />

        let i = 0;
        return (
            <div className="purple" style={{ height: '600px', borderRadius: '0 0 10px 10px' }}>
                <div className="row flex" style={{ height: 'inherit' }}>
                    <div className="col s2 grey z-depth-2 no_padding center-align" style={{ borderRadius: '0 0 0 10px' }}>
                        <div className="center-align" style={{ borderWidth: '2px', borderStyle: 'solid', borderRadius: '5px' }}>
                            <a className="waves-effect waves-light btn"><i className="material-icons small">zoom_in</i></a>
                            <a className="waves-effect waves-light btn"><i className="material-icons small">zoom_out</i></a>
                            <a className="waves-effect waves-light btn"><i className="material-icons small">save</i></a>
                            <a onClick={this.goBack} className="waves-effect waves-light btn pink accent-2"><i className="material-icons small">keyboard_return</i></a>
                        </div>
                        <div style={{ paddingTop: '50px' }}>
                            <div style={{
                                height: '60px', width: '125px', border: '2px solid black', 
                                borderRadius: '5px', backgroundColor: '#eee', display: 'inline-block'
                            }}></div>
                            <p><b>Container</b></p>
                        </div>
                        <div style={{ paddingTop: '50px' }}>
                            Prompt for Input:
                            <p><b>Label</b></p>
                        </div>
                        <div style={{ paddingTop: '50px' }}>
                            <button>Submit</button>
                            <p><b>Button</b></p>
                        </div>
                        <div style={{ paddingTop: '50px' }}>
                            <p><b>Textfield</b></p>
                        </div>
                    </div>
                    <div className="col s8 center-align no_padding" style={{ position: 'relative', overflow: 'auto', height: 'inherit' }}>
                        <div className="grey lighten-3" style={{ height: wireframe.height, width: wireframe.width, textAlign: 'left' }}>
                            <Draggable bounds="parent">
                                <div style={{ display: 'inline-block', position: 'absolute' }}>Edit Screen</div>
                            </Draggable>
                            {wireframe && wireframe.controls.map(control => (
                                <Draggable bounds="parent" defaultPosition={{ x: control.left, y: control.top }} key={i++}>
                                    <div style={{ display: 'inline-block', position: 'absolute' }}>{control.type}</div>
                                </Draggable>
                            ))}
                        </div>
                    </div>
                    <div className="col s2 grey z-depth-2" style={{ borderRadius: '0 0 10px 0' }}>
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