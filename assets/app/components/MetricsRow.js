import React, { Component } from 'react';
import Paper from 'material-ui/Paper';

const styles = {
  metricsWrapper: {
    display: 'flex',
    flexDirection: 'row wrap',
    width: '100%',
  },
  metricsContainer: {
    flex: 1,
    height: '100%',
    textAlign: 'center',
    paddingTop: 10,
  },
  spaceBetween: {
    padding: 16,
  },
};

class MetricsRow extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let metricsData = this.props.metricsData;
    return (
      <div style={styles.metricsWrapper}>
        {metricsData
          .map((metricsData, index) =>
            <Paper key={index} style={styles.metricsContainer}>
              <h1>{metricsData.metric}</h1>
              <h4>{metricsData.metricLabel}</h4>
            </Paper>
          )
          .reduce((prev, curr) =>
            [prev, (<span key={metricsData.metricLabel + '_gap'} style={styles.spaceBetween}/>) ,curr]
          )
        }
      </div>
    );
  }
}

export default MetricsRow;
