import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import {
    createStaff,
    updateStaff,
} from '../../actions/actions';

import Content from '../../components/Content';
import Section from '../../components/Section';
import Subheading from '../../components/Subheading';
import Card from '../../components/Card';

import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';

export class StaffsFormPage extends Component {

    componentWillMount() {
        if (this.props.location.state) {
            const staff = this.props.location.state.staff;
            if (staff) this.setState({
                id: staff.id,
                name: staff.name,
                username: staff.username,
                password: staff.password,
                isAdmin: staff.isAdmin,
            });
        }
    }

    state = {
        id: null,
        name: "",
        username: "",
        password: "",
        isAdmin: false,
    }

    handleChange = (event, index, value) => this.setState({role: value});

    submit = () => {
        const { id, name, username, password, isAdmin } = this.state;
        const callback = (id) => {
            this.props.history.push('/dashboard/staffs/' + id);
        }
        if (id) {
            // Update
            this.props.updateStaff(name, username, password, isAdmin, callback);
        } else {
            this.props.createStaff(name, username, password, isAdmin, callback);
        }
    }

    toggleClicked = () => {
        const isAdmin = !this.state.isAdmin;
        this.setState({isAdmin});
    }
    
    render() {

        return (
            <Section>
                <Subheading>{this.state.id ? "Update Existing" : "Create New"} Staff</Subheading>
                <Card>
                    <TextField 
                        value={this.state.name}
                        onChange={(event, newValue) => {
                            this.setState({name:newValue});
                        }}
                        hintText="Full Name" 
                        floatingLabelText="Name" /> <br />
                    <TextField 
                        value={this.state.username}
                        onChange={(event, newValue) => {
                            this.setState({username:newValue});
                        }}
                        hintText="Staff ID" 
                        floatingLabelText="Username" /> <br />
                    <TextField
                        value={this.state.password}
                        onChange={(event, newValue) => {
                            this.setState({password:newValue});
                        }}
                        hintText="Password Field"
                        floatingLabelText="Password"
                        type="password" /> <br />

                    <Toggle
                        label="Is Admin?"
                        onToggle={this.toggleClicked}
                        toggled={this.state.isAdmin}
                        labelPosition="right" />
                    {/* <SelectField
                        floatingLabelText="Role"
                        value={}
                        onChange={this.handleChange} >
                        <MenuItem value={"admin"} primaryText="Admin" />
                        <MenuItem value={"staff"} primaryText="Staff" />
                    </SelectField> <br /> <br /> */}
                    <br /> <RaisedButton label={this.state.id ? "Update" : "Create"} primary={true} onClick={this.submit} />
                </Card>
            </Section>
        );
    }
}

const mapDispatchToProps = {
    createStaff,
    updateStaff,
};

export default connect(
    null,
    mapDispatchToProps
)(StaffsFormPage);

