import React, { Component } from 'react';

const styles = {
  section: {
    margin: 32,
  },
};

class Section extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={styles.section}>
        {this.props.children}
      </div>
    );
  }
}

export default Section;
