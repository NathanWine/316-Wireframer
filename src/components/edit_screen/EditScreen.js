import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
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
            <div>
                <div>Edit Screen</div>
                <div>{wireframe.name}</div>
                <div>{wireframe.width}</div>
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