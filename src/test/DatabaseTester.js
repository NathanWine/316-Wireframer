import React from 'react'
import { connect } from 'react-redux';
import todoJson from './testWireframeData.json'
import { getFirestore } from 'redux-firestore';

class DatabaseTester extends React.Component {

    // NOTE, BY KEEPING THE DATABASE PUBLIC YOU CAN
    // DO THIS ANY TIME YOU LIKE WITHOUT HAVING
    // TO LOG IN
    handleClear = () => {
        const fireStore = getFirestore();
        fireStore.collection('wireframes').get().then(function(querySnapshot){
            querySnapshot.forEach(function(doc) {
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
        return (
            <div>
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