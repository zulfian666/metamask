import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import classnames from 'classnames';
import Button from '../../ui/button';
import * as actions from '../../../store/actions';
import { openAlert as displayInvalidCustomNetworkAlert } from '../../../ducks/alerts/invalid-custom-network';
import {
  NETWORK_TYPE_RPC,
  NETWORK_TO_NAME_MAP,
} from '../../../../shared/constants/network';
import { isPrefixedFormattedHexString } from '../../../../shared/modules/network.utils';

import ColorIndicator from '../../ui/color-indicator';
import { COLORS, SIZES } from '../../../helpers/constants/design-system';
import { getShowTestNetworks } from '../../../selectors';
import { getEnvironmentType } from '../../../../app/scripts/lib/util';
import { ENVIRONMENT_TYPE_POPUP } from '../../../../shared/constants/app';
import {
  ADD_NETWORK_ROUTE,
  ADVANCED_ROUTE,
} from '../../../helpers/constants/routes';
import { Dropdown, DropdownMenuItem } from './dropdown';
import {
  QUAI_MAINNET,
  QUAI_MAIN_CONTEXTS,
  QUAI_TEST_CONTEXTS,
} from '../../../../shared/constants/quai';

// classes from nodes of the toggle element.
const notToggleElementClassnames = [
  'menu-icon',
  'network-name',
  'network-indicator',
  'network-caret',
  'network-component',
  'modal-container__footer-button',
];

const DROP_DOWN_MENU_ITEM_STYLE = {
  fontSize: '16px',
  lineHeight: '20px',
  padding: '12px 0',
};

function mapStateToProps(state) {
  return {
    provider: state.metamask.provider,
    selectedAddress: state.metamask.selectedAddress,
    shouldShowTestNetworks: getShowTestNetworks(state),
    frequentRpcListDetail: state.metamask.frequentRpcListDetail || [],
    networkDropdownOpen: state.appState.networkDropdownOpen,
    showTestnetMessageInDropdown: state.appState.showTestnetMessageInDropdown,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setProviderType: (type) => {
      dispatch(actions.setProviderType(type));
    },
    setRpcTarget: (target, chainId, ticker, nickname) => {
      dispatch(actions.setRpcTarget(target, chainId, ticker, nickname));
    },
    updateRpcTarget: (target, chainId, ticker, nickname, rpcPrefs) => {
      dispatch(
        actions.updateRpcTarget(target, chainId, ticker, nickname, rpcPrefs),
      );
    },
    hideNetworkDropdown: () => dispatch(actions.hideNetworkDropdown()),
    displayInvalidCustomNetworkAlert: (networkName) => {
      dispatch(displayInvalidCustomNetworkAlert(networkName));
    },
    showConfirmDeleteNetworkModal: ({ target, onConfirm }) => {
      return dispatch(
        actions.showModal({
          name: 'CONFIRM_DELETE_NETWORK',
          target,
          onConfirm,
        }),
      );
    },
    hideTestNetMessage: () => dispatch(actions.hideTestNetMessage()),
  };
}

class NetworkDropdown extends Component {
  static contextTypes = {
    t: PropTypes.func,
    metricsEvent: PropTypes.func,
  };

  static propTypes = {
    provider: PropTypes.shape({
      nickname: PropTypes.string,
      rpcUrl: PropTypes.string,
      type: PropTypes.string,
      ticker: PropTypes.string,
    }).isRequired,
    selectedAddress: PropTypes.string,
    setProviderType: PropTypes.func.isRequired,
    setRpcTarget: PropTypes.func.isRequired,
    hideNetworkDropdown: PropTypes.func.isRequired,
    frequentRpcListDetail: PropTypes.array.isRequired,
    shouldShowTestNetworks: PropTypes.bool,
    networkDropdownOpen: PropTypes.bool.isRequired,
    displayInvalidCustomNetworkAlert: PropTypes.func.isRequired,
    showConfirmDeleteNetworkModal: PropTypes.func.isRequired,
    showTestnetMessageInDropdown: PropTypes.bool.isRequired,
    hideTestNetMessage: PropTypes.func.isRequired,
    history: PropTypes.object,
  };

  getContext(address, network) {
    const QUAI_CONTEXTS =
      network === QUAI_MAINNET ? QUAI_MAIN_CONTEXTS : QUAI_TEST_CONTEXTS;
    let context = QUAI_CONTEXTS.filter((obj) => {
      let num = parseInt(Number('0x' + address.substring(2, 4)), 10);
      let start = parseInt(Number('0x' + obj.byte[0]), 10);
      let end = parseInt(Number('0x' + obj.byte[1]), 10);
      return num >= start && num <= end;
    });
    if (context && context[0]) return context[0];
    else return QUAI_CONTEXTS[0];
  }

