/**
 * Created by Joy on 4/9/17.
 */

export default class Profile extends React.Component {
    constructor() {
        super();
        this.state = {
            logOutStatus: false
        };

        this.logOutHandler = this.logOutHandler.bind(this);
    }

    logOutHandler() {
        $.ajax({
            url: "http://omniscient.us-west-1.elasticbeanstalk.com/profile/logout",
            dataType: 'json',
            type: 'POST',
            cache: false,
            success: function (data) {
                if (data.success) {
                    this.props.afterLogOut();
                }
            }.bind(this)
        })
    }

    render() {
        let logOutMessage = null;
        if (this.state.logOutStatus) {
            logOutMessage = "You've logged out successfully!";
        } else {
            logOutMessage = <a href="#" onClick={this.logOutHandler}>log out</a>;
        }
        return (
            <div className="profile col-sm-2">
                <h2 id="userName">{this.props.userName}</h2>
                <div id="logOutMessage">{logOutMessage}</div>
            </div>
        )
    }
}

