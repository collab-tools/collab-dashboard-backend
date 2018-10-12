import React, { Component } from 'react';

const styles = {
  subheadingContainer: {
    color: '#757575',
  },
};

class Subheading extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <h3 style={styles.subheadingContainer}>
        {this.props.children}
      </h3>
    );
  }
}

export default Subheading;
