/**
 * Created by Joy on 4/3/17.
 */


var items = [
    {completed: false, itemContent: "buy eggs"},
    {completed: false, itemContent: "assignment due 11th"}
];
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
            profile: 'SignUp'

        };
        this.profileToggle = this.profileToggle.bind(this);
    }

    profileToggle() {
        if (this.state.profile === 'SignUp') {
            this.setState({profile: 'SignIn'})
        } else {
            this.setState({profile: 'SignUp'})
        }
    }

    render() {
        const profilePanel = this.state.profile === 'SignUp'
            ? <SignUp profileToggle={this.profileToggle}/>
            : <SignIn profileToggle={this.profileToggle}/>;
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
            signUpMessage: null,
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
            url: "http://omniscient.us-west-1.elasticbeanstalk.com/signup",
            dataType: 'json',
            type: 'POST',
            data: {user_name: this.state.userName, password: this.state.password},
            cache: false,
            success: function(data) {
                if (data.success) {
                    this.setState({signUpMessage: "You've signed up successfully!"})
                } else {
                    if (data.error_code === ErrorCode.ACCOUNT__ACCOUNT_ALREADY_EXISITS) {
                        this.setState({signUpMessage: "You already have an account, please log in."})
                    } else if (data.error_code === ErrorCode.ACCOUNT__ACCOUNT_PASSWORD_NOT_MATCH) {
                        this.setState({signUpMessage: "User name and/or password were wrong, please try again."})
                    }
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
                    <div id="errorMessage">{this.state.signUpMessage}</div>
                </form>
            </div>
        )
    }
}

class SignIn extends React.Component{
    render() {
        return (
            <div className="profile col-sm-2">
                <h2>Sign In</h2>
                <form className="form-horizontal">
                    <label className="control-label">User Name</label>
                    <input className="form-control" type="text" name="userName"/>
                    <br/>
                    <label className="control-label">Password</label>
                    <input className="form-control" type="password" name="password"/>
                    <br/>
                    <p id="already">Don't have an account?<a href="#" onClick={this.props.profileToggle}> Sign up</a></p>
                    <input type="submit" value="Sign In" className="btn btn-success"/>
                </form>
            </div>
        )
    }
}

class Window extends React.Component {

    render() {
        let itemNumber = this.props.items.length;

        let renderItems = [];
        for (let i = 0; i < itemNumber; i++) {
            renderItems.push(<Item item={this.props.items[i]} key={i}/>);
        }

        return (
            <div className="window col-sm-8">
                <CommandBox />
                {renderItems}
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
    <Page data={items}/>,
    document.getElementById('content')
);