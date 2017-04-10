import {ErrorCode} from '../Constants'
import Config from '../Config'

export default class SignIn extends React.Component{
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
            url: Config.endPoint + '/profile/signin',
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