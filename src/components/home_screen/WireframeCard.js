import React from 'react';

class WireframeCard extends React.Component {
    deleteList = (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log("Deleting wireframe", this.props.wireframe);
    }

    render() {
        const { wireframe } = this.props;
        return (
            <div className="card z-depth-2 rounded grey lighten-4 hoverable">
                <div className="card-content grey-text text-darken-4 item_card row valign-wrapper">
                    <span className="card-title col s8">{wireframe.name}</span>
                    <a onClick={this.deleteList} className="waves-effect waves-light btn red accent-2 hoverable col s2 offset-s2">
                        <i className="material-icons">remove_circle_outline</i>
                    </a>
                </div>
            </div>
        );
    }
}
export default WireframeCard;