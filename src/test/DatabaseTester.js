import React from 'react'
import { connect } from 'react-redux';
import todoJson from './testWireframeData.json'
import { getFirestore } from 'redux-firestore';
import Draggable from 'react-draggable';
import { Rnd } from 'react-rnd';
import { Button } from 'react-materialize';

const Box = () => (
    <div style={{ height: '100%', backgroundColor: 'black'}}></div>
);

class DatabaseTester extends React.Component {

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
            // <div className="blue" style={{height: '500px', width: '500px', position: 'relative', overflow: 'auto', padding: '0'}}>
            <div className="blue">
                <Rnd
                    default={{
                        x: 150,
                        y: 205,
                        width: 500,
                        height: 190,
                    }}
                    minWidth={500}
                    minHeight={190}><Box />
                </Rnd>
                <Button tooltip="tooltip"></Button>
                <button onClick={this.handleClear}>Clear Database</button>
                <button onClick={this.handleReset}>Reset Database</button>
            </div>)
    }
}

const mapStateToProps = function (state) {
    return {
        auth: state.firebase.auth,
        wireframes: state.firebase
    };
}

export default connect(mapStateToProps)(DatabaseTester);