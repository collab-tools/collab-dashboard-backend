import React, { Component } from 'react';
import Paper from 'material-ui/Paper';

const styles = {
  cardContainer: {
    padding: 16,
    marginBottom: 16,
  },
};

class Card extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Paper style={styles.cardContainer}>
        {this.props.children}
      </Paper>
    );
  }
}

export default Card;
