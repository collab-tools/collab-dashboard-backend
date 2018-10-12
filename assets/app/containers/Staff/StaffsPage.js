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
    getAllStaffs
} from '../../actions/actions';

import Content from '../../components/Content';
import Section from '../../components/Section';
import Subheading from '../../components/Subheading';
import Card from '../../components/Card';

import moment from 'moment';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

export class StaffsPage extends Component {

    componentWillMount() {
        // load all staffs
        this.props.getAllStaffs();
        console.log(this.props);
    }

    staffsTableCellClicked = (row, column, event) => {
        const staff = this.props.staffs[row];
        this.props.history.push({ 
            pathname:'/dashboard/staffs/createoredit',
            state: {staff}
        });// pass in the staff
    }

    buttonClicked = () => {
        this.props.history.push('/dashboard/staffs/createoredit');
    }

    render() {
        const staffs = this.props.staffs || [];
        // TODO: Click to Edit Page
        return (
            <Content id="staffsPage">
                {
                staffs.length < 1 ?
                <Section>
                    <Subheading>No Staffs Found!</Subheading>
                </Section>
                :
                <div>
                    <Section>
                    <Subheading>Staffs List</Subheading>
                    <Card>
                        <Table onCellClick={this.staffsTableCellClicked}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                            <TableHeaderColumn>Username</TableHeaderColumn>
                            <TableHeaderColumn>Name</TableHeaderColumn>
                            <TableHeaderColumn>Admin</TableHeaderColumn>
                            <TableHeaderColumn>Creation Date</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {staffs.map((staff, index) => (
                            <TableRow key={index}>
                                <TableRowColumn>{staff.username}</TableRowColumn>
                                <TableRowColumn>{staff.name}</TableRowColumn>
                                <TableRowColumn>{staff.isAdmin ? "Yes" : "No"}</TableRowColumn>
                                <TableRowColumn>{moment(staff.createdAt).format("DD MMM YYYY")}</TableRowColumn>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </Card>
                    </Section>
                </div>
                }

                <FloatingActionButton style={style} onClick={this.buttonClicked}>
                    <ContentAdd />
                </FloatingActionButton>
            </Content>
        );
    }
}

const style = {
    position: "absolute",
    right: "50px",
    bottom: "50px",
};

const mapStateToProps = (state, ownProps) => ({
  staffs: state.staffs.staffs,
});

const mapDispatchToProps = {
  getAllStaffs,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StaffsPage);
