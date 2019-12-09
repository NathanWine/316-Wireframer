import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import WireframeCard from './WireframeCard';

class WireframeLinks extends React.Component {
    render() {
        const wireframes = this.props.wireframes;
        console.log(wireframes);
        return (
            <div className="todo-lists section">
                {wireframes && wireframes.map(wireframe => (
                    wireframe.ownerid == this.props.auth.uid ?
                    <Link to={'/user/' + wireframe.ownerid + '/wireframe/' + wireframe.id} key={wireframe.id}>
                        <WireframeCard wireframe={wireframe} />
                    </Link> : null
                ))}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        wireframes: state.firestore.ordered.wireframes,
        auth: state.firebase.auth,
    };
};

export default compose(connect(mapStateToProps))(WireframeLinks);