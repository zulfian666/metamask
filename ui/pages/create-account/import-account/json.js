import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FileInput from 'react-simple-file-input';
import {
  ButtonLink,
  FormTextField,
  INVISIBLE_CHARACTER,
  Text,
  TEXT_FIELD_SIZES,
  TEXT_FIELD_TYPES,
} from '../../../components/component-library';
import {
  Size,
  TextVariant,
  TEXT_ALIGN,
} from '../../../helpers/constants/design-system';
import ZENDESK_URLS from '../../../helpers/constants/zendesk-url';
import { useI18nContext } from '../../../hooks/useI18nContext';
import { displayWarning } from '../../../store/actions';
import BottomButtons from './bottom-buttons';

JsonImportSubview.propTypes = {
  importAccountFunc: PropTypes.func.isRequired,
};

export default function JsonImportSubview({ importAccountFunc }) {
  const t = useI18nContext();
  const warning = useSelector((state) => state.appState.warning);
  const [password, setPassword] = useState('');
  const [fileContents, setFileContents] = useState('');

  const isPrimaryDisabled = password === '' || fileContents === '';

  function handleKeyPress(event) {
    if (!isPrimaryDisabled && event.key === 'Enter') {
      event.preventDefault();
      _importAccountFunc();
    }
  }

  function _importAccountFunc() {
    if (isPrimaryDisabled) {
      displayWarning(t('needImportFile'));
    } else {
      importAccountFunc('JSON File', [fileContents, password]);
    }
  }

  return (
    <>
      <Text variant={TextVariant.bodyMd} textAlign={TEXT_ALIGN.CENTER}>
        {t('usedByClients')}
        <ButtonLink
          size={Size.inherit}
          href={ZENDESK_URLS.IMPORTED_ACCOUNTS}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('fileImportFail')}
        </ButtonLink>
      </Text>

      <FileInput
        readAs="text"
        onLoad={(event) => setFileContents(event.target.result)}
        style={{
          padding: '20px 0px 12px 15%',
          fontSize: '16px',
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
        }}
      />

      <FormTextField
        id="json-password-box"
        size={TEXT_FIELD_SIZES.LARGE}
        autoFocus
        type={TEXT_FIELD_TYPES.PASSWORD}
        helpText={warning || INVISIBLE_CHARACTER} // The INVISIBLE_CHARACTER ensures that the error message takes up vertical space even if there's no error message
        error
        placeholder={t('enterPassword')}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        inputProps={{
          onKeyPress: handleKeyPress,
        }}
        marginBottom={2}
      />

      <BottomButtons
        importAccountFunc={_importAccountFunc}
        isPrimaryDisabled={isPrimaryDisabled}
      />
    </>
  );
}
