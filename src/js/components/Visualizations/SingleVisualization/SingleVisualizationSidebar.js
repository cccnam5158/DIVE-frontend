import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { selectSingleVisualizationVisualizationType, selectSingleVisualizationSortOrder, selectSingleVisualizationSortField, selectVisualizationBinningConfig, selectVisualizationDataConfig, selectVisualizationDisplayConfig } from '../../../actions/VisualizationActions';
import { selectConditional } from '../../../actions/ConditionalsActions';
import { fetchFieldPropertiesIfNeeded } from '../../../actions/FieldPropertiesActions';
import styles from '../Visualizations.sass';

import Sidebar from '../../Base/Sidebar';
import SidebarGroup from '../../Base/SidebarGroup';
import SidebarCategoryGroup from '../../Base/SidebarCategoryGroup';
import ToggleButtonGroup from '../../Base/ToggleButtonGroup';
import DropDownMenu from '../../Base/DropDownMenu';
import RaisedButton from '../../Base/RaisedButton';

import ConditionalSelector from '../../Base/ConditionalSelector';
import BinningSelector from './BinningSelector';

export class SingleVisualizationSidebar extends Component {

  componentWillMount() {
    const { project, datasetSelector, fieldProperties, fetchFieldPropertiesIfNeeded } = this.props;
    if (project.id && datasetSelector.datasetId && !fieldProperties.items.length && !fieldProperties.isFetching) {
      fetchFieldPropertiesIfNeeded(project.id, datasetSelector.datasetId);
    }
  }

  componentDidUpdate(previousProps) {
    const { project, visualization, datasetSelector, fieldProperties, selectSingleVisualizationVisualizationType, fetchFieldPropertiesIfNeeded } = this.props;
    const { visualizationType } = visualization;

    if (visualization.spec.id && !visualizationType) {
      selectSingleVisualizationVisualizationType(visualization.spec.vizTypes[0]);
    }

    if (project.id && !fieldProperties.isFetching && fieldProperties.items.length == 0) {
      fetchFieldPropertiesIfNeeded(project.id, datasetSelector.datasetId);
    }
  }

  render() {
    const { conditionals, fieldProperties, selectSingleVisualizationVisualizationType, selectSingleVisualizationSortField, selectSingleVisualizationSortOrder, selectConditional, selectVisualizationBinningConfig, selectVisualizationDataConfig, selectVisualizationDisplayConfig, filters, visualization } = this.props;
    const { visualizationType } = visualization;

    console.log('SUBSET IN SIDEBAR:', visualization.subset);

    if (!visualization.lastUpdated) {
      return (<div></div>);
    }

    const visualizationTypes = filters.visualizationTypes.filter((visualizationType) =>
      (visualization.spec.vizTypes.indexOf(visualizationType.type) > -1)
    ).map((visualizationType) =>
      new Object({ ...visualizationType, selected: visualizationType.type == visualizationType })
    );

    return (
      <Sidebar>
        { visualization.subset &&
          <SidebarCategoryGroup heading="Data Options" iconName="th">
            <SidebarGroup heading="Number of Elements">
              <DropDownMenu
                value={ visualization.config.data.subset }
                options={ visualization.configOptions.subset }
                valueMember="value"
                displayTextMember="label"
                onChange={ (value) => selectVisualizationDataConfig('subset', value) } />
            </SidebarGroup>
          </SidebarCategoryGroup>
        }
        <SidebarCategoryGroup heading="Display Options" iconName="chart">
          { visualizationType && visualizationTypes.length > 1 &&
            <SidebarGroup heading="Visualization type">
              <ToggleButtonGroup
                toggleItems={ visualizationTypes }
                displayTextMember="label"
                valueMember="type"
                imageNameMember="imageName"
                imageNameSuffix=".chart.svg"
                onChange={ selectSingleVisualizationVisualizationType } />
            </SidebarGroup>
          }
          { (visualizationType == 'bar' || visualizationType == 'box') &&
            <SidebarGroup heading="Sort by">
              <div className={ styles.sortGroup }>
                <ToggleButtonGroup
                  className={ styles.sortFields }
                  toggleItems={ visualization.sortFields }
                  valueMember="id"
                  displayTextMember="name"
                  separated={ (visualization.sortFields.length > 3) }
                  onChange={ selectSingleVisualizationSortField } />
                <ToggleButtonGroup
                  className={ styles.sortOrder }
                  toggleItems={ visualization.sortOrders.map((sortOrder) => new Object({...sortOrder, icon: <i className={ sortOrder.iconName }></i> })) }
                  valueMember="id"
                  displayTextMember="icon"
                  altTextMember="name"
                  onChange={ selectSingleVisualizationSortOrder } />
              </div>
            </SidebarGroup>
          }
          { visualizationType == 'hist' &&
            <BinningSelector
              config={ visualization.spec.config }
              selectBinningConfig={ (config) => selectVisualizationBinningConfig('binning', config) } />
          }
          { (visualizationType == 'hist' || visualizationType == 'bar' || visualizationType == 'scatter') &&
            <SidebarGroup heading="Vertical axis scale">
                <DropDownMenu
                  value={ visualization.config.display.vScaleType }
                  options={ visualization.configOptions.scaleType }
                  valueMember="value"
                  displayTextMember="label"
                  onChange={ (value) => selectVisualizationDisplayConfig('vScaleType', value) }/>
            </SidebarGroup>
          }
          { (visualizationType == 'scatter') &&
            <SidebarGroup heading="Horizontal axis scale">
                <DropDownMenu
                  value={ visualization.config.display.hScaleType }
                  options={ visualization.configOptions.scaleType }
                  valueMember="value"
                  displayTextMember="label"
                  onChange={ (value) => selectVisualizationDisplayConfig('hScaleType', value) }/>
            </SidebarGroup>
          }
          { (visualizationType == 'bar') &&
            <SidebarGroup heading="Legend">
                <DropDownMenu
                  value={ visualization.config.legendPosition }
                  options={ visualization.configOptions.legendPosition }
                  valueMember="value"
                  displayTextMember="label"
                  onChange={ (value) => selectVisualizationDisplayConfig('legendPosition', value) } />
            </SidebarGroup>
          }
        </SidebarCategoryGroup>
        <SidebarCategoryGroup heading="Filters" iconName="filter">
          { fieldProperties.items.length != 0 && conditionals.items.length != 0 && conditionals.items.map((conditional, i) =>
            <div key={ conditional.conditionalId }>
              <ConditionalSelector
                conditionalIndex={ i }
                conditionalId={ conditional.conditionalId }
                fieldId={ conditional.fieldId }
                combinator={ conditional.combinator }
                operator={ conditional.operator }
                value={ conditional.value }
                fieldProperties={ fieldProperties.items }
                selectConditionalValue={ selectConditional }/>
            </div>
          )}
        </SidebarCategoryGroup>
      </Sidebar>
    );
  }
}

SingleVisualizationSidebar.propTypes = {
  project: PropTypes.object.isRequired,
  datasetSelector: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  visualization: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  const { project, datasetSelector, filters, visualization, fieldProperties, conditionals } = state;
  return {
    project,
    conditionals,
    datasetSelector,
    filters,
    visualization,
    fieldProperties
  };
}

export default connect(mapStateToProps, {
  selectSingleVisualizationVisualizationType,
  selectSingleVisualizationSortOrder,
  selectSingleVisualizationSortField,
  fetchFieldPropertiesIfNeeded,
  selectConditional,
  selectVisualizationBinningConfig,
  selectVisualizationDataConfig,
  selectVisualizationDisplayConfig
})(SingleVisualizationSidebar);
