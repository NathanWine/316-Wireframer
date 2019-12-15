import React from 'react'
import { connect } from 'react-redux';
import todoJson from './testWireframeData.json'
import { getFirestore } from 'redux-firestore';
import { ChromePicker } from 'react-color'

class DatabaseTester extends React.Component {
    state = {
        displayColorPicker: false,
    };

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    // NOTE, BY KEEPING THE DATABASE PUBLIC YOU CAN
    // DO THIS ANY TIME YOU LIKE WITHOUT HAVING
    // TO LOG IN
    handleClear = () => {
        const fireStore = getFirestore();
        fireStore.collection('wireframes').get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                console.log("deleting " + doc.id);
                fireStore.collection('wireframes').doc(doc.id).delete();
            })
        });
    }

    handleReset = () => {
        const fireStore = getFirestore();
        todoJson.wireframes.forEach(wireframeJson => {
            fireStore.collection('wireframes').add({
                ownerid: wireframeJson.ownerid,
                name: wireframeJson.name,
                width: wireframeJson.width,
                height: wireframeJson.height,
                key: wireframeJson.key,
                time: Date.now(),
                controls: wireframeJson.controls
            }).then(() => {
                console.log("DATABASE RESET");
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    render() {
        let firestore = getFirestore();
        let history = this.props.history;
        firestore.collection('users').doc(this.props.auth.uid).get().then(function (doc) {
            if (doc.exists) {
                if (!doc.data().admin) {
                    console.log("not admin, returning")
                    history.goBack();
                }
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });

        return (
            <div className="blue">
                <button onClick={this.handleClick}>Pick Color</button>
                {this.state.displayColorPicker ? <div style={popover}>
                    <div style={cover} onClick={this.handleClose} />
                    <ChromePicker />
                </div> : null}
                <button onClick={this.handleClear}>Clear Database</button>
                <button onClick={this.handleReset}>Reset Database</button>
            </div>)
    }
}

const popover = {
    position: 'absolute',
    zIndex: '2',
}
const cover = {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
}

const mapStateToProps = function (state) {
    return {
        auth: state.firebase.auth,
        wireframes: state.firebase
    };
}

export default connect(mapStateToProps)(DatabaseTester);