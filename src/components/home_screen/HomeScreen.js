import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { firestoreConnect } from 'react-redux-firebase';
import WireframeLinks from './WireframeLinks'
import { getFirestore } from 'redux-firestore';
import { Button, Icon } from 'react-materialize';

class HomeScreen extends Component {
    deleteWireframe = (id) => {
        console.log("Deleting something:", id);
        let firestore = getFirestore();
        firestore.collection('wireframes').doc(id).delete().then(function () {
            console.log("Document successfully deleted!");
        }).catch(function (error) {
            console.error("Error removing document: ", error);
        });
    }

    goTo = (id) => {
        console.log("Going somewhere", id);
        this.props.history.push({
            pathname: "/user/" + this.props.auth.uid + "/wireframe/" + id
        })
    }

    createNewWireframe = () => {
        console.log("Creating new wireframe", this.props.auth.uid);
        const firestore = getFirestore();
        let key = -1;
        firestore.collection("wireframes").get().then(res => key = res.size);
        let newWireframeData = {
            controls: [],
            height: 1000,
            key: key,
            name: "Unnamed Wireframe",
            ownerid: this.props.auth.uid,
            time: Date.now(),
            width: 1000
        }
        let newWireFrame = firestore.collection("wireframes").doc();
        newWireFrame.set(newWireframeData).then(() => this.goTo(newWireFrame.id));
    }

    render() {
        if (!this.props.auth.uid) {
            return <Redirect to="/login" />;
        }

        return (
            <div className="z-depth-2" style={{
                backgroundColor: "#55435f", paddingBottom: '70px', borderRadius: '0 0 10px 10px',
                backgroundImage: 'linear-gradient(to bottom, #7F5A95, #5d4969)'
            }}>
                <div className="dashboard container">
                    <div className="row">
                        <div className="col s5">
                            <WireframeLinks deleteWireframe={this.deleteWireframe} goTo={this.goTo} />
                        </div>
                        <div className="col s7">
                            <div className="banner center-align">
                                Wireframer
                            </div>
                            <div style={{ paddingTop: '15px' }} className="home_new_list_container center-align">
                                <Button onClick={this.createNewWireframe} className="red accent-2 hoverable rounded">
                                    <Icon className="right">library_add</Icon>Create a New Wireframe</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth
    };
};

export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'wireframes', orderBy: ["time", "desc"] },
    ]),
)(HomeScreen);