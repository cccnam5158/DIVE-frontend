import React, { Component, PropTypes } from 'react';
import styles from './Landing.sass';
import { connect } from 'react-redux';
import { pushState } from 'redux-react-router';
import { createProject, fetchPreloadedProjects, fetchUserProjects, wipeProjectState } from '../../actions/ProjectActions';

import RaisedButton from '../Base/RaisedButton';

export class HomePage extends Component {
  componentWillMount() {
    const { projects, userId } = this.props;
    if (projects.preloadedProjects.length == 0) {
      this.props.fetchPreloadedProjects();
    }

    if (projects.userProjects.length == 0 && userId) {
      this.props.fetchUserProjects(userId);
    }
  }

  componentWillReceiveProps(nextProps) {
    const nextProjectId = nextProps.project.properties.id
    if (this.props.project.properties.id != nextProjectId) {
      this.props.wipeProjectState();
      this.props.pushState(null, `/projects/${ nextProjectId }/datasets/upload`);
    }
  }

  _onUploadClick() {
    const userId = this.props.userId;
    console.log('THIS PROPS', this.props)
    const projectTitle = 'Project Title';
    const projectDescription = 'Project Description'
    this.props.createProject(userId, projectTitle, projectDescription);
  }

  render() {
    const { projects, userId } = this.props;
    const { userProjects, preloadedProjects } = projects;
    return (
      <div className={ styles.centeredFill }>
        <div className={ styles.ctaBox }>
          <div className={ styles.primaryCopy }>
            <span>Stop Processing Data and Start <strong>Understanding It</strong></span>
          </div>
          <div className={ styles.secondaryCopy }>
            Merge and query datasets, conduct statistical analyses, and explore
            automatically generated visualizations within seconds.
          </div>
          <div className={ styles.ctaContainer }>
            <RaisedButton
              label="Upload Dataset"
              primary={ true }
              onClick={ this._onUploadClick.bind(this) }
              className={ styles.uploadButton } />
          </div>
        </div>
        { userId && userProjects.length > 0 &&
          <div>
            <div className={ styles.separater }></div>
            <div className={ styles.projectsContainer }>
              <div className={ styles.projectTypeContainer }>
                <div className={ styles.flexbox }>
                  <div className={ styles.secondaryCopy + ' ' + styles.emphasis }>Your projects:</div>
                </div>
                <div className={ styles.projectListContainer }>
                  { projects.isFetching &&
                    <div className={ styles.watermark }>Fetching projects...</div>
                  }
                  { userProjects.map((project) =>
                    <a key={ `project-button-id-${ project.id }` } href={ `/projects/${ project.id }/datasets` } className={ styles.projectButton }>{ project.title }</a>
                  )}
                </div>
              </div>
            </div>
          </div>
        }
        <div className={ styles.separater }></div>
        <div className={ styles.projectsContainer }>
          <div className={ styles.projectTypeContainer }>
            <div className={ styles.flexbox }>
              <div className={ styles.secondaryCopy + ' ' + styles.emphasis }>Or explore our preloaded projects:</div>
            </div>
            <div className={ styles.projectListContainer }>
              { projects.isFetching &&
                <div className={ styles.watermark }>Fetching projects...</div>
              }
              { preloadedProjects.map((project) =>
                <a key={ `project-button-id-${ project.id }` } href={ `/projects/${ project.id }/datasets` } className={ styles.projectButton }>{ project.title }</a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state) {
  const { project, projects, user } = state;
  return { project, projects, userId: user.id };
}

export default connect(mapStateToProps, { fetchPreloadedProjects, fetchUserProjects, createProject, wipeProjectState, pushState })(HomePage);
