import React, { Component } from 'react';

const styles = {
  headingContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
};

class HeadingContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={styles.headingContainer}>
        {this.props.children}
      </div>
    );
  }
}

export default HeadingContainer;
