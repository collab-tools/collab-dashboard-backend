import React, { Component } from 'react';

const styles = {
  heading: {
    color: '#424242',
    fontSize: 42,
    paddingLeft: 32,
    paddingRight: 32,
  },
};

class Heading extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <h2 style={styles.heading}>
        {this.props.children}
      </h2>
    );
  }
}

export default Heading;
