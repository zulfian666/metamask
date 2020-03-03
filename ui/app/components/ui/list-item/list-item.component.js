
import React from 'react'
import PropTypes from 'prop-types'
import Approve from '../icon/approve-icon.component'
import Interaction from '../icon/interaction-icon.component'
import Preloader from '../icon/preloader-icon.component'
import Send from '../icon/send-icon.component'

const SendIcon = () => (
  <Send
    className="list-item__icon"
    width={28}
    height={28}
    color="#2F80ED"
  />
)

const InteractionIcon = () => (
  <Interaction
    className="list-item__icon"
    width={28}
    height={28}
    color="#2F80ED"
  />
)

const ApproveIcon = () => (
  <Approve
    className="list-item__icon"
    width={28}
    height={28}
    color="#2F80ED"
  />
)

const FailIcon = () => (
  <Interaction
    className="list-item__icon"
    width={28}
    height={28}
    color="#D73A49"
  />
)

const Item = ({
  className,
  status,
  title,
  subtitle,
  children,
  nativeCurrency,
  currentCurrency,
}) => {
  const isApproved = status === 'approved'
  const isPending = status === 'pending'
  const isFailed = status === 'failed'

  if (status === 'unapproved') {
    subtitle = (
      <h3 className="list-item__subheading">
        <span className="list-item__status--unapproved">Unapproved</span> · {subtitle}
      </h3>
    )
  }

  if (isFailed) {
    subtitle = (
      <h3 className="list-item__subheading">
        <span className="list-item__status--failed">Failed</span> · {subtitle}
      </h3>
    )
  }

  return (
    <div className={className}>
      <div className="list-item__col">
        {isApproved ? (
          <ApproveIcon />
        ) : isPending ? (
          <SendIcon />
        ) : isFailed ? (
          <FailIcon />
        ) : (
          <InteractionIcon />
        )}
      </div>
      <div className={`list-item__col main${isApproved ? ' list-item__approved' : ''}`}>
        {typeof title === 'string' ? (
          <h2 className="list-item__heading">
            { title } {isPending && (
              <span className="list-item__heading-wrap">
                <Preloader
                  className="list-item__preloader"
                  width={16}
                  height={16}
                  color="#D73A49"
                />
              </span>
            )}
          </h2>
        ) : (
          title
        )}
        {typeof subtitle === 'string' ? (
          <h3 className="list-item__subheading">{ subtitle }</h3>
        ) : (
          subtitle
        )}
        {children && (
          <div className="list-item__more">
            { children }
          </div>
        )}
      </div>
      <div className={`list-item__col list-item__amount${isApproved ? ' list-item__approved' : ''}`}>
        <h2 className="list-item__heading">{nativeCurrency}</h2>
        <h3 className="list-item__subheading">{currentCurrency}</h3>
      </div>
    </div>
  )
}

Item.defaultProps = {
  status: 'pending',
}

Item.propTypes = {
  className: PropTypes.string,
  status: PropTypes.string,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]).isRequired,
  subtitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]).isRequired,
  children: PropTypes.node,
  nativeCurrency: PropTypes.string,
  currentCurrency: PropTypes.string,
}

export default Item