  handleClick(newProviderType) {
    const {
      provider: { type: providerType },
      setProviderType,
    } = this.props;
    const { metricsEvent } = this.context;
    metricsEvent({
      eventOpts: {
        category: 'Navigation',
        action: 'Home',
        name: 'Switched Networks',
      },
      customVariables: {
        fromNetwork: providerType,
        toNetwork: newProviderType,
      },
    });
    setProviderType(newProviderType);
  }

  handleQuaiNetwork(newProviderType) {
    const {
      provider: { type: providerType },
      selectedAddress,
      updateRpcTarget,
    } = this.props;
    const { metricsEvent } = this.context;
    metricsEvent({
      eventOpts: {
        category: 'Navigation',
        action: 'Home',
        name: 'Switched Networks',
      },
      customVariables: {
        fromNetwork: providerType,
        toNetwork: newProviderType,
      },
    });
    const selectedNetwork = this.getContext(selectedAddress);
    updateRpcTarget(
      selectedNetwork['rpc'],
      selectedNetwork['id'],
      'QUAI',
      NETWORK_TO_NAME_MAP[newProviderType],
      {
        blockExplorerUrl: selectedNetwork['blockExplorerUrl'],
      },
    );
  }

  renderAddCustomButton() {
    const style = {
      width: '100%',
      left: '40px',
      color: 'white',
      background: 'rgba(0, 0, 0, 0.75)',
      borderRadius: '20px',
      textTransform: 'none',
    };

    return (
      <Button
        type="submit"
        style={style}
        variant="contained"
        size="large"
        onClick={() => {
          if (getEnvironmentType() === ENVIRONMENT_TYPE_POPUP) {
            global.platform.openExtensionInBrowser(ADD_NETWORK_ROUTE);
          } else {
            this.props.history.push(ADD_NETWORK_ROUTE);
          }
          this.props.hideNetworkDropdown();
        }}
      >
        {this.context.t('addNetwork')}
      </Button>
    );
  }

  renderCustomRpcList(rpcListDetail, provider) {
    const reversedRpcListDetail = rpcListDetail.slice().reverse();

    return reversedRpcListDetail.map((entry) => {
      const { rpcUrl, chainId, ticker = 'ETH', nickname = '' } = entry;
      const isCurrentRpcTarget =
        provider.type === NETWORK_TYPE_RPC && rpcUrl === provider.rpcUrl;

      return (
        <DropdownMenuItem
          key={`common${rpcUrl}`}
          closeMenu={() => this.props.hideNetworkDropdown()}
          onClick={() => {
            if (isPrefixedFormattedHexString(chainId)) {
              this.props.setRpcTarget(rpcUrl, chainId, ticker, nickname);
            } else {
              this.props.displayInvalidCustomNetworkAlert(nickname || rpcUrl);
            }
          }}
          style={{
            fontSize: '16px',
            lineHeight: '20px',
            padding: '12px 0',
          }}
        >
          {isCurrentRpcTarget ? (
            <i className="fa fa-check" />
          ) : (
            <div className="network-check__transparent">✓</div>
          )}
          <ColorIndicator
            color={COLORS.UI2}
            size={SIZES.LG}
            type={ColorIndicator.TYPES.FILLED}
            borderColor={isCurrentRpcTarget ? COLORS.WHITE : COLORS.UI2}
          />
          <span
            className="network-name-item"
            style={{
              color: isCurrentRpcTarget ? '#ffffff' : '#9b9b9b',
            }}
          >
            {nickname || rpcUrl}
          </span>
          {isCurrentRpcTarget ? null : (
            <i
              className="fa fa-times delete"
              onClick={(e) => {
                e.stopPropagation();
                this.props.showConfirmDeleteNetworkModal({
                  target: rpcUrl,
                  onConfirm: () => undefined,
                });
              }}
            />
          )}
        </DropdownMenuItem>
      );
    });
  }

  getNetworkName() {
    const { provider } = this.props;
    const providerName = provider.type;

    let name;

    if (providerName === 'mainnet') {
      name = this.context.t('mainnet');
    } else if (providerName === 'quai_mainnet') {
      name = this.context.t('quai_mainnet');
    } else if (providerName === 'quai_testnet') {
      name = this.context.t('quai_testnet');
    } else if (providerName === 'ropsten') {
      name = this.context.t('ropsten');
    } else if (providerName === 'kovan') {
      name = this.context.t('kovan');
    } else if (providerName === 'rinkeby') {
      name = this.context.t('rinkeby');
    } else if (providerName === 'goerli') {
      name = this.context.t('goerli');
    } else if (providerName === 'localhost') {
      name = this.context.t('localhost');
    } else {
      name = provider.nickname || this.context.t('unknownNetwork');
    }

    return name;
  }

