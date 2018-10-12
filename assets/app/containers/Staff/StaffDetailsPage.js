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
    getStaffDetails
} from '../../actions/actions';

import Content from '../../components/Content';
import Section from '../../components/Section';
import Subheading from '../../components/Subheading';
import Card from '../../components/Card';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';

export class StaffDetailsPage extends Component {

    componentWillMount() {
        if (this.props.match.params.id) {
            this.props.getStaffDetails(this.props.match.params.id);
        }
    }

    editClicked = () => {
        const { staffDetails } = this.props;
        this.props.history.push({ 
            pathname:'/dashboard/staffs/createoredit',
            state: {staff: staffDetails}
        });
    }
    
    render() {

        const { staffDetails } = this.props;

        return (

            <Section>
                <Subheading>Staff</Subheading>
                    {
                        staffDetails ? 
                            <Card>
                                <TextField 
                                    value={staffDetails.name}
                                    disabled={true}
                                    floatingLabelText="Name" /> <br />
                                <TextField 
                                    value={staffDetails.username}
                                    disabled={true}
                                    floatingLabelText="Username" /> <br />
                                <TextField
                                    value={"******"}
                                    disabled={true}
                                    floatingLabelText="Password"
                                    type="password" /> <br />

                                <Toggle
                                    label="Is Admin?"
                                    disabled={true}
                                    toggled={staffDetails.isAdmin}
                                    labelPosition="right" />

                                <br/><br/>
                                <RaisedButton label="Edit" primary={true} onClick={this.editClicked} />
                            </Card>
                         : <Card> No Staff Found! </Card>
                    }
            </Section>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    staffDetails: state.staffs.staffDetails,
});
  
const mapDispatchToProps = {
    getStaffDetails,
};
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StaffDetailsPage);