import React, { Component } from 'react';
import { Paper, TextField, withStyles } from '@material-ui/core';
import Autosuggest from 'react-autosuggest';
import cityList from '../../cityList';
import Suggestion from '../Suggestion';
import styles from './AutosuggestInput.styles';

class AutosuggestInput extends Component {
  state = {
    value      : '',
    suggestions: [],
  };

  getSuggestions (value) {
    const input = value.trim().toLowerCase();

    if (input.length === 0) {
      return [];
    }

    let suggestions = [];

    // Why using for instead of filter?
    // Because I wanted to return as soon as I had 5 matches, without iterating over all cities
    for (let i = 0; i < cityList.length; i++) {
      const cityName = cityList[i].name;

      if (cityName.slice(0, input.length).toLowerCase() === input) {
        suggestions.push(cityList[i]);
      }

      if (suggestions.length > 4 || i === cityList.length - 1) {
        return suggestions;
      }
    }
  }

  onSelect (event, { suggestionValue }) {
    this.setState({ value: suggestionValue.name });
    this.props.onSelect(suggestionValue.id);
  }

  onChange (event, { newValue }) {
    if (typeof newValue !== 'string') {
      return;
    }
    this.setState({ value: newValue });
  };

  renderInput (props) {
    const { classes, ref, inputRef = () => {}, ...other } = props;

    return (
      <TextField
        fullWidth
        InputProps={{
          inputRef: node => { ref(node);inputRef(node); },
          classes : { input: classes.input },
        }}
        {...other}
      />
    );
  }

  renderSuggestion (suggestion, { query, isHighlighted }) {
    return <Suggestion isHighlighted={isHighlighted} query={query} suggestion={suggestion} />;
  }

  renderSuggestionContainer ({ containerProps, children }) {
    return <Paper {...containerProps} square>{children}</Paper>;
  }

  render () {
    const inputProps = {
      classes    : this.props.classes,
      label: 'Search',
      value      : this.state.value,
      onChange   : (e, { newValue }) => this.onChange(e, { newValue }),
    };

    return (
      <Autosuggest
        renderInputComponent={props => this.renderInput(props)}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={({ value }) => this.setState({ suggestions: this.getSuggestions(value) || [] })}
        onSuggestionsClearRequested={() => this.setState({ suggestions: [] })}
        getSuggestionValue={suggestion => suggestion}
        renderSuggestion={(suggestion, options) => this.renderSuggestion(suggestion, options)}
        inputProps={inputProps}
        theme={this.props.classes}
        renderSuggestionsContainer={options => this.renderSuggestionContainer(options)}
        onSuggestionSelected={(e, { suggestionValue }) => this.onSelect(e, { suggestionValue })}
      />
    );
  }
}

export default withStyles(styles)(AutosuggestInput);
