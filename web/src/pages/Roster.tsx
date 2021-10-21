import React from 'react'
import styled from 'styled-components';
import { query } from '../utils/solana/raydium/fund';

const TextareaBox = styled.textarea`
    height: 10vh;
    width: 30vw;
`;

class Roster extends React.Component<{}, {
    value: string, queryInfo: {
        allCount: number,
    }, tableData: Array<any>
}> {
    constructor(props: any) {
        super(props);
        this.state = {
            value: 'HuZx3keBd2b7BnXo38vXn8zuintSbYGs3hoLRe5Es54g',
            queryInfo: {
                allCount: 0,
            },
            tableData: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event: any) {
        this.setState({ value: event.target.value });
    }

    async handleSubmit(event: any) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
        let arr = this.state.value.split(/[(\r\n\s)\r\n\s]+/);
        for (let temp of arr) {
            if (temp.trim().length > 0) {
                console.log(temp.trim());
                let res = await query(temp.trim());
                console.log(res);
                this.setState(state => ({
                    queryInfo: res,
                    tableData: state.tableData.concat(res)
                }));
            }
        }
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                {this.state.tableData.map(function (object, i) {
                    return <div>
                        <span>{i}</span>
                        <span>{object.allCount}</span>
                        <span>{object.winCount}</span>
                        <span>{object.address}</span>
                    </div>;
                })}
                <input value={this.state.queryInfo.allCount} readOnly />
                <label>
                    Name:
                    <TextareaBox defaultValue={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

export default Roster
