import { MenuItem } from '@material-ui/core';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Suggestion extends Component {
  static propTypes = {
    isHighlighted: PropTypes.bool.isRequired,
    query        : PropTypes.string.isRequired,
    suggestion   : PropTypes.object.isRequired,
  };

  renderHighlightedText () {
    const { suggestion, query } = this.props;

    const matches = match(suggestion.name, query);
    const parts   = parse(suggestion.name, matches);

    return parts.map((part, index) => {
      if (part.highlight) {
        return <strong key={`suggestion-${index}`}>{part.text}</strong>;
      }

     return <span key={`suggestion-${index}`}>{part.text}</span>;
    });
  }

  render () {
    return (
      <MenuItem selected={this.props.isHighlighted} component="div">
        <div>
          {this.renderHighlightedText()}
          <span>, {this.props.suggestion.country}</span>
        </div>
      </MenuItem>
    );
  }
}
