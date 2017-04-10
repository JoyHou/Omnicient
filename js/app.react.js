/**
 * Created by Joy on 4/3/17.
 */

import {ErrorCode} from './Constants'
import SignIn from './profile/SignIn.react'
import SignUp from './profile/SignUp.react'
import Profile from './profile/Profile.react'
import Config from './Config'
import Item from './toDoList/Item.react'

class Page extends React.Component {
    constructor() {
        super();
        this.state = {
            profile: null,
            userName: null

        };
        this.profileToggle = this.profileToggle.bind(this);
        this.afterSigned = this.afterSigned.bind(this);
        this.afterLogOut = this.afterLogOut.bind(this);
    }

    componentWillMount() {
        $.ajax({
            url: Config.endPoint + '/profile',
            dataType: 'json',
            cache: false,
            success: function(data) {
                if (data.success === false) {
                    this.setState({profile: 'SignUp'})
                } else if (data.profile.user_name) {
                    this.setState({profile: 'SignedIn', userName: data.profile.user_name})
                }
            }.bind(this)
        })
    }

    profileToggle() {
        if (this.state.profile === 'SignUp') {
            this.setState({profile: 'SignIn'})
        } else if (this.state.profile === 'SignIn') {
            this.setState({profile: 'SignUp'})
        }
    }

    afterSigned(data) {
        this.setState({
            profile: 'SignedIn',
            userName: data.profile.user_name
        });
    }

    afterLogOut() {
        this.setState({profile: 'SignIn'});
    }

    render() {
        let profilePanel = null;
        if (this.state.profile === 'SignUp') {
            profilePanel = <SignUp profileToggle={this.profileToggle} afterSigned={this.afterSigned}/>;
        } else if (this.state.profile === 'SignIn') {
            profilePanel = <SignIn profileToggle={this.profileToggle} afterSigned={this.afterSigned}/>;
        } else if (this.state.profile === 'SignedIn') {
            profilePanel = <Profile userName={this.state.userName} afterLogOut={this.afterLogOut}/>;
        }
        return (
            <div className="page">
                {profilePanel}
                <Window items={this.props.data}/>
            </div>
        )
    }
}

class Window extends React.Component {
    /*constructor() {
        super();
        this.state = {

        }
    }*/

    render() {

        return (
            <div className="window col-sm-8">
                <CommandBox />
            </div>
        )
    }
}

class CommandBox extends React.Component {


    render() {
        return (
            <div className="commandBox">
                <input type="text" onChange={() => {}}/>
            </div>
        )
    }
}

ReactDOM.render(
    <Page />,
    document.getElementById('content')
);