import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import contractMap from 'eth-contract-metadata'
import BigNumber from 'bignumber.js'
import { shuffle } from 'lodash'
import { getValueFromWeiHex } from '../helpers/utils/conversions.util'
import { checksumAddress } from '../helpers/utils/util'
import { getTokenFiatAmount } from '../helpers/utils/token-util'
import { getTokenExchangeRates, getConversionRate, getCurrentCurrency } from '../selectors'
import { getSwapsTokens } from '../ducks/swaps/swaps'
import { ETH_SWAPS_TOKEN_OBJECT } from '../helpers/constants/swaps'
import { useEqualityCheck } from './useEqualityCheck'

const tokenList = shuffle(Object.entries(contractMap)
  .map(([address, tokenData]) => ({ ...tokenData, address: address.toLowerCase() }))
  .filter((tokenData) => Boolean(tokenData.erc20)))

export function getRenderableTokenData (token, contractExchangeRates, conversionRate, currentCurrency) {
  const { symbol, name, address, iconUrl, string, balance, decimals } = token

  const formattedFiat = getTokenFiatAmount(
    symbol === 'ETH' ? 1 : contractExchangeRates[address],
    conversionRate,
    currentCurrency,
    string,
    symbol,
  ) || ''
  const rawFiat = getTokenFiatAmount(
    symbol === 'ETH' ? 1 : contractExchangeRates[address],
    conversionRate,
    currentCurrency,
    string,
    symbol,
    true,
  ) || ''

  const usedIconUrl = iconUrl || (contractMap[checksumAddress(address)] && `images/contract/${contractMap[checksumAddress(address)].logo}`)
  return {
    ...token,
    primaryLabel: symbol,
    secondaryLabel: name || contractMap[checksumAddress(address)]?.name,
    rightPrimaryLabel: string && `${(new BigNumber(string)).round(6).toString()} ${symbol}`,
    rightSecondaryLabel: formattedFiat,
    iconUrl: usedIconUrl,
    identiconAddress: usedIconUrl ? null : address,
    balance,
    decimals,
    name: name || contractMap[checksumAddress(address)]?.name,
    rawFiat,
  }
}

export function useTokensToSearch ({ providedTokens, rawEthBalance, usersTokens = [], topTokens = {}, onlyEth }) {
  const tokenConversionRates = useSelector(getTokenExchangeRates)
  const memoizedTokenConversionRates = useEqualityCheck(tokenConversionRates)
  const conversionRate = useSelector(getConversionRate)
  const currentCurrency = useSelector(getCurrentCurrency)

  const memoizedTopTokens = useEqualityCheck(topTokens)

  const swapsTokens = useSelector(getSwapsTokens) || []
  let tokensToSearch
  if (onlyEth) {
    tokensToSearch = []
  } else if (providedTokens) {
    tokensToSearch = providedTokens
  } else if (swapsTokens.length) {
    tokensToSearch = swapsTokens
  } else {
    tokensToSearch = tokenList
  }
  const memoizedTokensToSearch = useEqualityCheck(tokensToSearch)

  return useMemo(() => {
    const decEthBalance = getValueFromWeiHex({ value: rawEthBalance, numberOfDecimals: 4, toDenomination: 'ETH' })
    const ethToken = getRenderableTokenData(
      { ...ETH_SWAPS_TOKEN_OBJECT, balance: rawEthBalance, string: decEthBalance },
      memoizedTokenConversionRates,
      conversionRate,
      currentCurrency,
    )

    const usersTokensAddressMap = usersTokens.reduce((acc, token) => ({ ...acc, [token.address]: token }), {})

    const tokensToSearchBuckets = {
      owned: [ethToken],
      top: [],
      others: [],
    }
    memoizedTokensToSearch.forEach((token) => {
      const renderableDataToken = getRenderableTokenData({ ...usersTokensAddressMap[token.address], ...token }, memoizedTokenConversionRates, conversionRate, currentCurrency)
      if (usersTokensAddressMap[token.address] && ((renderableDataToken.symbol === 'ETH') || Number(renderableDataToken.balance ?? 0) !== 0)) {
        tokensToSearchBuckets.owned.push(renderableDataToken)
      } else if (memoizedTopTokens[token.address]) {
        tokensToSearchBuckets.top[memoizedTopTokens[token.address].index] = renderableDataToken
      } else {
        tokensToSearchBuckets.others.push(renderableDataToken)
      }
    })

    tokensToSearchBuckets.owned = tokensToSearchBuckets.owned.sort(({ rawFiat }, { rawFiat: secondRawFiat }) => {
      return ((new BigNumber(rawFiat)).gt(secondRawFiat) ? -1 : 1)
    })
    tokensToSearchBuckets.top = tokensToSearchBuckets.top.filter((token) => token)
    return [
      ...tokensToSearchBuckets.owned,
      ...tokensToSearchBuckets.top,
      ...tokensToSearchBuckets.others,
    ]
  }, [memoizedTokensToSearch, rawEthBalance, usersTokens, memoizedTokenConversionRates, conversionRate, currentCurrency, memoizedTopTokens])
}
