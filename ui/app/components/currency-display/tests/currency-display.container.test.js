import assert from 'assert'
import proxyquire from 'proxyquire'

let mapStateToProps, mergeProps

proxyquire('../currency-display.container.js', {
  'react-redux': {
    connect: (ms, md, mp) => {
      mapStateToProps = ms
      mergeProps = mp
      return () => ({})
    },
  },
})

describe('CurrencyDisplay container', () => {
  describe('mapStateToProps()', () => {
    it('should return the correct props', () => {
      const mockState = {
        metamask: {
          conversionRate: 280.45,
          currentCurrency: 'usd',
          fromCurrency: 'ETH',
        },
      }

      assert.deepEqual(mapStateToProps(mockState), {
        conversionRate: 280.45,
        currentCurrency: 'usd',
        fromCurrency: 'ETH',
      })
    })
  })

  describe('mergeProps()', () => {
    it('should return the correct props', () => {
      const mockStateProps = {
        conversionRate: 280.45,
        currentCurrency: 'usd',
        fromCurrency: 'ETH',
      }

      const tests = [
        {
          props: {
            value: '0x2386f26fc10000',
            numberOfDecimals: 2,
            currency: 'usd',
            fromCurrency: 'ETH',
          },
          result: {
            displayValue: '$2.80',
            suffix: 'USD',
            fromCurrency: 'ETH',
          },
        },
        {
          props: {
            value: '0x2386f26fc10000',
            fromCurrency: 'ETH',
          },
          result: {
            displayValue: '$2.80',
            suffix: 'USD',
            fromCurrency: 'ETH',
          },
        },
        {
          props: {
            value: '0x1193461d01595930',
            currency: 'ETH',
            fromCurrency: 'ETH',
            numberOfDecimals: 3,
          },
          result: {
            displayValue: '1.266',
            suffix: 'ETH',
            fromCurrency: 'ETH',
          },
        },
        {
          props: {
            value: '0x1193461d01595930',
            currency: 'ETH',
            fromCurrency: 'ETH',
            numberOfDecimals: 3,
            hideLabel: true,
          },
          result: {
            fromCurrency: 'ETH',
            displayValue: '1.266',
            suffix: undefined,
          },
        },
        {
          props: {
            value: '0x3b9aca00',
            currency: 'ETH',
            fromCurrency: 'ETH',
            denomination: 'GWEI',
            hideLabel: true,
          },
          result: {
            fromCurrency: 'ETH',
            displayValue: '1',
            suffix: undefined,
          },
        },
        {
          props: {
            value: '0x3b9aca00',
            currency: 'ETH',
            fromCurrency: 'ETH',
            denomination: 'WEI',
            hideLabel: true,
          },
          result: {
            fromCurrency: 'ETH',
            displayValue: '1000000000',
            suffix: undefined,
          },
        },
        {
          props: {
            value: '0x3b9aca00',
            currency: 'ETH',
            fromCurrency: 'ETH',
            numberOfDecimals: 100,
            hideLabel: true,
          },
          result: {
            fromCurrency: 'ETH',
            displayValue: '1e-9',
            suffix: undefined,
          },
        },
      ]

      tests.forEach(({ props, result }) => {
        assert.deepEqual(mergeProps(mockStateProps, {}, { ...props }), result)
      })
    })
  })
})
