import React, { Component } from 'react';
import logo from '../../assets/logo.png';
import api from '../../services/api';
import { FaFile } from 'react-icons/fa';

import Dropzone from 'react-dropzone';

import { distanceInWords } from 'date-fns';

import pt from 'date-fns/locale/pt';
import socket from 'socket.io-client';

import '../BoxDetail/style.css'

export default class BoxDetail extends Component {

    state = {
        box: {}
    }


    async componentDidMount() {
        this.updateFiles();
        const id = this.props.match.params.id
        const response = await api.get(`boxes/${id}`)
        this.setState({ box: response.data })
    }

    updateFiles = () => {
        const io = socket('https://lenigboxbackend.herokuapp.com');
        io.emit('connectRoom', this.state.box._id);
        io.on('file', data => {
            console.log(data)
        })
    }

    handleUpload = (files) => {
        files.forEach(element => {
            const data = new FormData()

            data.append('file', element)

            api.post(`boxes/${this.state.box._id}/files`, data).then((response) => {
                if (response.status === 200) {
                    window.location.reload(false);
                }else {
                    alert('Erro ao enviar o arquivo')
                }
            })
        });
    }

    render() {
        return (
            <div id="box-container">
                <header>
                    <img src={logo} />
                    <h1>{this.state.box.title}</h1>
                </header>

                <Dropzone onDropAccepted={this.handleUpload}>
                    {({ getRootProps, getInputProps }) => (
                        <div className="upload" {...getRootProps()}>
                            <input {...getInputProps()} />

                            <p>Arraste arquivos ou clique aqui</p>

                        </div>
                    )}
                </Dropzone>

                <ul>

                    {this.state.box.files && this.state.box.files.map(file => (
                        <li key={file._id}>
                            <a className="fileInfo" href={file.url} target="_blank">
                                <FaFile size={24} color="#A5CFFF" />
                                <strong>{file.title}</strong>
                            </a>
                            <span>Há{' '}{distanceInWords(file.createdAt, new Date(), {
                                locale: pt
                            })} atrás</span>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }
}