  renderNetworkEntry(network) {
    const {
      provider: { type: providerType },
    } = this.props;
    return (
      <DropdownMenuItem
        key={network}
        closeMenu={this.props.hideNetworkDropdown}
        onClick={() => this.handleClick(network)}
        style={DROP_DOWN_MENU_ITEM_STYLE}
      >
        {providerType === network ? (
          <i className="fa fa-check" />
        ) : (
          <div className="network-check__transparent">✓</div>
        )}
        <ColorIndicator
          color={network}
          size={SIZES.LG}
          type={ColorIndicator.TYPES.FILLED}
          borderColor={providerType === network ? COLORS.WHITE : network}
        />
        <span
          className="network-name-item"
          style={{
            color: providerType === network ? '#ffffff' : '#9b9b9b',
          }}
        >
          {this.context.t(network)}
        </span>
      </DropdownMenuItem>
    );
  }

  renderQuaiNetworkEntry(network) {
    const {
      provider: { nickname: providerNickname },
    } = this.props;
    return (
      <DropdownMenuItem
        key={network}
        closeMenu={this.props.hideNetworkDropdown}
        onClick={() => this.handleQuaiNetwork(network)}
        style={DROP_DOWN_MENU_ITEM_STYLE}
      >
        {providerNickname === NETWORK_TO_NAME_MAP[network] ? (
          <i className="fa fa-check" />
        ) : (
          <div className="network-check__transparent">✓</div>
        )}
        <ColorIndicator
          color={network}
          size={SIZES.LG}
          type={ColorIndicator.TYPES.FILLED}
          borderColor={
            providerNickname === NETWORK_TO_NAME_MAP[network]
              ? COLORS.WHITE
              : network
          }
        />
        <span
          className="network-name-item"
          style={{
            color:
              providerNickname === NETWORK_TO_NAME_MAP[network]
                ? '#ffffff'
                : '#9b9b9b',
          }}
        >
          {this.context.t(network)}
        </span>
      </DropdownMenuItem>
    );
  }

  render() {
    const {
      history,
      hideNetworkDropdown,
      shouldShowTestNetworks,
      showTestnetMessageInDropdown,
      hideTestNetMessage,
    } = this.props;
    const rpcListDetail = this.props.frequentRpcListDetail;
    const isOpen = this.props.networkDropdownOpen;
    const { t } = this.context;
    console.log({ props: this.props.provider });

    return (
      <Dropdown
        isOpen={isOpen}
        onClickOutside={(event) => {
          const { classList } = event.target;
          const isInClassList = (className) => classList.contains(className);
          const notToggleElementIndex = notToggleElementClassnames.findIndex(
            isInClassList,
          );

          if (notToggleElementIndex === -1) {
            event.stopPropagation();
            hideNetworkDropdown();
          }
        }}
        containerClassName="network-droppo"
        zIndex={55}
        style={{
          position: 'absolute',
          top: '58px',
          width: '309px',
          zIndex: '55px',
        }}
        innerStyle={{
          padding: '18px 8px',
        }}
      >
        <div className="network-dropdown-header">
          <div className="network-dropdown-title">{t('networks')}</div>
          <div className="network-dropdown-divider" />
          {showTestnetMessageInDropdown ? (
            <div className="network-dropdown-content">
              {t('defaultNetwork')}
              <button
                title={t('dismiss')}
                onClick={hideTestNetMessage}
                className="fas fa-times network-dropdown-content--close"
              />
            </div>
          ) : null}
        </div>

        <div className="network-dropdown-list">
          {/* {this.renderNetworkEntry('quai_mainnet')}
          {this.renderNetworkEntry('quai_testnet')} */}
          {this.renderQuaiNetworkEntry('quai_mainnet')}
          {this.renderQuaiNetworkEntry('quai_testnet')}
          {this.renderNetworkEntry('mainnet')}

          {this.renderCustomRpcList(rpcListDetail, this.props.provider)}

          {/* <div
            className={classnames('network-dropdown-testnets', {
              'network-dropdown-testnets--no-visibility': !shouldShowTestNetworks,
            })}
          >
            {this.renderNetworkEntry('ropsten')}
            {this.renderNetworkEntry('kovan')}
            {this.renderNetworkEntry('rinkeby')}
            {this.renderNetworkEntry('goerli')}
            {this.renderNetworkEntry('localhost')}
          </div> */}
        </div>

        {this.renderAddCustomButton()}
      </Dropdown>
    );
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(NetworkDropdown);
