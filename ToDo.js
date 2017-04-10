/**
 * Created by Joy on 4/3/17.
 */


const ErrorCode = {
    // Server related 1 ~ 9999

    // Account 10000 ~ 19999
    ACCOUNT__ACCOUNT_ALREADY_EXISITS: 10001,
    ACCOUNT__ACCOUNT_NOT_EXISITS: 10002,
    ACCOUNT__ACCOUNT_PASSWORD_NOT_MATCH: 10003
};

class Page extends React.Component {
    constructor() {
        super();
        this.state = {
            profile: 'SignUp',
            userName: null

        };
        this.profileToggle = this.profileToggle.bind(this);
        this.afterSigned = this.afterSigned.bind(this);
        this.afterLogOut = this.afterLogOut.bind(this);
    }

    beforeRender() {
        $.ajax({
            url: 'http://omniscient.us-west-1.elasticbeanstalk.com/profile',
            dataType: 'json',
            cache: false,
            success:
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

class SignUp extends React.Component{
    constructor() {
        super();
        this.state = {
            errorCode: 0,
            userName: null,
            password: null,
            confirmPassword: true
        };

        this.signUpHandler = this.signUpHandler.bind(this);
        this.userNameHandler = this.userNameHandler.bind(this);
        this.passwordHandler = this.passwordHandler.bind(this);
        this.confirmPasswordHandler = this.confirmPasswordHandler.bind(this);
    }

    signUpHandler(e) {
        e.preventDefault();
        $.ajax({
            url: "http://omniscient.us-west-1.elasticbeanstalk.com/profile/signup",
            dataType: 'json',
            type: 'POST',
            data: {user_name: this.state.userName, password: this.state.password},
            cache: false,
            success: function(data) {
                if (data.success) {
                    this.props.afterSigned(data);
                } else {
                    this.setState({errorCode: data.error_code})
                }
            }.bind(this)
        })
    }

    userNameHandler(e) {
        this.setState({userName: e.target.value})
    }

    passwordHandler(e) {
        this.setState({password: e.target.value})
    }

    confirmPasswordHandler(e) {
        if (e.target.value !== this.state.password) {
            this.setState({confirmPassword: false});
        } if (e.target.value === this.state.password) {
            this.setState({confirmPassword: true});
        }
    }


    render() {
        let confirmPasswordMessage = "";

        if (this.state.confirmPassword === false) {
            confirmPasswordMessage = "The password you input was not the same, please check again";
        } else if (this.state.confirmPassword) {
            confirmPasswordMessage = "";
        }

        let errorMessage = "";
        if (this.state.errorCode ===ErrorCode.ACCOUNT__ACCOUNT_ALREADY_EXISITS) {
            errorMessage = "You already have an account, please sign in.";
        }


        return (
            <div className="profile col-sm-2">
                <h2>Sign Up</h2>
                <form className="form-horizontal">
                    <label className="control-label">User Name</label>
                    <input className="form-control" type="text" name="userName" onChange={this.userNameHandler}/>
                    <br/>
                    <label className="control-label">Password</label>
                    <input className="form-control" type="password" name="password" onChange={this.passwordHandler}/>
                    <br/>
                    <label className="control-label">Confirm Password</label>
                    <input className="form-control" type="password" name="confirmPassword" onChange={this.confirmPasswordHandler}/>
                    <p id="confirmPasswordMessage">{confirmPasswordMessage}</p>
                    <br/>
                    <p id="already">Already signed up? <a href="#" onClick={this.props.profileToggle}>Sign in</a></p>
                    <input type="submit" value="Sign Up" className="btn btn-success" onClick={this.signUpHandler}/>
                    <div id="errorMessage">{errorMessage}</div>
                </form>
            </div>
        )
    }
}

class SignIn extends React.Component{
    constructor() {
        super();
        this.state = {
            errorCode: 0,
            userName: null,
            password: null
        };

        this.signInHandler = this.signInHandler.bind(this);
        this.userNameHandler = this.userNameHandler.bind(this);
        this.passwordHandler = this.passwordHandler.bind(this);
    }

    signInHandler(e) {
        e.preventDefault();
        $.ajax({
            url: "http://omniscient.us-west-1.elasticbeanstalk.com/profile/signin",
            dataType: 'json',
            type: 'POST',
            data: {user_name: this.state.userName, password: this.state.password},
            cache: false,
            success: function (data) {
                if (data.success) {
                    this.props.afterSigned(data);
                } else {
                    this.setState({errorCode: data.error_code})
                }
            }.bind(this)
        })
    }


    userNameHandler(e) {
        this.setState({userName: e.target.value})
    }

    passwordHandler(e) {
        this.setState({password: e.target.value})
    }

    render() {
        let errorMessage = "";
        if (this.state.errorCode === ErrorCode.ACCOUNT__ACCOUNT_NOT_EXISITS) {
            errorMessage = "User name does not exist, please sign up."
        } else if (this.state.errorCode === ErrorCode.ACCOUNT__ACCOUNT_PASSWORD_NOT_MATCH) {
            errorMessage = "The user name and/or password were wrong, please try again."
        }
        return (
            <div className="profile col-sm-2">
                <h2>Sign In</h2>
                <form className="form-horizontal">
                    <label className="control-label">User Name</label>
                    <input className="form-control" type="text" name="userName" onChange={this.userNameHandler}/>
                    <br/>
                    <label className="control-label">Password</label>
                    <input className="form-control" type="password" name="password" onChange={this.passwordHandler}/>
                    <br/>
                    <p id="already">Don't have an account?<a href="#" onClick={this.props.profileToggle}> Sign up</a></p>
                    <input type="submit" value="Sign In" className="btn btn-success" onClick={this.signInHandler}/>
                    <div id="errorMessage">{errorMessage}</div>
                </form>
            </div>
        )
    }
}

class Profile extends React.Component {
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



class Window extends React.Component {

    render() {

        return (
            <div className="window col-sm-8">
                <CommandBox />
            </div>
        )
    }
}

class Item extends React.Component {
    constructor() {
        super();

        this.itemCompletedHandler = this.itemCompletedHandler.bind(this);
    }
    itemCompletedHandler() {
        if (this.props.item.completed === false) {
            this.setState({completed: true });
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