/**
 * Created by Joy on 4/9/17.
 */
import React from 'react';
import Config from '../Config'
import $$ from '../MyQuery'
import '../main.css'

export default class Item extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            completed:this.props.completed,
            content: this.props.content
        };
        this.itemCompletedHandler = this.itemCompletedHandler.bind(this);
        this.deleteHandler = this.deleteHandler.bind(this);
    }

    itemCompletedHandler() {
        if (this.state.completed) {
            this.setState({completed: false});
        } else {
            this.setState({completed: true});
        }

        $$.ajax({
            url: Config.endPoint + '/todo/update',
            type: 'POST',
            dataType: 'json',
            data: {
                content: this.state.content,
                completed:this.state.completed,
                id: this.props.id
            },
            cache: false,
            success: function(data) {
                if (data.success) {
                    this.props.afterCompleteToggle(data);
                } else {
                    alert("There is something goes wrong, please try agian later.");
                }
            }.bind(this),
        })
    }

    deleteHandler() {
        $$.ajax({
            url: Config.endPoint + '/todo/delete',
            type: 'POST',
            dataType: 'json',
            data: {id: this.props.id},
            cache: false,
            success: function (data) {
                if (data.success) {
                    this.props.afterDelete(data);
                } else {
                    alert("There is something goes wrong, please try agian later.");
                }
            }.bind(this)
        })
    }

    render() {
        return (
            <div className="itemGroup alert alert-info">
                <input type="checkbox" onClick={this.itemCompletedHandler}/>
                <div>{this.state.content}</div>
                <a href="#" onClick={this.deleteHandler}>&times;</a>
            </div>
        )
    }
}
