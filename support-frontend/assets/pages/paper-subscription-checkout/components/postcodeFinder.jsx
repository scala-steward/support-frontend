// @flow
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Button from 'components/button/button';
import { Input } from 'components/forms/standardFields/input';
import { Label } from 'components/forms/standardFields/label';
import { asControlled } from 'components/forms/formHOCs/asControlled';
import { withLabel } from 'components/forms/formHOCs/withLabel';
import { withError } from 'components/forms/formHOCs/withError';

import { type PostcodeFinderState, type PostcodeFinderActionCreators, postcodeFinderActionCreators } from './postcodeFinderReducer';

import styles from './postcodeFinder.module.scss';

type PropTypes = {|
  ...PostcodeFinderState,
  ...PostcodeFinderActionCreators,
  id: string
|};

const InputWithButton = ({ onClick, ...props }) => (
  <div className={styles.root}>
    <Input {...props} name="postcode" />
    <Button type="button" onClick={onClick} aria-label={null}>find it</Button>
  </div>
);

const ComposedInputWithButton = compose(withLabel, withError, asControlled)(InputWithButton);

const PostcodeFinder = ({
  id, postcode, results, setPostcode, fetchResults, error,
}: PropTypes) => (
  <div>
    <ComposedInputWithButton error={error} label="Postcode" onClick={fetchResults} id={id} setValue={setPostcode} value={postcode} />
    {results &&
    <Label htmlFor={null} label="Results">
      {results.map(({ addressLine1 }) => (
        <strong>{addressLine1}</strong>
      ))}
    </Label>
    }
  </div>
);

// ----- Exports ----- //

export default connect(
  state => ({
    ...state.page.postcodeFinder,
  }),
  postcodeFinderActionCreators,
)(PostcodeFinder);
