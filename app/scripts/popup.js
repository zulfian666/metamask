const injectCss = require('inject-css')
const OldMetaMaskUiCss = require('../../old-ui/css')
const NewMetaMaskUiCss = require('../../ui/css')
const startPopup = require('./popup-core')
const PortStream = require('./lib/port-stream.js')
const isPopupOrNotification = require('./lib/is-popup-or-notification')
const extension = require('extensionizer')
const ExtensionPlatform = require('./platforms/extension')
const NotificationManager = require('./lib/notification-manager')
const notificationManager = new NotificationManager()

// create platform global
global.platform = new ExtensionPlatform()

// identify window type (popup, notification)
const windowType = isPopupOrNotification()
global.METAMASK_UI_TYPE = windowType
closePopupIfOpen(windowType)

// setup stream to background
const extensionPort = extension.runtime.connect({ name: windowType })
const connectionStream = new PortStream(extensionPort)

// start ui
const container = document.getElementById('app-content')
startPopup({ container, connectionStream }, (err, store) => {
  if (err) return displayCriticalError(err)

  let betaUIState = store.getState().metamask.featureFlags.betaUI
  let css = betaUIState ? NewMetaMaskUiCss() : OldMetaMaskUiCss()
  let deleteInjectedCss = injectCss(css)
  let newBetaUIState

  store.subscribe(() => {
    const state = store.getState()
    newBetaUIState = state.metamask.featureFlags.betaUI
    if (newBetaUIState !== betaUIState) {
      deleteInjectedCss()
      betaUIState = newBetaUIState
      css = betaUIState ? NewMetaMaskUiCss() : OldMetaMaskUiCss()
      deleteInjectedCss = injectCss(css)
    }
    if (state.appState.shouldClose) notificationManager.closePopup()
  })
})


function closePopupIfOpen (windowType) {
  if (windowType !== 'notification') {
    notificationManager.closePopup()
  }
}

function displayCriticalError (err) {
  container.innerHTML = '<div class="critical-error">The MetaMask app failed to load: please open and close MetaMask again to restart.</div>'
  container.style.height = '80px'
  log.error(err.stack)
  throw err
}
