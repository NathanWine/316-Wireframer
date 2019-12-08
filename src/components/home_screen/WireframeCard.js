import React from 'react';

class WireframeCard extends React.Component {

    render() {
        const { wireframe } = this.props;
        return (
            <div className="card z-depth-2 rounded grey lighten-4 todo-list-link hoverable">
                <div className="card-content grey-text text-darken-4 item_card">
                    <span className="card-title">{wireframe.name}</span>
                </div>
            </div>
        );
    }
}
export default WireframeCard;