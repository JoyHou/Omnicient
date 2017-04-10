import {ErrorCode} from '../Constants'
import Config from '../Config'

export default class SignUp extends React.Component{
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
            url: Config.endPoint + '/profile/signup',
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
