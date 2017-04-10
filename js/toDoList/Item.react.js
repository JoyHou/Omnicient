/**
 * Created by Joy on 4/9/17.
 */
export default class Item extends React.Component {
    constructor() {
        super();

        this.itemCompletedHandler = this.itemCompletedHandler.bind(this);
    }

    itemCompletedHandler() {
        if (this.props.item.completed === false) {
            this.setState({completed: true});
        } else {
            this.setState({completed: false});
        }
    }
    render() {
        return (
            <div className="item">
                <input type="checkbox" onClick={this.itemCompleteHandler}/>
                <p className="itemContent">{this.props.item.itemContent}</p>
            </div>
        )
    }
}