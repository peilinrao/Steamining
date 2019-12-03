import React, { Component } from 'react';
import ApexCharts from 'react-apexcharts'

class DonutChart extends React.Component {

	constructor(props) {
	  super(props);

	  this.state = {

		options: {
			labels: ['100h+','<100h','<50h','<10h','0h'],
		  responsive: [{
			breakpoint: 480,
			options: {
			  chart: {
				width: 200
			  },
			  legend: {
				position: 'bottom'
			  }
			}
		  }]
		},
		series: this.props.data
	  }
	}

	render() {
	  return (
		  <ApexCharts options={this.state.options} series={this.props.data} type="donut" width="500" />
	  );
	}
  }

  export default DonutChart;
