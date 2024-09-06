import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { createBridgeMockStore } from '../../../test/jest/mock-store';
import { CHAIN_IDS } from '../../../shared/constants/network';
import { setBackgroundConnection } from '../../store/background-connection';
import {
  BridgeUserAction,
  BridgeBackgroundAction,
} from '../../../app/scripts/controllers/bridge/types';
import bridgeReducer from './bridge';
import { setBridgeFeatureFlags, setFromChain, setToChain } from './actions';

const middleware = [thunk];

describe('Ducks - Bridge', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const store = configureMockStore<any>(middleware)(createBridgeMockStore());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setToChain', () => {
    it('calls the "bridge/setToChain" action and the selectDestNetwork background action', () => {
      const state = store.getState().bridge;
      const actionPayload = { chainId: CHAIN_IDS.OPTIMISM, id: '2313-314njk' };

      const mockSelectDestNetwork = jest.fn().mockReturnValue({});
      setBackgroundConnection({
        [BridgeUserAction.SELECT_DEST_NETWORK]: mockSelectDestNetwork,
      } as never);

      store.dispatch(setToChain(actionPayload as never) as never);

      // Check redux state
      const actions = store.getActions();
      expect(actions[0].type).toBe('bridge/setToChain');
      const newState = bridgeReducer(state, actions[0]);
      expect(newState.toChain).toBe(actionPayload);
      // Check background state
      expect(mockSelectDestNetwork).toHaveBeenCalledTimes(1);
      expect(mockSelectDestNetwork).toHaveBeenCalledWith(
        '0xa',
        expect.anything(),
      );
    });
  });

  describe('setBridgeFeatureFlags', () => {
    it('should call setBridgeFeatureFlags in the background', async () => {
      const mockSetBridgeFeatureFlags = jest.fn();
      setBackgroundConnection({
        [BridgeBackgroundAction.SET_FEATURE_FLAGS]: mockSetBridgeFeatureFlags,
      } as never);
      store.dispatch(setBridgeFeatureFlags() as never);
      expect(mockSetBridgeFeatureFlags).toHaveBeenCalledTimes(1);
    });
  });

  describe('setFromChain', () => {
    it('calls the setActiveNetwork and selectSrcNetwork background actions', async () => {
      const mockSetActiveNetwork = jest.fn().mockReturnValue({});
      const mockSelectSrcNetwork = jest.fn().mockReturnValue({});
      setBackgroundConnection({
        setActiveNetwork: mockSetActiveNetwork,
        [BridgeUserAction.SELECT_SRC_NETWORK]: mockSelectSrcNetwork,
      } as never);

      const actionPayload = {
        chainId: CHAIN_IDS.MAINNET,
        id: '2313-314njk',
      };
      await store.dispatch(setFromChain(actionPayload as never) as never);

      expect(mockSetActiveNetwork).toHaveBeenCalledTimes(1);
      expect(mockSetActiveNetwork).toHaveBeenCalledWith(
        '2313-314njk',
        expect.anything(),
      );

      expect(mockSelectSrcNetwork).toHaveBeenCalledTimes(1);
      expect(mockSelectSrcNetwork).toHaveBeenCalledWith(
        '0x1',
        expect.anything(),
      );
    });
  });
});
