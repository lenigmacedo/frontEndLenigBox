import React, { Component } from 'react';
import api from '../../services/api';
import './style.css';
import logo from '../../assets/logo.png';

export default class Main extends Component {

    state = {
        newBox: "",
    };

    handleSubmit = async event => {
        event.preventDefault()

        const response = await api.post('/boxes', {
            title: this.state.newBox,
        })

        this.props.history.push(`/box/${response.data._id}`)


    };

    handleInputChange = (event) => {
        this.setState({
            newBox: event.target.value
        })
    }


    render() {
        return (
            <div id="main-container">
                <form onSubmit={this.handleSubmit}>
                    <img src={logo} />
                    <input type="text" placeholder="Criar box" onChange={this.handleInputChange} />
                    <button type="submit">Criar</button>
                </form>
            </div>
        )
    }
}