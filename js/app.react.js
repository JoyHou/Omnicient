/**
 * Created by Joy on 4/3/17.
 */

import {ErrorCode} from './Constants'
import SignIn from './profile/SignIn.react'
import SignUp from './profile/SignUp.react'
import Profile from './profile/Profile.react'
import Config from './Config'
import Item from './toDoList/Item.react'
import CommandBox from './CommandBox.react'

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
        /*let Window_div = null;
        if (this.state.profile === 'SignedIn') {
            Window_div = <Window />;
        }*/
        return (
            <div className="page">
                {profilePanel}
                <Window />
            </div>
        )
    }
}

class Window extends React.Component {
    constructor() {
        super();
        this.state = {
            showCompleted: false,
            toDoList: []
        };
        this.showCompleted = this.showCompleted.bind(this);
        this.afterCreateToDo = this.afterCreateToDo.bind(this);
        this.afterDelete = this.afterDelete.bind(this);
        this.afterCompleteToggle = this.afterCompleteToggle.bind(this);
    }

    componentWillMount() {
        $.ajax({
            url: Config.endPoint + '/todo',
            dataType: 'json',
            cache: false,
            success: function (data) {
                console.log(data);
                this.setState({toDoList: data.todo_list});
            }.bind(this)
        })
    }

    showCompleted() {
        if (this.state.showCompleted) {
            this.setState({showCompleted: false})
        } else {
            this.setState({showCompleted: true})
        }
    }

    afterCreateToDo(data) {
        this.setState({toDoList: data.todo_list});
    }

    afterDelete(data) {
        this.setState({toDoList: data.todo_list});
    }

    afterCompleteToggle(data) {
        this.setState({toDoList: data.todo_list});
    }

    render() {
        let itemGroup = [];
        let toDoList = this.state.toDoList;

        for (let i = 0; i<toDoList.length; i++) {
            itemGroup.push(
                <Item
                    content={toDoList[i].content}
                    completed={toDoList[i].completed}
                    id={toDoList[i].id}
                    key={0 + toDoList[i].id}
                    afterDelete={this.afterDelete}
                    afterCompleteToggle={this.afterCompleteToggle}
                />
                )
            }

        let uncompletedItemGroup = [];
        for (let i = 0; i<toDoList.length; i++) {
            if (toDoList[i].completed === false) {
                uncompletedItemGroup.push(
                    <Item
                        content={toDoList[i].content}
                        completed={toDoList[i].completed}
                        id={toDoList[i].id}
                        key={0 + toDoList[i].id}
                        afterDelete={this.afterDelete}
                    />
                )
            }
        }

        let itemShowed = [];
        if (this.state.showCompleted) {
            itemShowed = itemGroup;
        } else {
            itemShowed = uncompletedItemGroup;
        }

        return (
            <div className="window col-sm-8">
                <CommandBox afterCreateToDo={this.afterCreateToDo}/>
                <div id="showCompleted">
                    <label>Show completed events</label>
                    <input type="checkbox" onChange={this.showCompleted} />
                </div>
                {itemShowed}
            </div>
        )
    }
}


ReactDOM.render(
    <Page />,
    document.getElementById('content')
);