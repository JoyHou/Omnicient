/**
 * Created by Joy on 4/14/17.
 */

import React from 'react';
import Config from'./Config';
import $ from 'jquery'
import './main.css'

export default class CommandBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toDoContent: null
        };
        this.createToDo = this.createToDo.bind(this);
    }

    createToDo(e) {
        e.preventDefault();
        $.ajax({
            url: Config.endPoint + '/todo/create',
            dataType: 'json',
            type: 'POST',
            data: {content: this.state.toDoContent},
            cache: false,
            success: function(data) {
                if (data.success) {
                    this.setState({toDoContent: null});
                    this.props.afterCreateToDo(data);
                }
            }.bind(this)
        })
    }
    render() {
        return (
            <div className="commandBox">
                <form>
                    <input type="text"
                           id="createCommand"
                           onChange={(e) => this.setState({toDoContent: e.target.value})}/>
                    <input id="createSubmit" type="submit" onClick={this.createToDo}/>
                </form>
            </div>
        )
    }
}
