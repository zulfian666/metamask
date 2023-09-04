import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  FormTextField,
  TEXT_FIELD_SIZES,
  TEXT_FIELD_TYPES,
} from '../../component-library';
import {
  Display,
  AlignItems,
  JustifyContent,
} from '../../../helpers/constants/design-system';
import { useI18nContext } from '../../../hooks/useI18nContext';
import Box from '../../ui/box';
import ShowHideToggle from '../../ui/show-hide-toggle';
import BottomButtons from './bottom-buttons';

PrivateKeyImportView.propTypes = {
  importAccountFunc: PropTypes.func.isRequired,
  onActionComplete: PropTypes.func.isRequired,
};

export default function PrivateKeyImportView({
  importAccountFunc,
  onActionComplete,
}) {
  const t = useI18nContext();
  const [privateKey, setPrivateKey] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  const warning = useSelector((state) => state.appState.warning);

  function handleKeyPress(event) {
    if (privateKey !== '' && event.key === 'Enter') {
      event.preventDefault();
      _importAccountFunc();
    }
  }

  function _importAccountFunc() {
    importAccountFunc('privateKey', [privateKey]);
  }

  return (
    <>
      <Box
        display={Display.Flex}
        alignItems={AlignItems.center}
        justifyContent={JustifyContent.center}
      >
        <FormTextField
          id="private-key-box"
          size={TEXT_FIELD_SIZES.LARGE}
          autoFocus
          type={
            showPrivateKey ? TEXT_FIELD_TYPES.TEXT : TEXT_FIELD_TYPES.PASSWORD
          }
          helpText={warning}
          error
          label={t('pastePrivateKey')}
          value={privateKey}
          onChange={(event) => setPrivateKey(event.target.value)}
          inputProps={{
            onKeyPress: handleKeyPress,
          }}
          marginBottom={4}
        />
        <Box marginTop={4}>
          <ShowHideToggle
            shown={showPrivateKey}
            id="show-hide-private-key"
            title={t('privateKeyShow')}
            ariaLabelShown={t('privateKeyShown')}
            ariaLabelHidden={t('privateKeyHidden')}
            onChange={() => setShowPrivateKey(!showPrivateKey)}
          />
        </Box>
      </Box>
      <BottomButtons
        importAccountFunc={_importAccountFunc}
        isPrimaryDisabled={privateKey === ''}
        onActionComplete={onActionComplete}
      />
    </>
  );
}
