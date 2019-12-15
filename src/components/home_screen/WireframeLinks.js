import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Collection, CollectionItem, Button, Modal } from 'react-materialize';

class WireframeLinks extends React.Component {
    idToDelete = null;

    prepForDelete = (e, id) => {
        e.stopPropagation();
        this.idToDelete = id;
    }

    render() {
        const wireframes = this.props.wireframes;
        console.log(wireframes);
        return (
            <div>
                <Collection header="Recent Work">
                    {wireframes && wireframes.map(wireframe => (
                        wireframe.ownerid === this.props.auth.uid ?
                            <CollectionItem onClick={this.props.goTo.bind(this, wireframe.id)} key={wireframe.id} className="wireframe_link" style={{ fontSize: '16px', textAlign: 'left' }} >
                                {wireframe.name}
                                <i onClick={(e) => this.prepForDelete(e, wireframe.id)} className="material-icons secondary-content delete_wireframe modal-trigger" href="#del_modal">remove_circle_outline</i>
                            </CollectionItem> : null
                    ))}
                </Collection>
                <Modal id="del_modal" header="Delete Wireframe?" actions={
                    <div className="grey lighten-2">
                        <Button className="red accent-2" tooltip="The wireframe will not be retrievable." tooltipOptions={{ position: 'top' }}
                            onClick={() => this.props.deleteWireframe(this.idToDelete)} modal="close">Yes</Button><span>  </span>
                        <Button className="purple lighten-2" modal="close">No</Button>
                    </div>}>
                    <p><b>Are you sure you want to delete this wireframe?</b></p>
                </Modal>
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