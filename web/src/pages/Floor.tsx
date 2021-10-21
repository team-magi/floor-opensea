import React from 'react'
import styled from 'styled-components';
import { fulfillOrder } from '../utils/opensea';
import { Button, Input, Row, Col, Select, Steps, Spin } from "antd";

const { Option } = Select;
const { Step } = Steps;

class Floor extends React.Component<{}, {
    collectionName: string,
    network: string,
    queryLoading: boolean,
    buyLoading: boolean,
    price: number,
    steps: number,
    url: string,
    isRinkeby: boolean,
}> {
    constructor(props: any) {
        super(props);
        this.state = {
            collectionName: 'voxodeus-v3',
            network: 'test',
            queryLoading: false,
            buyLoading: false,
            isRinkeby: false,
            price: 0,
            steps: 0,
            url: '',
        };
        this.handleChangeCollectionName = this.handleChangeCollectionName.bind(this);
        this.handleBuy = this.handleBuy.bind(this);
        this.handleQuery = this.handleQuery.bind(this);
    }

    handleChangeCollectionName(event: any) {
        this.setState({ collectionName: event.target.value });
    }

    handleChangeNetwork(value: string) {
        console.log(value);
    }

    async handleQuery(event: any) {
        event.preventDefault();
        this.setState({
            queryLoading: true,
        });
        fetch(`http://localhost:4000/v1?collectionName=${this.state.collectionName}&network=test`, {
            method: "GET",
        }).then(response => response.json())
            .then(response => {
                if (response && response.url) {
                    response.url = '/assets/mumbai/0x7efeaf48c461084b96a71279de921f62c0c80c12/1';
                    var urlArr = response.url.split('/');
                    if (urlArr[2].length > 40) {
                        this.setState({
                            isRinkeby: true,
                        });
                    }
                    if (this.state.network == 'test') {
                        this.setState({
                            price: response.price,
                            url: 'https://testnets.opensea.io' + response.url,
                        });
                    } else {
                        this.setState({
                            price: response.price,
                            url: 'https://opensea.io' + response.url,
                        });
                    }
                }
            })
            .catch(err => {
                console.log(err);
            }).finally(() => {
                this.setState({
                    queryLoading: false,
                    steps: 1,
                });
            });
    }

    async handleBuy(event: any) {
        event.preventDefault();
        this.setState({
            buyLoading: true,
        });
        var urlArr = this.state.url.split('/');
        console.log(urlArr[urlArr.length - 2]);
        console.log(urlArr[urlArr.length - 1]);
        fulfillOrder(urlArr[urlArr.length - 2], urlArr[urlArr.length - 1]).then(res => {
            alert(res.msg);
            console.log(res);
        }).finally(() => {
            this.setState({
                buyLoading: false,
                steps: 2,
            });
        });
    }

    render() {
        return (
            <>
                <Row gutter={8}>
                    请选择网络：
                    <Col>
                        <Select defaultValue={this.state.network} style={{ width: 120 }} onChange={this.handleChangeNetwork}>
                            {/* <Option value="main">main</Option> */}
                            <Option value="test">testnet</Option>
                        </Select>
                    </Col>
                </Row>
                <Row gutter={8} style={{ marginTop: 20 }}>
                    专辑名称：
                    <Col span={12}>
                        <Input defaultValue={this.state.collectionName} onChange={this.handleChangeCollectionName} placeholder="" />
                    </Col>
                </Row>
                <Row style={{ marginTop: 20 }}>
                    <Col span={6}>
                        <Steps current={0}>
                            <Step title="查询" />
                            <Step title="购买" />
                        </Steps>
                    </Col>
                </Row>
                <Row style={{ marginTop: 20 }}>
                    <Button type="primary" loading={this.state.queryLoading} style={{ marginLeft: 8 }} onClick={this.handleQuery}>
                        搜索
                    </Button>
                </Row>
                {
                    this.state.steps > 0 && this.state.url == '' &&
                    <>
                        <Row>404~</Row>
                    </>
                }
                {
                    this.state.steps > 0 && this.state.url != '' &&
                    <>
                        <Row style={{ marginTop: 20 }}>
                            <Col>price: {this.state.price}</Col>
                        </Row>
                        <Row>
                            <Col>url: {this.state.url}</Col>
                        </Row>
                        <Row style={{ marginTop: 20 }}>
                            {
                                this.state.isRinkeby ?
                                <Button type="primary" loading={this.state.buyLoading} style={{ marginLeft: 8 }} onClick={this.handleBuy}>
                                    立即购买
                                </Button> : <a href={this.state.url} target="_blank" rel="noopener noreferrer"><Button type="primary" style={{ marginLeft: 8 }}>
                                    立即购买
                                </Button></a>
                            }
                        </Row>
                    </>
                }
            </>
        );
    }
}

export default Floor
