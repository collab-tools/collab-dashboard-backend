import React, { Component } from 'react';

const styles = {
  contentContainer: {
    height: '100%',
    width: '100%',
  },
};

class Content extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id={this.props.id} style={styles.contentContainer}>
        {this.props.children}
      </div>
    );
  }
}

export default Content;
