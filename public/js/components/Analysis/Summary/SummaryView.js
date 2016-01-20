import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { runAggregation, runComparisonOneDimensional } from '../../../actions/SummaryActions';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import HeaderBar from '../../Base/HeaderBar';
import AggregationTable from './AggregationTable';
import ComparisonTableOneD from './ComparisonTableOneD';

export class SummaryView extends Component {
  componentWillReceiveProps(nextProps) {
    const { aggregationIndependentVariableNames, aggregationVariableName, aggregationFunction, weightVariableName, runAggregation, runComparisonOneDimensional } = this.props;
    const aggregationIndependentVariablesChanged = nextProps.aggregationIndependentVariableNames.length != aggregationIndependentVariableNames.length;
    const aggregationVariableChanged = nextProps.aggregationVariableName != aggregationVariableName;
    const aggregationFunctionChanged = nextProps.aggregationFunction != aggregationFunction;
    const weightVariableChanged = nextProps.weightVariableName != weightVariableName;

    const sideBarChanged = aggregationIndependentVariablesChanged || aggregationVariableChanged || aggregationFunctionChanged || weightVariableChanged;
    const oneIndependentVariableSelected = nextProps.aggregationIndependentVariableNames.length == 1;
    const twoIndependentVariablesSelected = nextProps.aggregationIndependentVariableNames.length == 2;

    if (nextProps.projectId && nextProps.datasetId && sideBarChanged) {
      if (oneIndependentVariableSelected) {
        const aggregationList = nextProps.aggregationVariableName? ['q', nextProps.aggregationVariableName, [nextProps.aggregationFunction, nextProps.weightVariableName]] : null;
        runComparisonOneDimensional(nextProps.projectId, nextProps.datasetId, aggregationList, nextProps.aggregationIndependentVariableNames);
      } else if (twoIndependentVariablesSelected) {
        const aggregationList = nextProps.aggregationVariableName ? ['q', nextProps.aggregationVariableName, [nextProps.aggregationFunction, nextProps.weightVariableName]] : null;
        runAggregation(nextProps.projectId, nextProps.datasetId, aggregationList, nextProps.aggregationIndependentVariableNames);
      }
    }

  }
  render() {
    const { aggregationResult, oneDimensionComparisonResult, aggregationIndependentVariableNames } = this.props;
    const oneComparisonVariableSelected =aggregationIndependentVariableNames.length == 1
    const twoComparisonVariablesSelected = aggregationIndependentVariableNames.length == 2
    const oneDimensionDictHasElements = oneDimensionComparisonResult && oneDimensionComparisonResult.rows && oneDimensionComparisonResult.rows.length > 0;
    const aggregationDictHasElements = aggregationResult && aggregationResult.rows && aggregationResult.rows.length > 0;

    if (oneComparisonVariableSelected && oneDimensionDictHasElements) {
      return (
        <div className={ styles.comparisonViewContainer }>
          <Card>
            <HeaderBar header={ <span>Comparison Table</span> } />
            <ComparisonTableOneD comparisonResult={ oneDimensionComparisonResult } comparisonVariableNames={ comparisonVariableNames }/>
          </Card>
        </div>
      );
    }

    else if (twoComparisonVariablesSelected && aggregationDictHasElements) {
      return (
        <div className={ styles.summaryViewContainer }>
          <Card>
            <HeaderBar header={ <span>Aggregation Table</span> } />
            <AggregationTable aggregationResult={ aggregationResult } aggregationIndependentVariableNames={ aggregationIndependentVariableNames }/>
          </Card>
        </div>
      );
    }

    return (
      <div></div>
    );
  }
}

function mapStateToProps(state) {
  const { project, summarySelector, datasetSelector, fieldProperties } = state;
  const { aggregationResult, oneDimensionComparisonResult } = summarySelector;

  const aggregationVariable = fieldProperties.items.find((property) => property.id == summarySelector.aggregationVariableId);
  const aggregationVariableName = aggregationVariable ? aggregationVariable.name : null;

  const aggregationIndependentVariableNames = fieldProperties.items
    .filter((property) => summarySelector.comparisonVariablesIds.indexOf(property.id) >= 0)
    .map((field) => field.name);

  const weightVariable = fieldProperties.items.find((property) => property.id == summarySelector.weightVariableId);
  const weightVariableName = weightVariable ? weightVariable.name : 'UNIFORM';

  return {
    projectId: project.properties.id,
    datasetId: datasetSelector.datasetId,
    aggregationResult: aggregationResult,
    aggregationVariableName: aggregationVariableName,
    aggregationFunction: summarySelector.aggregationFunction,
    weightVariableName: weightVariableName,
    aggregationIndependentVariableNames: aggregationIndependentVariableNames,
    oneDimensionComparisonResult: oneDimensionComparisonResult
  };
}

export default connect(mapStateToProps, { runAggregation, runComparisonOneDimensional })(SummaryView);
